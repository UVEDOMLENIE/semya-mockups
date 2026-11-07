/* Вариант 2 «Один человек в день». Свой движок. Общие с другими — только people.js и notes.js.
   Всё хранится в этом браузере (semya-v2-state). ?reset=1 — начать заново. */
(function () {
  const D = window.SEMYA_DATA, KEY = 'semya-v2-state';
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (/[?&]reset=1/.test(location.search)) { try { localStorage.removeItem(KEY); } catch (e) {} history.replaceState(null, '', location.pathname); }

  const fresh = () => ({ step: 'start', tab: 'today', iv: { i: 0, log: [], ans: [], no: [] }, day: 0, seen: false, dec: {}, conv: {}, open: null, paused: false });
  let S; try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  // #state=… — открыть макет в заданном месте (для картинок на главной)
  { const H = location.hash.match(/^#state=(.+)/); if (H) { try { S = JSON.parse(decodeURIComponent(H[1])); } catch (e) {} } }

  const REGIONS = ['Тверская область', 'Москва', 'Санкт-Петербург', 'Ленинградская область', 'Новгородская область', 'Ярославская область', 'Псковская область', 'Тульская область', 'Другой регион'];
  const QUOTES = ['Семья — это не главное. Это всё.', 'Семья — как дерево: ветви растут в разных направлениях, а корни остаются одним целым.', 'Семейный круг — безопасная гавань.', 'В семье любовь выражается не только в словах, но и в поступках.', 'Счастье — это знать, что где-то тебя ждут.', 'Семья — это сердце дома.'];
  const NO = ['не хочет детей', 'курит', 'живёт в другом регионе', 'уже есть дети', 'ничего из этого'];
  const REACT = { deti: 'Начнём с главного — с детей. Это первое, на чём расходятся пары.', dengi: 'Понятно. Теперь про деньги: это вторая причина ссор после детей, поэтому спрашиваем сразу.', rod: 'Спасибо. Теперь про родителей — у кого-то это главный вопрос, у кого-то вообще не вопрос.', ssory: 'И последнее — как вы ссоритесь. Не бойтесь, ссорятся все. Важно как.' };

  // Шаги собеседования
  const STEPS = [
    { k: 'name', q: 'Здравствуйте! Я задам несколько вопросов — по одному, как в переписке. Займёт минут десять. Как к вам обращаться?', type: 'text', ph: 'Имя' },
    { k: 'g', q: (v) => `Очень приятно, ${esc(v.name)}. Вы — женщина или мужчина?`, opts: ['Женщина', 'Мужчина'] },
    { k: 'year', q: 'Какого вы года рождения?', type: 'select', opts: Array.from({ length: 48 }, (_, i) => String(2007 - i)) },
    { k: 'region', q: 'Где живёте?', type: 'select', opts: REGIONS },
    { k: 'kids', q: 'Дети у вас есть?', opts: ['Нет', 'Есть, живут со мной', 'Есть, уже взрослые'] },
    ...D.QUESTIONS.map((Q, n) => ({ k: 'q' + n, n, q: (n % 2 === 0 ? REACT[Q.theme] + ' ' : '') + Q.q, opts: Q.a })),
    { k: 'no', q: 'Чего для вас точно нет? Можно выбрать несколько. Таких людей я даже не покажу.', type: 'multi', opts: NO },
    { k: 'fam', q: 'И напоследок: какая фраза о семье — ваша? Её увидит тот, с кем мы вас познакомим.', opts: QUOTES },
  ];

  /* ---------- подсчёт ---------- */
  const userAns = () => D.QUESTIONS.map((_, n) => S.iv.ans[n] ?? 1);
  const myG = () => (S.iv.g === 'Мужчина' ? D.M : D.W);
  const pron = (p) => (p.g === D.M ? { on: 'он', ego: 'его', emu: 'ему', nash: 'нашёл' } : { on: 'она', ego: 'её', emu: 'ей', nash: 'нашла' });
  function queue() {
    const a = userAns(), no = S.iv.no || [];
    return D.PEOPLE.filter((p) => p.g !== myG())
      .filter((p) => !(no.includes('не хочет детей') && p.ans[0] === 2))
      .filter((p) => !(no.includes('курит') && p.smokes))
      .filter((p) => !(no.includes('живёт в другом регионе') && p.region !== S.iv.region))
      .filter((p) => !(no.includes('уже есть дети') && p.kids !== 'no'))
      .map((p) => { const th = D.byTheme(a, p); return { p, th, ok: th.filter((x) => x.d <= 0.5).length, sum: th.reduce((s, x) => s + x.d, 0) }; })
      .filter((x) => x.ok >= 3).sort((x, y) => x.sum - y.sum).slice(0, 7);
  }
  function why(x) {
    const a = userAns(), same = x.th.filter((t) => t.d === 0), talk = x.th.filter((t) => t.d >= 1), near = x.th.filter((t) => t.d === 0.5);
    const s = [];
    if (same.length) s.push('Вы оба ' + same.slice(0, 2).map((t) => D.SHORT[t.idx[0]][a[t.idx[0]]]).join(' и оба ') + '.');
    if (same.length > 2) s.push('И ещё про ' + same.slice(2).map((t) => t.acc).join(' и ') + ' вы ответили одинаково.');
    if (near.length) s.push('Про ' + near.map((t) => t.acc).join(' и ') + ' — почти одинаково, разница в мелочах.');
    if (talk.length) s.push('А вот про ' + talk.map((t) => t.acc).join(' и ') + ' вы ответили по-разному. С этого и стоит начать разговор.');
    else s.push('Расхождений в главном мы не нашли — но поговорить всё равно стоит.');
    return s.join(' ');
  }
  function letter() {
    const a = userAns(), L = [];
    D.THEMES.forEach((t, ti) => { L.push('Вы ' + D.SHORT[ti * 2][a[ti * 2]] + ', а ещё ' + D.SHORT[ti * 2 + 1][a[ti * 2 + 1]] + '.'); });
    const strong = [], agree = [];
    if (a[0] < 2) strong.push('Вы знаете, чего хотите про детей, — это редкость и большая помощь будущей паре.'); else strong.push('Вы честно говорите, что новых детей не планируете. Это уважение к партнёру.');
    if (a[3] === 0) strong.push('Вы умеете копить и планировать вместе — на этом держится быт.');
    if (a[6] === 0) strong.push('С вами понятно, где стоишь: вы говорите прямо.');
    if (a[6] === 1) strong.push('Вы не рубите сгоряча: сначала остываете, потом говорите.');
    if (a[7] === 0) strong.push('Вы умеете мириться первым — это сила, а не слабость.');
    if (a[2] === 2) agree.push('Деньги у каждого свои — проговорите это до свадьбы, многие ждут общего котла.');
    if (a[5] === 0) agree.push('Вы готовы жить с родителями. Партнёру это может быть непросто — обсудите на берегу.');
    if (a[6] === 2) agree.push('Вы молчите, пока само не пройдёт. Партнёру важно знать, что молчание — не обида.');
    if (a[7] === 2) agree.push('Мириться «само» получается не у всех — договоритесь, кто делает первый шаг.');
    if (!agree.length) agree.push('Обсудите, как вы делите домашние дела, — об этом мы не спрашивали, а ссорятся часто.');
    return { L, strong: strong.slice(0, 3), agree: agree.slice(0, 2) };
  }

  /* ---------- экраны ---------- */
  const app = () => $('#app');
  const nav = () => (S.step === 'main' ? `<nav class="tabs">${[['today', 'Сегодня'], ['talks', 'Разговоры'], ['me', 'Я']].map(([k, t]) =>
    `<button data-tab="${k}" class="${S.tab === k ? 'on' : ''}">${t}${k === 'talks' && Object.keys(S.conv).length ? ' · ' + Object.keys(S.conv).length : ''}</button>`).join('')}</nav>` : '');
  window.NOTE_PAGE = 'Вариант 2 «Один человек в день»';
  window.NOTE_SCREEN = () => (S.step === 'main' ? (S.open ? 'разговор: ' + S.open : { today: 'сегодня, день ' + (S.day + 1), talks: 'разговоры', me: 'я' }[S.tab]) : { start: 'вход', interview: 'собеседование, вопрос ' + (S.iv.i + 1), portrait: 'портрет', wait: 'ожидание' }[S.step]);

  function render() {
    save();
    const f = { start, interview, portrait, wait, main }[S.step] || start;
    app().innerHTML = f() + nav();
    window.scrollTo(0, S.step === 'interview' ? document.body.scrollHeight : 0);
    if (S.step === 'interview') { const i = $('.chat input'); if (i) i.focus(); }
  }

  function start() {
    return `<section class="hero"><p class="brand">Семь<b>Я</b></p>
      <h1>Не лента анкет. Один человек в день, с кем вы совпадаете в главном.</h1>
      <ul class="three"><li><b>Главное — до первой встречи.</b> Дети, деньги, родители, ссоры.</li>
      <li><b>Один человек в день, а не лента.</b> Каждого прочитаете внимательно.</li>
      <li><b>Сначала разговор о семье, потом телефоны.</b> Номер открывается, только когда оба согласны.</li></ul>
      <button class="btn" data-act="begin">Начать разговор — 10 минут</button>
      <p class="small">Совпадение — подсказка, а не приговор. Люди в макете выдуманные.</p></section>`;
  }

  function interview() {
    const st = STEPS[S.iv.i];
    const q = typeof st.q === 'function' ? st.q(S.iv) : st.q;
    let input = '';
    if (st.type === 'text') input = `<form class="say" data-form="text"><input name="v" placeholder="${st.ph}" autocomplete="off"><button>→</button></form>`;
    else if (st.type === 'select') input = `<form class="say" data-form="text"><select name="v">${st.opts.map((o) => `<option${o === '1985' ? ' selected' : ''}>${o}</option>`).join('')}</select><button>→</button></form>`;
    else if (st.type === 'multi') input = `<div class="opts">${st.opts.map((o) => `<button class="chip${(S.iv.no || []).includes(o) ? ' sel' : ''}" data-multi="${esc(o)}">${esc(o)}</button>`).join('')}</div><button class="btn" data-act="multi-done">Готово</button>`;
    else input = `<div class="opts">${st.opts.map((o, k) => `<button class="chip" data-pick="${k}">${esc(o)}</button>`).join('')}</div>`;
    return `<div class="chat-head"><b>СемьЯ</b><small>${STEPS.length - S.iv.i > 1 ? 'ещё ' + (STEPS.length - S.iv.i) + ' вопр.' : 'последний вопрос'}</small></div>
      <div class="chat">${S.iv.log.map((m) => `<p class="b ${m.me ? 'me' : ''}">${m.t}</p>`).join('')}<p class="b">${q}</p></div>
      <div class="input">${input}${S.iv.i > 0 ? '<button class="link" data-act="iv-back">← на шаг назад</button>' : ''}</div>`;
  }
  function answer(val, shown) {
    const st = STEPS[S.iv.i];
    const q = typeof st.q === 'function' ? st.q(S.iv) : st.q;
    S.iv.log.push({ t: q }, { t: esc(shown ?? val), me: true });
    if (st.n != null) S.iv.ans[st.n] = val; else S.iv[st.k] = val;
    S.iv.i++;
    if (S.iv.i >= STEPS.length) { S.iv.log.push({ t: 'Спасибо. Сейчас соберу ваш портрет.' }); S.step = 'portrait'; }
    render();
  }

  function portrait() {
    const p = letter();
    return `<section class="letter"><p class="kick">Ваш семейный портрет</p><h2>${esc(S.iv.name || 'Вы')}, вот что я поняла из ваших ответов</h2>
      ${p.L.map((s) => `<p>${s}</p>`).join('')}
      <h3>Ваши сильные стороны в семье</h3><ul>${p.strong.map((s) => `<li>${s}</li>`).join('')}</ul>
      <h3>О чём стоит договориться на берегу</h3><ul>${p.agree.map((s) => `<li>${s}</li>`).join('')}</ul>
      <p class="small">Видите только вы. Это зеркало по вашим ответам, а не диагноз.</p></section>
      <button class="btn ghost" data-act="share-portrait">Сохранить портрет себе</button>
      <button class="btn" data-act="to-wait">Дальше</button>`;
  }

  function wait() {
    return `<section class="hero"><p class="kick">Готово</p><h1>Первого человека покажем завтра утром</h1>
      <p>Мы не показываем всех сразу: так вы прочитаете одного внимательно, а не пролистаете семерых.</p>
      <button class="btn" data-act="tomorrow">Перемотать на завтра</button><p class="small">В настоящем сервисе — ждать до утра.</p></section>`;
  }

  function main() {
    if (S.paused) return `<section class="hero"><h1>Мы рады, что вы уходите</h1><p>Так и задумано: сервис, который радуется, когда вы нашли своего человека. Портрет останется у вас.</p>
      <button class="btn ghost" data-act="unpause">Вернуться к подбору</button><button class="btn ghost" data-act="reset">Начать заново</button></section>`;
    if (S.open) return talk(S.open);
    return { today, talks, me }[S.tab]();
  }

  function today() {
    const Q = queue();
    if (!Q.length) return `<section class="hero"><h1>Сегодня никого</h1><p>Не потому что вы плохой — потому что мы не показываем кого попало. Попробуйте ослабить «чего точно нет» во вкладке «Я».</p><p class="small">В макете всего 16 выдуманных людей. В настоящей базе будет больше.</p></section>`;
    if (S.day >= Q.length) return `<section class="hero"><h1>На этой неделе у нас для вас ${Q.length} ${Q.length === 1 ? 'человек' : (Q.length < 5 ? 'человека' : 'человек')}</h1><p>Вы видели всех. В настоящей базе будет больше — новые люди приходят каждый день.</p><button class="btn ghost" data-act="day0">Посмотреть неделю сначала</button></section>`;
    const x = Q[S.day], p = x.p, pr = pron(p), d = S.dec[p.name];
    const dots = Q.map((_, i) => `<i class="${i < S.day ? 'past' : i === S.day ? 'now' : ''}"></i>`).join('');
    return `<div class="dayline"><span>День ${S.day + 1} из ${Q.length}</span><span class="dots">${dots}</span></div>
      <article class="one"><div class="who"><div class="ava">${p.name[0]}</div><div><h2>${p.name}, ${p.age}</h2><small>${p.region} · ${p.jobText} · ${p.kidsText}</small></div></div>
      <div class="why"><p class="kick">Почему мы вас познакомили</p><p>${why(x)}</p></div>
      <blockquote>«${esc(p.fam)}»</blockquote>
      <p class="line">${x.th.filter((t) => t.d <= 0.5).length ? 'Совпали: ' + x.th.filter((t) => t.d <= 0.5).map((t) => t.t).join(', ') : ''}${x.th.filter((t) => t.d > 0.5).length ? ' · Поговорить: ' + x.th.filter((t) => t.d > 0.5).map((t) => t.t).join(', ') : ''}</p>
      ${d === 'talk' ? `<button class="btn" data-open="${p.name}">Открыть разговор с ${pr.on === 'он' ? 'ним' : 'ней'}</button>`
        : d && d.startsWith('no') ? `<p class="small">Вы отметили «не моё» (${d.slice(3) || 'без причины'}). Сваха запомнит.</p>`
        : S.noAsk === p.name ? `<p class="kick">Почему не ваше? Это поможет следующим подборам</p><div class="opts">${['возраст', 'город', 'дети', 'просто не моё'].map((r) => `<button class="chip" data-no="${r}">${r}</button>`).join('')}</div>`
        : `<div class="two"><button class="btn" data-act="talk" data-p="${p.name}">Начать разговор</button><button class="btn ghost" data-act="no" data-p="${p.name}">Не моё</button></div>`}
      </article>
      ${d ? `<button class="btn ghost" data-act="tomorrow">Перемотать на завтра →</button><p class="small">В настоящем сервисе следующий человек придёт завтра утром.</p>` : ''}`;
  }

  const BEREG = [
    { q: 'Семья для вас — это… одним словом', a: ['опора', 'дом', 'дети', 'команда', 'любовь'] },
    { q: 'Обычное воскресенье через пять лет?', a: ['дома, обед всей семьёй', 'куда-то едем', 'каждый своим, вечером вместе'] },
    { q: 'О чём договориться до свадьбы? Выберите два', a: ['деньги', 'дети', 'где живём', 'родители', 'работа'], two: true },
  ];
  function talk(name) {
    const p = D.PEOPLE.find((x) => x.name === name), pr = pron(p), c = S.conv[name];
    const head = `<button class="link" data-act="close">← назад</button><div class="who sm"><div class="ava">${p.name[0]}</div><div><b>${p.name}, ${p.age}</b><small>${c.stage === 'chat' || c.stage === 'phones' ? 'переписка открыта' : 'разговор на берегу'}</small></div></div>`;
    if (c.stage === 'bereg') {
      const i = c.my.length, B = BEREG[i];
      if (i === 0 && !c.started) return head + `<section class="hero sm"><h2>Сначала — разговор на берегу</h2><p>Прежде чем открыть переписку, вы оба ответите на три вопроса. Так первый разговор начнётся с главного, а не с «привет, как дела».</p><button class="btn" data-act="bereg-go">Ответить на три вопроса</button></section>`;
      return head + `<p class="kick">Вопрос ${i + 1} из 3</p><h2>${B.q}</h2><div class="opts">${B.a.map((o) => `<button class="chip${(c.tmp || []).includes(o) ? ' sel' : ''}" data-bereg="${o}">${o}</button>`).join('')}</div>${B.two ? '<button class="btn" data-act="bereg-two">Готово</button>' : ''}`;
    }
    if (c.stage === 'waiting') return head + `<section class="hero sm"><h2>Вы ответили. Ждём, когда ответит ${p.name}</h2><p>${pr.on === 'он' ? 'Ему' : 'Ей'} придут те же три вопроса.</p><button class="btn" data-act="bereg-reveal">Перемотать: ${p.name} ответил${p.g === D.M ? '' : 'а'}</button></section>`;
    if (c.stage === 'answered') {
      const rows = BEREG.map((B, i) => `<div class="pair"><small>${B.q}</small><div><span>Вы: <b>${c.my[i]}</b></span><span>${p.name}: <b>${p.bereg[i]}</b></span></div></div>`).join('');
      const same = BEREG.map((B, i) => (i < 2 ? c.my[i] === p.bereg[i] : c.my[i].split(', ').some((w) => p.bereg[i].includes(w))));
      const lab = ['что такое семья', 'воскресенье', 'о чём договориться'];
      return head + `<h2>Ответы на берегу</h2>${rows}<p class="sum">${same.some(Boolean) ? 'Сходится: ' + lab.filter((_, i) => same[i]).join(', ') + '. ' : ''}${same.some((s) => !s) ? 'Разошлись: ' + lab.filter((_, i) => !same[i]).join(', ') + ' — с этого и начните.' : ''}</p><button class="btn" data-act="open-chat">Открыть переписку</button>`;
    }
    const msgs = c.msgs.map((m) => `<p class="b ${m.me ? 'me' : ''}">${esc(m.t)}</p>`).join('');
    const mine = c.msgs.filter((m) => m.me).length;
    let phones = '';
    if (c.stage === 'phones') phones = `<div class="plate ok"><b>${p.name} тоже ${p.g === D.M ? 'хочет' : 'хочет'} обменяться.</b> Контакты ${pr.ego}: ${p.contacts.map((k) => `<span>${k}: •••• ${String(p.age * 7).slice(-2)}</span>`).join(' ')}<br><small>Номера выдуманные. В настоящем сервисе ваш контакт тоже откроется только сейчас.</small></div>`;
    else if (mine >= 2) phones = `<div class="plate"><b>Обменяться контактами?</b> Нужно согласие обоих.<button class="btn" data-act="phones">Хочу</button></div>`;
    return head + `<div class="chat talkbox">${msgs || `<p class="small">Напишите первое сообщение. Подсказка: начните с ответа на берегу, где вы разошлись.</p>`}</div>${phones}
      <form class="say" data-form="msg"><input name="v" placeholder="Сообщение" autocomplete="off"><button>→</button></form>
      <p class="small">Ссылки и номера в первых сообщениях скрываются — защита от мошенников.</p>`;
  }

  function talks() {
    const list = Object.keys(S.conv);
    if (!list.length) return `<section class="hero sm"><h2>Разговоров пока нет</h2><p>Нажмите «Начать разговор» на вкладке «Сегодня».</p></section>`;
    const lab = { bereg: 'ждём ваших ответов на берегу', waiting: 'ждём ответа на берегу', answered: 'ответы на берегу пришли', chat: 'переписка открыта', phones: 'обменялись контактами' };
    return `<h2>Разговоры</h2>` + list.map((n) => { const c = S.conv[n], p = D.PEOPLE.find((x) => x.name === n), last = c.msgs[c.msgs.length - 1];
      return `<button class="row" data-open="${n}"><div class="ava">${n[0]}</div><div><b>${n}, ${p.age}</b><small>${lab[c.stage]}${last ? ' · «' + esc(last.t).slice(0, 40) + '»' : ''}</small></div></button>`; }).join('');
  }

  function me() {
    const p = letter();
    return `<h2>${esc(S.iv.name || 'Я')}</h2><section class="letter sm">${p.L.map((s) => `<p>${s}</p>`).join('')}</section>
      <p><b>Чего точно нет:</b> ${(S.iv.no || []).filter((x) => x !== 'ничего из этого').join(', ') || 'ничего не отмечено'}</p>
      <div class="opts">${NO.slice(0, 4).map((o) => `<button class="chip${(S.iv.no || []).includes(o) ? ' sel' : ''}" data-meno="${o}">${o}</button>`).join('')}</div>
      <button class="btn ghost" data-act="redo">Изменить ответы</button>
      <button class="btn" data-act="pause">Я ${S.iv.g === 'Мужчина' ? 'нашёл' : 'нашла'} человека — поставить на паузу</button>
      <button class="btn ghost" data-act="reset">Начать заново</button>`;
  }

  /* ---------- события ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t || t.closest('.bug-dlg') || t.classList.contains('bug')) return;
    const ds = t.dataset, act = ds.act;
    if (ds.tab) { S.tab = ds.tab; S.open = null; return render(); }
    if (ds.pick != null) { const st = STEPS[S.iv.i]; return answer(st.n != null ? +ds.pick : st.opts[+ds.pick], st.opts[+ds.pick]); }
    if (ds.multi) { const no = S.iv.no || (S.iv.no = []); const k = no.indexOf(ds.multi); if (ds.multi === 'ничего из этого') S.iv.no = k < 0 ? ['ничего из этого'] : []; else { S.iv.no = no.filter((x) => x !== 'ничего из этого'); k < 0 ? S.iv.no.push(ds.multi) : S.iv.no.splice(S.iv.no.indexOf(ds.multi), 1); } return render(); }
    if (ds.meno) { const no = (S.iv.no || []).filter((x) => x !== 'ничего из этого'); const k = no.indexOf(ds.meno); k < 0 ? no.push(ds.meno) : no.splice(k, 1); S.iv.no = no; return render(); }
    if (ds.open) { S.open = ds.open; return render(); }
    if (ds.no) { S.dec[S.noAsk] = 'no:' + ds.no; S.noAsk = null; return render(); }
    if (ds.bereg) {
      const c = S.conv[S.open], B = BEREG[c.my.length];
      if (B.two) { c.tmp = c.tmp || []; const k = c.tmp.indexOf(ds.bereg); k < 0 ? (c.tmp.length < 2 && c.tmp.push(ds.bereg)) : c.tmp.splice(k, 1); return render(); }
      c.my.push(ds.bereg); return render();
    }
    switch (act) {
      case 'begin': S.step = 'interview'; break;
      case 'iv-back': S.iv.i--; S.iv.log.splice(-2, 2); break;
      case 'multi-done': S.iv.log.push({ t: STEPS[S.iv.i].q }, { t: (S.iv.no || []).join(', ') || 'ничего из этого', me: true }); S.iv.i++; break;
      case 'to-wait': S.step = 'wait'; break;
      case 'share-portrait': { const p = letter(); const txt = 'Мой семейный портрет — СемьЯ\n\n' + p.L.join(' ') + '\n\nСильные стороны: ' + p.strong.join(' ') + '\n\nДоговориться на берегу: ' + p.agree.join(' ');
        if (navigator.share) navigator.share({ title: 'Мой семейный портрет', text: txt }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => alert('Портрет скопирован')).catch(() => {}); return; }
      case 'tomorrow': if (S.step === 'wait') { S.step = 'main'; S.tab = 'today'; S.day = 0; } else S.day++; break;
      case 'day0': S.day = 0; break;
      case 'talk': S.dec[ds.p] = 'talk'; S.conv[ds.p] = S.conv[ds.p] || { stage: 'bereg', my: [], msgs: [] }; S.open = ds.p; break;
      case 'no': S.noAsk = ds.p; break;
      case 'close': S.open = null; break;
      case 'bereg-go': S.conv[S.open].started = true; break;
      case 'bereg-two': { const c = S.conv[S.open]; if (!c.tmp || c.tmp.length < 1) return; c.my.push(c.tmp.join(', ')); c.tmp = null; c.stage = 'waiting'; break; }
      case 'bereg-reveal': S.conv[S.open].stage = 'answered'; break;
      case 'open-chat': S.conv[S.open].stage = 'chat'; break;
      case 'phones': S.conv[S.open].stage = 'phones'; break;
      case 'redo': S.step = 'interview'; S.iv = { i: 0, log: [], ans: [], no: [] }; S.day = 0; break;
      case 'pause': S.paused = true; break;
      case 'unpause': S.paused = false; break;
      case 'reset': S = fresh(); break;
      default: return;
    }
    render();
  });
  document.addEventListener('submit', (e) => {
    e.preventDefault(); const v = (e.target.v.value || '').trim(); if (!v) return;
    if (e.target.dataset.form === 'text') return answer(v);
    const name = S.open, c = S.conv[name], p = D.PEOPLE.find((x) => x.name === name);
    c.msgs.push({ t: v, me: true }); render();
    const k = c.msgs.filter((m) => !m.me).length;
    if (k < p.chat.length) setTimeout(() => { c.msgs.push({ t: p.chat[k] }); if (S.open === name) render(); else save(); }, 1200);
  });
  document.addEventListener('DOMContentLoaded', render);
})();
