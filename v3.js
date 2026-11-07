/* Вариант 3 «Семь дней вслепую». Свой движок. Общие с другими — только people.js и notes.js.
   Неделя семейной жизни понарошку с одним человеком. Имя и лицо — на седьмой день.
   Всё хранится в этом браузере (semya-v3-state). ?reset=1 — начать заново. */
(function () {
  const D = window.SEMYA_DATA, KEY = 'semya-v3-state';
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (/[?&]reset=1/.test(location.search)) { try { localStorage.removeItem(KEY); } catch (e) {} history.replaceState(null, '', location.pathname); }

  const DAYS = [
    { t: 'Деньги', q: 'Вам на двоих неожиданно достались 300 тысяч. Что делаете?', a: ['Откладываем — подушка безопасности', 'Закрываем долги', 'Едем вдвоём отдыхать'],
      l: ['Подушка — это спокойный сон. Отложим.', 'Долги закрыть — и спать спокойнее.', 'Живём один раз. Едем на море!'] },
    { t: 'Дети', q: 'Ребёнок получил двойку и соврал. Кто разговаривает и как?', a: ['Говорю я — спокойно, один на один', 'Говорим вместе, за столом', 'Пусть сначала остынет, потом разговор'],
      l: ['Мне проще один на один, без свидетелей.', 'Вместе — чтобы видел, что мы заодно.', 'Сгоряча только хуже. Сначала остынем все.'] },
    { t: 'Родители', q: 'Мама одного из вас хочет приехать на месяц. Квартира двухкомнатная.', a: ['Конечно, это же мама', 'На неделю — да, на месяц — снимем ей рядом', 'Нет, у нас своя жизнь'],
      l: ['Мама есть мама. Потерпим, если что.', 'Неделя — радость, месяц — испытание. Снимем рядом.', 'Любим, но в гости. Месяц — это слишком.'] },
    { t: 'Ссора', pre: 'Сегодня ссоримся. Понарошку. Это самый полезный день недели.', q: 'Ты узнаёшь, что партнёр потратил крупную сумму и не сказал.', a: ['Говорю сразу, в лоб', 'Остываю день, потом разговор', 'Промолчу, но запомню'],
      l: ['Скажу сразу. Копить обиды не умею.', 'Мне нужен день, чтобы не наговорить лишнего.', 'Скандалить не буду. Но запомню, честно.'] },
    { t: 'Быт', q: 'Обычное воскресенье через пять лет. Какое оно?', a: ['Дома, обед всей семьёй', 'Куда-то едем', 'Каждый своим, вечером вместе'],
      l: ['Борщ, пироги, все за одним столом.', 'Дача, лес, озеро — лишь бы не дома.', 'Утро — каждый своим, а вечер — вместе.'] },
    { t: 'Кризис', q: 'Один из вас потерял работу на полгода.', a: ['Второй тянет, это нормально', 'Тянем, но ищем работу вместе и быстро', 'Каждый сам за себя'],
      l: ['Для того и семья, чтобы тянуть.', 'Тянем, но и резюме рассылаем вместе.', 'Взрослые люди — каждый сам выплывает.'] },
    { t: 'Главное', q: 'Что ты не простишь никогда?', a: ['Измену', 'Ложь о деньгах', 'Грубость к детям', 'Равнодушие'],
      l: ['Измену. Тут без вариантов.', 'Враньё про деньги. Это про доверие.', 'Если обидят ребёнка — всё.', 'Когда всё равно — это конец.'] },
  ];
  const QUOTES = ['Семья — это не главное. Это всё.', 'Семья — как дерево: корни одни.', 'Семейный круг — безопасная гавань.', 'Семья — это сердце дома.', 'В семье любовь — в поступках, не только в словах.'];
  const NO = ['не хочет детей', 'курит', 'живёт в другом регионе', 'ничего из этого'];
  // Две персоны на пол: «близкий» и «спорный» (чтобы увидеть и удачную, и провальную неделю)
  const PERS = { m: [{ who: 'Андрей', no: 7 }, { who: 'Виктор', no: 12 }], w: [{ who: 'Ольга', no: 3 }, { who: 'Марина', no: 9 }] };

  const fresh = () => ({ step: 'start', tab: 'week', prof: { no: [] }, alt: 0, week: 1, day: 0, phase: 'answer', my: [], votes: [], face: 'none', meet: 'none' });
  let S; try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  // #state=… — открыть макет в заданном месте (для картинок на главной)
  { const H = location.hash.match(/^#state=(.+)/); if (H) { try { S = JSON.parse(decodeURIComponent(H[1])); } catch (e) {} } }

  const lookFor = () => (S.prof.g === 'Мужчина' ? 'w' : 'm');
  const pers = () => { const x = PERS[lookFor()][S.alt]; return Object.assign({ no: x.no }, D.PEOPLE.find((p) => p.name === x.who)); };
  // Ответ партнёра: «близкий» совпадает в 5 днях из 7, «спорный» — почти везде наоборот
  function partner(i) {
    const m = S.my[i], n = DAYS[i].a.length;
    if (S.alt === 0) return [3, 5].includes(i) ? (m === 0 ? 1 : m - 1) : m;
    return i === 4 ? m : (m + 2) % n;
  }
  const pVote = (i) => { const d = Math.abs(S.my[i] - partner(i)); return d === 0 ? '👍' : (d === 1 && DAYS[i].a.length === 3 ? '🤷' : '👎'); };
  const agreed = (i) => S.votes[i] === '👍' && pVote(i) === '👍';
  const score = () => S.votes.filter((_, i) => agreed(i)).length;
  const faceOpen = () => S.face === 'open';
  const yrs = (n) => n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'год' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'года' : 'лет');

  window.NOTE_PAGE = 'Вариант 3 «Семь дней вслепую»';
  window.NOTE_SCREEN = () => (S.step !== 'main' ? { start: 'вход', me: 'кто ты', match: 'подбор' }[S.step] : S.tab === 'week' ? (S.day < 7 ? 'день ' + (S.day + 1) + ' · ' + DAYS[S.day].t : 'итог недели') : S.tab === 'diary' ? 'дневник' : 'я');

  const nav = () => (S.step === 'main' ? `<nav class="tabs">${[['week', 'Неделя'], ['diary', 'Дневник'], ['me', 'Я']].map(([k, t]) => `<button data-tab="${k}" class="${S.tab === k ? 'on' : ''}">${t}</button>`).join('')}</nav>` : '');
  function render() { save(); $('#app').innerHTML = ({ start, me: profile, match, main }[S.step] || start)() + nav(); window.scrollTo(0, 0); }

  function start() {
    return `<section class="hero"><p class="tag">СемьЯ</p><h1>Семь дней<br>вслепую</h1>
      <p class="lead">Неделя семейной жизни понарошку с одним человеком. Каждый день — одна ситуация, на которой разваливаются семьи. Фото и имя откроются на седьмой день.</p>
      <ul class="no-list"><li>Без свайпов.</li><li>Без ленты.</li><li>Без фото до конца недели.</li></ul>
      <button class="btn" data-act="go-me">Начать неделю</button>
      <p class="slogan">Хватит свайпать. Пора жениться.</p><p class="small">Сначала характер — потом лицо. Люди в макете выдуманные.</p></section>`;
  }
  function profile() {
    const P = S.prof, seg = (k, arr) => `<div class="seg">${arr.map((o) => `<button data-set="${k}" data-v="${o}" class="${P[k] === o ? 'sel' : ''}">${o}</button>`).join('')}</div>`;
    return `<h2>Кто ты</h2>
      <div class="field"><label>Имя — его увидят только на седьмой день</label><input data-in="name" value="${esc(P.name || '')}" placeholder="Имя"></div>
      <div class="field"><label>Ты</label>${seg('g', ['Женщина', 'Мужчина'])}</div>
      <div class="field"><label>Год рождения</label><input data-in="year" inputmode="numeric" value="${esc(P.year || '1985')}"></div>
      <div class="field"><label>Регион</label><input data-in="region" value="${esc(P.region || 'Тверская область')}"></div>
      <div class="field"><label>Дети</label>${seg('kids', ['Нет', 'Есть'])}</div>
      <div class="field"><label>Чего точно нет</label><div class="chips2">${NO.map((o) => `<button data-no="${o}" class="${(P.no || []).includes(o) ? 'sel' : ''}">${o}</button>`).join('')}</div></div>
      <div class="field"><label>Твоя фраза о семье</label><div class="chips2 col">${QUOTES.map((o) => `<button data-set="fam" data-v="${o}" class="${P.fam === o ? 'sel' : ''}">«${o}»</button>`).join('')}</div></div>
      <button class="btn" data-act="go-match">Подобрать пару на неделю</button>`;
  }
  function match() {
    if (!S.found) { setTimeout(() => { S.found = true; render(); }, 1600); return `<section class="hero"><h1 class="pulse">Ищем…</h1><p class="lead">Отсекаем «чего точно нет», ищем одного человека на неделю.</p></section>`; }
    const p = pers();
    return `<section class="hero"><p class="tag">Твоя пара на неделю</p><h1>№${p.no}</h1>
      <p class="lead">${yrs(p.age)} · ${p.region} · ${p.kidsText}</p><blockquote>«${esc(p.fam)}»</blockquote>
      <p>Имя и фото — в воскресенье. До этого — только ответы.</p>
      <button class="btn" data-act="start-week">Начать день 1</button></section>`;
  }
  function main() { return { week, diary, me }[S.tab](); }

  const dots = () => `<div class="days">${DAYS.map((d, i) => `<i class="${i < S.day ? (agreed(i) ? 'yes' : 'past') : i === S.day ? 'now' : ''}">${i + 1}</i>`).join('')}</div>`;
  function week() {
    const p = pers(), name = faceOpen() ? p.name : '№' + p.no;
    if (S.day >= 7) return result();
    const d = DAYS[S.day], i = S.day;
    let body = '';
    if (S.phase === 'answer') body = `${d.pre ? `<p class="pre">${d.pre}</p>` : ''}<h2 class="sit">${d.q}</h2>${d.a.map((o, k) => `<button class="opt" data-ans="${k}">${o}</button>`).join('')}`;
    else if (S.phase === 'sent') body = `<h2 class="sit">${d.q}</h2><div class="mine"><small>Ты</small>${d.a[S.my[i]]}</div><p class="wait">Отправлено. ${name} ответит к вечеру. Это нормально: у человека тоже жизнь.</p><button class="btn" data-act="evening">Перемотать на вечер</button>`;
    else {
      const pa = partner(i);
      body = `<h2 class="sit">${d.q}</h2><div class="vs"><div class="mine"><small>Ты</small>${d.a[S.my[i]]}</div><div class="his"><small>${name}</small>${d.a[pa]}<em>«${d.l[pa]}»</em></div></div>` +
        (S.phase === 'reveal' ? `<p class="ask">Вы бы договорились?</p><div class="votes">${['👍', '🤷', '👎'].map((v) => `<button data-vote="${v}">${v}</button>`).join('')}</div>`
          : `<p class="ask">Ты: ${S.votes[i]} · ${name}: ${pVote(i)}</p><p class="score">Договорились: ${score()} из ${i + 1}</p><button class="btn" data-act="next-day">${i < 6 ? 'Следующий день' : 'Итог недели'}</button>`);
    }
    return `<div class="top"><b>День ${i + 1} из 7 · ${d.t}</b><span>${name}</span></div>${dots()}${body}`;
  }
  function result() {
    const p = pers(), sc = score(), ok = sc >= 4;
    let face = '';
    if (S.face === 'none') face = `<button class="btn" data-act="face-ask">Открыть лицо и имя</button><p class="small">Нужно, чтобы нажали оба.</p>`;
    else if (S.face === 'asked') face = `<p class="wait">Ты нажал${S.prof.g === 'Мужчина' ? '' : 'а'}. Ждём №${p.no}.</p><button class="btn" data-act="face-open">Перемотать: №${p.no} тоже нажал${p.g === 'm' ? '' : 'а'}</button>`;
    else face = `<div class="face"><div class="photo">${p.name[0]}</div><div><h2>Это ${p.name}</h2><p>Всю неделю ${p.g === 'm' ? 'он был' : 'она была'} №${p.no}. ${yrs(p.age)}, ${p.region}, ${p.jobText}.</p></div></div>` +
      (S.meet === 'none' ? `<p class="ask">Встретиться?</p><div class="two"><button class="btn" data-act="meet-yes">Да</button><button class="btn ghost" data-act="next-week">Нет, следующая неделя</button></div>`
        : `<div class="plate"><b>${p.name} тоже ${p.g === 'm' ? 'согласен' : 'согласна'}.</b> Контакты: ${p.contacts.join(' и ')} (в макете выдуманные). Под венец — всё равно сам${S.prof.g === 'Мужчина' ? '' : 'а'}.</div><button class="btn ghost" data-act="next-week">Ещё одна неделя с другим человеком</button>`);
    return `<div class="top"><b>Итог недели</b><span>${faceOpen() ? p.name : '№' + p.no}</span></div>${dots()}
      <h1 class="big">${sc} из 7</h1>
      <p class="lead">${ok ? 'Вы договаривались чаще, чем нет. Это больше половины — и это уже не случайность.' : 'Честно: вы договариваетесь редко. Лицо открыть можно из любопытства, но мы бы предложили следующую неделю.'}</p>
      ${!ok && S.face === 'none' ? '<button class="btn" data-act="next-week">Следующая неделя</button>' : ''}${face}`;
  }
  function diary() {
    const p = pers(), name = faceOpen() ? p.name : '№' + p.no;
    if (!S.my.length) return `<h2>Дневник</h2><p class="lead">Пусто. Здесь соберутся все семь дней — ваши ответы рядом. Это и есть портрет пары: не процент, а прожитые ситуации.</p>`;
    return `<h2>Дневник недели</h2><p class="small">Портрет пары — не процент, а семь прожитых ситуаций.</p>` + S.my.map((m, i) => {
      const shown = i < S.day || (S.phase === 'reveal' || S.phase === 'voted');
      return `<div class="drow"><b>${i + 1}. ${DAYS[i].t}</b><div class="vs"><div class="mine"><small>Ты ${S.votes[i] || ''}</small>${DAYS[i].a[m]}</div><div class="his"><small>${name} ${S.votes[i] ? pVote(i) : ''}</small>${shown ? DAYS[i].a[partner(i)] : '…ждём ответа'}</div></div></div>`;
    }).join('');
  }
  function me() {
    const P = S.prof;
    return `<h2>${esc(P.name || 'Я')}</h2><p class="lead">${P.g || ''}, ${P.year || ''} г. р., ${esc(P.region || '')}. Дети: ${P.kids || '—'}.</p>
      <p>Чего точно нет: ${(P.no || []).join(', ') || 'не отмечено'}.</p><p>Фраза о семье: «${esc(P.fam || '—')}»</p>
      <div class="plate"><b>Для проверки макета</b><br>Сейчас неделя с ${S.alt ? '«спорным»' : '«близким»'} человеком. Можно посмотреть, как выглядит неделя, где вы не сходитесь.
      <button class="btn ghost" data-act="toggle">Показать неделю с ${S.alt ? '«близким»' : '«спорным»'} человеком</button></div>
      <button class="btn ghost" data-act="reset">Начать заново</button>`;
  }

  document.addEventListener('input', (e) => { const k = e.target.dataset.in; if (k) { S.prof[k] = e.target.value; save(); } });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t || t.closest('.bug-dlg') || t.classList.contains('bug')) return;
    const ds = t.dataset;
    if (ds.tab) { S.tab = ds.tab; return render(); }
    if (ds.set) { S.prof[ds.set] = ds.v; return render(); }
    if (ds.no) { let n = S.prof.no || []; if (ds.no === 'ничего из этого') n = n.includes(ds.no) ? [] : [ds.no]; else { n = n.filter((x) => x !== 'ничего из этого'); n.includes(ds.no) ? n.splice(n.indexOf(ds.no), 1) : n.push(ds.no); } S.prof.no = n; return render(); }
    if (ds.ans != null) { S.my[S.day] = +ds.ans; S.phase = 'sent'; return render(); }
    if (ds.vote) { S.votes[S.day] = ds.vote; S.phase = 'voted'; return render(); }
    const newWeek = () => { S.alt = S.alt ? 0 : 1; S.day = 0; S.phase = 'answer'; S.my = []; S.votes = []; S.face = 'none'; S.meet = 'none'; S.tab = 'week'; S.step = 'match'; S.found = false; };
    switch (ds.act) {
      case 'go-me': S.step = 'me'; if (!S.prof.g) S.prof.g = 'Женщина'; break;
      case 'go-match': S.step = 'match'; S.found = false; break;
      case 'start-week': S.step = 'main'; S.tab = 'week'; break;
      case 'evening': S.phase = 'reveal'; break;
      case 'next-day': S.day++; S.phase = 'answer'; break;
      case 'face-ask': S.face = 'asked'; break;
      case 'face-open': S.face = 'open'; break;
      case 'meet-yes': S.meet = 'yes'; break;
      case 'next-week': case 'toggle': newWeek(); break;
      case 'reset': S = fresh(); break;
      default: return;
    }
    render();
  });
  document.addEventListener('DOMContentLoaded', render);
})();
