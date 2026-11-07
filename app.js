/* Общий движок трёх макетов «СемьЯ». Данные выдуманные. Ничего никуда не отправляется:
   ответы и замечания живут только в этом браузере. */
(function () {
  const V = window.VARIANT || {};

  const THEMES = [
    { id: 'deti', name: 'дети' },
    { id: 'dengi', name: 'деньги' },
    { id: 'rod', name: 'родители' },
    { id: 'ssory', name: 'ссоры' },
  ];

  const QUESTIONS = [
    { theme: 'deti', q: 'Дети в будущей семье — это…', a: ['Обязательно, и лучше не один', 'Хочу, но без спешки', 'Мне хватит тех, что уже есть'] },
    { theme: 'deti', q: 'Кто больше занимается детьми?', a: ['Оба поровну', 'Больше тот, у кого больше времени', 'Зовём на помощь бабушек и нянь'] },
    { theme: 'dengi', q: 'Деньги в семье — это…', a: ['Общий котёл', 'Общий бюджет плюс личные карманы', 'У каждого свои'] },
    { theme: 'dengi', q: 'Крупная покупка — как решаем?', a: ['Копим заранее, вместе', 'Можно и в кредит, если очень надо', 'Решает тот, кто больше зарабатывает'] },
    { theme: 'rod', q: 'Родители супругов — это…', a: ['Часть семьи, видимся часто', 'Любим, но на расстоянии', 'Живём своей жизнью'] },
    { theme: 'rod', q: 'Жить вместе с родителями?', a: ['Нормально, если так нужно', 'Только временно', 'Нет, своё жильё обязательно'] },
    { theme: 'ssory', q: 'Когда что-то не нравится, я…', a: ['Говорю сразу', 'Сначала остываю, потом говорю', 'Молчу, пока само не пройдёт'] },
    { theme: 'ssory', q: 'Мириться первым обычно…', a: ['Я, мне так проще', 'Тот, кто неправ', 'Никто, оно как-то само'] },
  ];

  const PORTRAIT = {
    deti: ['Для вас дети — сердце будущей семьи. Вам важен партнёр, который хочет того же.',
           'Вы хотите детей, но без гонки. Вам важен спокойный темп и общее решение.',
           'Ваша семья уже с детьми или без новых планов. Вам важен партнёр, который это примет.'],
    dengi: ['Вы за общий котёл: деньги — дело семьи, а не каждого по отдельности.',
            'Вы за общий бюджет, но с личной свободой. Это разумный и частый выбор.',
            'Вам важна финансовая самостоятельность. Об этом стоит говорить на берегу.'],
    rod: ['Родители для вас — часть большой семьи. Вы цените близость поколений.',
          'Вы любите родных, но бережёте границы своей семьи.',
          'Для вас семья — это прежде всего пара. Родители — отдельная жизнь.'],
    ssory: ['В ссоре вы говорите сразу. С вами понятно, где стоишь, — это сильная сторона.',
            'Вам нужно время остыть, а потом вы готовы говорить. Партнёру важно это знать.',
            'Вы бережёте мир и не любите выяснять отношения. Иногда стоит говорить вслух.'],
  };

  const W = 'w', M = 'm';
  const PEOPLE = [
    { g: W, name: 'Ольга', year: 1984, region: 'Тверская область', job: 'Учитель', status: 'В разводе, сын 12 лет', about: 'Ценю в людях доброту, пунктуальность и умение держать слово.', fam: 'Семья — это не главное. Это всё.', ans: [0, 0, 0, 0, 1, 1, 1, 1] },
    { g: W, name: 'Марина', year: 1988, region: 'Москва', job: 'Бухгалтер', status: 'Не замужем, детей нет', about: 'Люблю тишину и уют, но всегда готова к спонтанной поездке.', fam: 'Дом — это место, где тебя любят больше всего.', ans: [1, 0, 1, 0, 1, 2, 0, 1] },
    { g: W, name: 'Наталья', year: 1979, region: 'Новгородская область', job: 'Медсестра', status: 'В разводе, двое детей', about: 'Радуюсь простым вещам: тёплому солнцу и искренним людям.', fam: 'Семейный круг — безопасная гавань.', ans: [2, 2, 0, 0, 0, 0, 1, 0] },
    { g: W, name: 'Елена', year: 1991, region: 'Санкт-Петербург', job: 'Дизайнер', status: 'Не замужем, детей нет', about: 'Считаю чувство юмора важным показателем совместимости.', fam: 'Семья — сердца в одном ритме, мечты одним курсом.', ans: [1, 0, 1, 0, 1, 2, 0, 0] },
    { g: W, name: 'Ирина', year: 1982, region: 'Ленинградская область', job: 'Руководитель отдела', status: 'В разводе, дочь 9 лет', about: 'Много работаю, но выходные держу за собой.', fam: 'Нельзя найти счастья в браке, если не принесёшь его с собой.', ans: [0, 1, 1, 0, 1, 2, 0, 1] },
    { g: W, name: 'Светлана', year: 1975, region: 'Ярославская область', job: 'Инженер', status: 'Вдова, сын взрослый', about: 'Умею создавать уют вокруг себя, где бы ни находилась.', fam: 'Время с семьёй — бесценный подарок.', ans: [2, 2, 0, 0, 0, 1, 1, 1] },
    { g: W, name: 'Анна', year: 1993, region: 'Псковская область', job: 'Фельдшер', status: 'Не замужем, детей нет', about: 'Верю, что любые вопросы можно решить простым разговором.', fam: 'Быть семьёй — значит делить жизнь.', ans: [0, 0, 0, 0, 0, 0, 0, 0] },
    { g: W, name: 'Татьяна', year: 1986, region: 'Тульская область', job: 'Продавец', status: 'В разводе, сын 7 лет', about: 'Ценю честность, уважение и умение радоваться мелочам.', fam: 'Семья — это сердце дома.', ans: [1, 2, 0, 1, 0, 1, 2, 2] },
    { g: M, name: 'Андрей', year: 1983, region: 'Тверская область', job: 'Инженер-строитель', status: 'В разводе, дочь 10 лет', about: 'Бегаю по утрам, зимой — лыжи. Слово держу.', fam: 'Семья — как дерево: корни одни.', ans: [0, 0, 0, 0, 1, 1, 1, 1] },
    { g: M, name: 'Сергей', year: 1980, region: 'Москва', job: 'Врач', status: 'Не женат, детей нет', about: 'Умею балансировать между романтикой и здравым смыслом.', fam: 'Брак следует за любовью, как дым за пламенем.', ans: [1, 0, 1, 0, 1, 2, 0, 0] },
    { g: M, name: 'Дмитрий', year: 1987, region: 'Новгородская область', job: 'Водитель', status: 'В разводе, сын 6 лет', about: 'Не боюсь учиться новому, часто меняю хобби.', fam: 'Главные люди в жизни — те, кого мы зовём семьёй.', ans: [0, 1, 0, 1, 0, 0, 0, 0] },
    { g: M, name: 'Алексей', year: 1990, region: 'Санкт-Петербург', job: 'Программист', status: 'Не женат, детей нет', about: 'Строю приложения, но время для личной жизни найду всегда.', fam: 'Семья — это когда рядом не про расстояние.', ans: [1, 0, 2, 0, 2, 2, 1, 1] },
    { g: M, name: 'Михаил', year: 1976, region: 'Ярославская область', job: 'Предприниматель', status: 'Вдовец, двое взрослых детей', about: 'Мои принципы просты: будь честным и помогай другим.', fam: 'Счастье — знать, что где-то тебя ждут.', ans: [2, 2, 0, 0, 0, 1, 0, 0] },
    { g: M, name: 'Игорь', year: 1985, region: 'Ленинградская область', job: 'Электрик', status: 'В разводе, детей нет', about: 'Обожаю настольные игры и сражаюсь до победы.', fam: 'Семья — самое уютное место на Земле.', ans: [0, 0, 1, 0, 1, 1, 1, 1] },
    { g: M, name: 'Павел', year: 1981, region: 'Псковская область', job: 'Военный в запасе', status: 'В разводе, сын 14 лет', about: 'Верность и чувство юмора — мои главные черты.', fam: 'В семье любовь — в поступках, не только в словах.', ans: [0, 0, 0, 0, 0, 0, 0, 1] },
    { g: M, name: 'Виктор', year: 1978, region: 'Тульская область', job: 'Механик', status: 'Не женат, детей нет', about: 'Люблю рыбалку и тихие вечера.', fam: 'Для сохранения семьи — терпеть и прощать.', ans: [2, 2, 2, 2, 2, 2, 2, 2] },
  ];

  const state = { gender: W, answers: Array(QUESTIONS.length).fill(null), qi: 0 };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function go(id) {
    $$('[data-screen]').forEach((s) => s.classList.toggle('on', s.dataset.screen === id));
    window.scrollTo(0, 0);
    if (id === 'quiz') renderQuiz();
    if (id === 'portrait') renderPortrait();
    if (id === 'cards') renderCards();
    if (V.onScreen) V.onScreen(id, api);
  }

  function renderQuiz() {
    const box = $('#quiz'); if (!box) return;
    const i = state.qi, Q = QUESTIONS[i];
    const theme = THEMES.find((t) => t.id === Q.theme).name;
    box.innerHTML =
      `<div class="q-meta">${(V.quizMeta || ((i, n, t) => `Вопрос ${i + 1} из ${n} · ${t}`))(i, QUESTIONS.length, theme)}</div>` +
      `<div class="q-bar"><i style="width:${(i / QUESTIONS.length) * 100}%"></i></div>` +
      `<h3 class="q-text">${esc(Q.q)}</h3>` +
      Q.a.map((a, k) => `<button class="q-opt${state.answers[i] === k ? ' sel' : ''}" data-k="${k}">${esc(a)}</button>`).join('') +
      (i > 0 ? `<button class="q-back" data-back>← назад</button>` : '');
    $$('.q-opt', box).forEach((b) => b.onclick = () => {
      state.answers[i] = +b.dataset.k;
      if (i < QUESTIONS.length - 1) { state.qi++; renderQuiz(); } else go('portrait');
    });
    const back = $('[data-back]', box); if (back) back.onclick = () => { state.qi--; renderQuiz(); };
  }

  function ans() { return state.answers.map((a) => (a == null ? 1 : a)); }

  function renderPortrait() {
    const box = $('#portrait'); if (!box) return;
    const a = ans();
    box.innerHTML = THEMES.map((t) => {
      const first = QUESTIONS.findIndex((q) => q.theme === t.id);
      return `<div class="p-item"><div class="p-theme">${t.name}</div><p>${PORTRAIT[t.id][a[first]]}</p></div>`;
    }).join('');
  }

  function match(p) {
    const a = ans();
    const per = THEMES.map((t) => {
      const idx = QUESTIONS.map((q, i) => (q.theme === t.id ? i : -1)).filter((i) => i >= 0);
      const d = idx.reduce((s, i) => s + Math.abs(a[i] - p.ans[i]), 0) / idx.length;
      return { t: t.name, d };
    });
    const pct = Math.round(100 * (1 - per.reduce((s, x) => s + x.d, 0) / (per.length * 2)));
    const same = per.filter((x) => x.d === 0).map((x) => x.t);
    const talk = per.filter((x) => x.d >= 1).map((x) => x.t);
    return { pct, same, talk };
  }

  function renderCards() {
    const box = $('#cards'); if (!box) return;
    const want = state.gender === W ? M : W;
    const list = PEOPLE.filter((p) => p.g === want).map((p) => ({ p, m: match(p) }))
      .filter((x) => x.m.pct > 50).sort((x, y) => y.m.pct - x.m.pct).slice(0, 7);
    if (!list.length) { box.innerHTML = `<p class="empty">${V.emptyText || 'Пока никого больше 50%. В настоящей базе людей будет больше.'}</p>`; return; }
    box.innerHTML = list.map(({ p, m }, i) => (V.card || defaultCard)(p, m, i, esc)).join('');
    if (V.afterCards) V.afterCards(box, list, api);
  }

  /* Карточка человека: портрет-инициал, кольцо совпадения, цитата, метки. Без «таблицы». */
  function defaultCard(p, m) {
    return `<article class="pcard">
      <div class="pc-top"><div class="ava">${esc(p.name[0])}</div>
        <div class="pc-who"><b>${esc(p.name)}, ${2026 - p.year}</b><small>${esc(p.region)} · ${esc(p.job)}</small></div>
        <div class="ring" style="--p:${m.pct}"><span>${m.pct}%</span></div></div>
      <blockquote>«${esc(p.fam)}»</blockquote>
      <p class="pc-about">${esc(p.about)}</p>
      <div class="chips"><span>${esc(p.status)}</span></div>
      <div class="chips">${m.same.map((t) => `<span class="ok">✓ ${t}</span>`).join('')}${m.talk.map((t) => `<span class="talk">💬 ${t}</span>`).join('')}</div>
      ${m.talk.length ? `<p class="pc-hint">💬 — об этом стоит поговорить при встрече</p>` : ''}
    </article>`;
  }

  /* Кнопка «Замечание»: копит заметки в браузере и отдаёт файлом, который открывается в Word */
  function bugButton() {
    const btn = document.createElement('button');
    btn.className = 'bug'; btn.type = 'button'; btn.textContent = V.bugLabel || '✎ Замечание';
    const dlg = document.createElement('div'); dlg.className = 'bug-dlg';
    dlg.innerHTML = `<div class="bug-box"><b>Замечание</b><p class="bug-hint">Что не так или что пришло в голову? Пишется только в этот браузер.</p>
      <textarea rows="5"></textarea><div class="bug-row"><button data-save>Сохранить</button><button data-dl>Скачать все (Word)</button><button data-x>Закрыть</button></div>
      <p class="bug-count"></p></div>`;
    document.body.append(btn, dlg);
    const key = 'semya-notes';
    const load = () => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } };
    const save = (l) => { try { localStorage.setItem(key, JSON.stringify(l)); } catch (e) {} };
    const count = () => { $('.bug-count', dlg).textContent = 'Сохранено замечаний: ' + load().length; };
    btn.onclick = () => { dlg.classList.add('on'); count(); $('textarea', dlg).focus(); };
    api.note = (prefix) => { dlg.classList.add('on'); count(); const ta = $('textarea', dlg); ta.value = prefix || ''; ta.focus(); };
    $('[data-x]', dlg).onclick = () => dlg.classList.remove('on');
    $('[data-save]', dlg).onclick = () => {
      const t = $('textarea', dlg).value.trim(); if (!t) return;
      const screen = ($('[data-screen].on') || {}).dataset?.screen || '';
      const l = load(); l.push({ t, screen: (V.title || '') + (screen ? ' / ' + screen : ''), at: new Date().toLocaleString('ru-RU') }); save(l);
      $('textarea', dlg).value = ''; count();
    };
    $('[data-dl]', dlg).onclick = () => {
      const l = load();
      const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:14pt"><h1>Замечания — «СемьЯ»</h1>` +
        l.map((n, i) => `<p><b>${i + 1}.</b> ${esc(n.at)}, экран «${esc(n.screen)}»<br>${esc(n.t)}</p>`).join('') + '</body></html>';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + html], { type: 'application/msword' }));
      a.download = 'zamechaniya-semya.doc'; a.click();
    };
  }

  const api = { go, state, match, PEOPLE, QUESTIONS, THEMES, $, $$ };
  window.SEMYA = api;

  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); }
    const n = e.target.closest('[data-note]'); if (n && api.note) { e.preventDefault(); api.note(n.dataset.note); }
    const s = e.target.closest('[data-gender]');
    if (s) { state.gender = s.dataset.gender; $$('[data-gender]').forEach((b) => b.classList.toggle('sel', b === s)); }
  });
  document.addEventListener('DOMContentLoaded', () => { bugButton(); const first = $('[data-screen]'); if (first) go(first.dataset.screen); });
})();
