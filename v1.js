/* Вариант 1 «Ваша версия» — строго по её четырём документам: анкета «Личные данные», 5 тестов,
   свод «Анкета пользователя базовая», карточка по образцу №4. Всё хранится в этом браузере (semya-v1-state).
   ?reset=1 — начать заново. */
(function () {
  const D = window.SEMYA_DATA, KEY = 'semya-v1-state';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (/[?&]reset=1/.test(location.search)) { try { localStorage.removeItem(KEY); } catch (e) {} history.replaceState(null, '', location.pathname); }

  /* ---------- её списки, как в документе «Анкета 1» ---------- */
  const REGIONS = [
    ['Республики', 'Республика Адыгея|Республика Алтай|Республика Башкортостан|Республика Бурятия|Республика Дагестан|Республика Ингушетия|Кабардино-Балкарская Республика|Республика Калмыкия|Карачаево-Черкесская Республика|Республика Карелия|Республика Коми|Республика Марий Эл|Республика Мордовия|Республика Саха (Якутия)|Республика Северная Осетия — Алания|Республика Татарстан|Республика Тыва|Удмуртская Республика|Республика Хакасия|Чеченская Республика|Чувашская Республика|Республика Крым|Донецкая Народная Республика|Луганская Народная Республика'],
    ['Края', 'Алтайский край|Камчатский край|Хабаровский край|Краснодарский край|Красноярский край|Пермский край|Приморский край|Ставропольский край|Забайкальский край'],
    ['Области', 'Амурская область|Архангельская область|Астраханская область|Белгородская область|Брянская область|Владимирская область|Волгоградская область|Вологодская область|Воронежская область|Запорожская область|Иркутская область|Ивановская область|Калининградская область|Калужская область|Кемеровская область — Кузбасс|Кировская область|Костромская область|Курганская область|Курская область|Ленинградская область|Липецкая область|Магаданская область|Московская область|Мурманская область|Нижегородская область|Новгородская область|Новосибирская область|Омская область|Оренбургская область|Орловская область|Пензенская область|Псковская область|Ростовская область|Рязанская область|Сахалинская область|Самарская область|Саратовская область|Смоленская область|Свердловская область|Тамбовская область|Томская область|Тверская область|Тульская область|Тюменская область|Ульяновская область|Челябинская область|Херсонская область|Ярославская область'],
    ['Города федерального значения', 'Москва|Санкт-Петербург|Севастополь'],
    ['Автономная область', 'Еврейская автономная область'],
    ['Автономные округа', 'Ненецкий автономный округ|Ханты-Мансийский автономный округ — Югра|Чукотский автономный округ|Ямало-Ненецкий автономный округ'],
  ].map(([g, l]) => [g, l.split('|')]);
  const EDU = ['Основное общее образование (5–9-е классы)', 'Среднее общее образование (10–11-е классы)', 'Среднее профессиональное образование', 'Высшее образование', 'Несколько высших', 'Незаконченное высшее', 'Дополнительное образование (курсы, переподготовка)', 'Без профессионального образования'];
  const SPHERE = ['Техническое', 'Гуманитарное', 'Естественно-научное', 'Прочее, смешанные профили'];
  const JOBS = [['Физический труд', 'строитель, грузчик, спортсмен, танцор'], ['Интеллектуальный труд', 'аналитик, учёный, инженер, юрист, бухгалтер'], ['Социальный труд', 'учитель, врач, менеджер, парикмахер'], ['Творческий труд', 'художник, писатель, музыкант'], ['Организационно-управленческий труд', 'руководитель, администратор, военный, предприниматель'], ['Учебная деятельность', 'студенты, слушатели курсов'], ['Без трудовой деятельности, в поиске работы', 'пенсионеры, домохозяева']];
  const BODY = ['Эктоморф — худощавое', 'Мезоморф — атлетическое', 'Эндоморф — более округлое, коренастое'];
  const RELIGION = ['Не указывать', 'Православие', 'Католицизм', 'Протестантизм', 'Ислам', 'Иудаизм', 'Буддизм', 'Другое', 'Атеизм'];
  const ABOUT = ['Умею балансировать между романтикой и здравым смыслом.', 'Радуюсь простым вещам: теплому солнцу, хорошей музыке и искренним людям.', 'Считаю чувство юмора важным показателем совместимости с человеком.', 'Не боюсь заново учиться чему-то новому и часто меняю хобби.', 'Люблю тишину и уют, но всегда готова на спонтанную поездку с друзьями.', 'Ценю в людях доброту, пунктуальность и умение держать слово.', 'Строю прототипы веб-приложений, но всегда найду время для личной жизни.', 'Верю в искренность и считаю, что любые вопросы можно решить простым разговором.', 'Обожаю настольные игры и отчаянно сражаюсь за победу.', 'Умею создавать уют вокруг себя, где бы ни находилась.', 'В жизни ценю честность, уважение и умение радоваться мелочам.', 'Мои главные черты — это верность и чувство юмора.', 'Мои жизненные принципы просты: будь честным, помогай другим и находи радость в каждом дне.', 'Много работаю, но выходные держу за собой, бегаю по утрам, зимой — лыжи.'];
  const QUOTES = ['Семья — это не главное. Это всё.', 'Семья заменяет все. Поэтому, прежде чем ее завести, стоит подумать, что тебе важнее: все или семья.', 'Семья — это где в основе заложены принципы: не обижать друг друга и радовать.', 'Семья — это больше, чем находиться рядом: это быть вместе.', 'В семье любовь выражается не только в словах, но и в поступках.', 'Семья — как дерево: ветви растут в разных направлениях, а корни остаются одним целым.', 'Дом — это место, где тебя любят больше всего и где ты можешь быть собой без прикрас.', 'Быть семьёй — значит не просто делить пространство, а делить жизнь.', 'Семья — это когда рядом — не про расстояние, а про присутствие.', 'Семья — это место, где не нужно ничего доказывать: тебя уже принимают.', 'Счастье — это знать, что где-то тебя ждут и искренне радуются, когда ты приходишь.', 'Для создания семьи достаточно полюбить. А для сохранения — нужно научиться терпеть и прощать.', 'Семья — это самое важное, что есть в мире.', 'Самое главное в мире — это семья и любовь.', 'Иметь место, куда можно вернуться, — это дом. Иметь кого-то, кого можно любить, — это семья.', 'Быть частью семьи означает любить и быть любимым всю оставшуюся жизнь.', 'Семья — самое уютное и теплое место на Земле.', 'Семейный круг — безопасная гавань.', 'Любовь семьи — это самая чистая и бескорыстная любовь.', 'В семье у супругов — две души, но единая воля.', 'Брак следует за любовью, так же как дым за пламенем.', 'Только тогда легко жить с человеком, когда не считаешь ни себя выше его, ни его выше себя.', 'Брак — это отношения, где независимость обеих сторон одинакова, зависимость обоюдна, а обязательства взаимны.', 'Если супруги много лет любят друг друга, страсть сменяется нежной дружбой.', 'Нельзя найти счастья в браке, если вы не принесете его с собой.', 'Семья — сердца в одном ритме, мечты одним курсом.', 'Семья — это сердце дома.', 'Если вы знаете что-то, что может быть дороже семьи, скажи мне. Я о таких богатствах не знаю.', 'Однажды наступает время, когда понимаешь, что в жизни нет ничего важнее семьи.', 'Некоторые люди стоят того, чтобы ради них жить!', 'Вечером каждого дня дома тебя кто-то будет ждать.', 'Главные люди в жизни каждого человека — те, кого мы называем семьей.', 'Семья — как элемент пазла: найдешь недостающий кусочек, и картинка жизни сложится.', 'Время, проведенное с семьей, — бесценный подарок.', 'Обнять родных и близких — как это ценно в сегодняшнем мире.', 'Дом, семья — это место, где ты находишь свет, когда все становится темным.'];
  const CONTACTS = ['Электронная почта', 'Телефон мобильный', 'Telegram', 'WhatsApp', 'Макс', 'ВКонтакте', 'Другое'];

  /* ---------- пять тестов: по 3–4 вопроса-образца, «Ценности» — настоящие 8 вопросов ---------- */
  const yn = ['Да', 'Нет'], often = ['Часто', 'Иногда', 'Редко'], s5 = ['1', '2', '3', '4', '5'];
  const TESTS = [
    { id: 'temp', name: 'Определение темперамента', meta: '20 вопросов, 5 минут', qs: [['Я быстро загораюсь новым делом', yn], ['Мне трудно долго ждать', yn], ['Мне легко в шумной компании', yn], ['Я долго переживаю неудачи', yn]],
      res: (a) => { const act = [a[0], a[1], a[2]].filter((x) => x === 0).length >= 2, deep = a[3] === 0; return 'Темперамент: ' + (act ? (deep ? 'холерик' : 'сангвиник') : (deep ? 'меланхолик' : 'флегматик')); } },
    { id: 'big5', name: 'Опросник «Большая пятёрка»', meta: '40 вопросов, 10 минут', hint: '1 — совсем не про меня, 5 — точно про меня', qs: [['Я легко знакомлюсь с людьми', s5], ['Я довожу дела до конца', s5], ['Мне интересно всё новое', s5], ['Я уступаю, чтобы не ссориться', s5]],
      res: (a) => { const w = ['общительный', 'добросовестный', 'открытый новому', 'доброжелательный']; const top = a.map((v, i) => [v, w[i]]).sort((x, y) => y[0] - x[0]).slice(0, 2).map((x) => x[1]); return 'Психотип: ' + top.join(', '); } },
    { id: 'emp', name: 'Индекс эмпатии', meta: '28 вопросов, 7 минут', qs: [['Я замечаю, когда человеку рядом плохо, даже если он молчит', often], ['Мне легко поставить себя на место другого', often], ['Чужие слёзы трогают меня', often]],
      res: (a) => 'Эмпатия: ' + ['высокая', 'средняя', 'сдержанная'][Math.round(a.reduce((s, x) => s + x, 0) / a.length)] },
    { id: 'jeal', name: 'Ревность', meta: '15 вопросов, 3 минуты', qs: [['Если партнёр задерживается и не пишет, я…', ['Спокойно жду', 'Позвоню узнать, всё ли хорошо', 'Сильно волнуюсь и злюсь']], ['Партнёр весело общается с коллегой противоположного пола', ['Нормально', 'Немного неприятно', 'Это задевает']], ['Проверить телефон партнёра…', ['Никогда', 'Бывает, хочется', 'Проверю']]],
      res: (a) => 'Уровень ревности: ' + ['спокойный', 'умеренный', 'заметный'][Math.round(a.reduce((s, x) => s + x, 0) / a.length)] },
    { id: 'val', name: 'Совпадение ценностей', meta: '20 вопросов, 5 минут', real: true, qs: D.QUESTIONS.map((Q) => [Q.q, Q.a]),
      res: () => 'Жизненные ценности: дети, деньги, родители, ссоры — сохранены для подбора' },
  ];

  /* ---------- гороскоп и биоритмы (заполняются автоматически по дате рождения) ---------- */
  const SIGNS = [['Козерог', 1, 19], ['Водолей', 2, 18], ['Рыбы', 3, 20], ['Овен', 4, 19], ['Телец', 5, 20], ['Близнецы', 6, 20], ['Рак', 7, 22], ['Лев', 8, 22], ['Дева', 9, 22], ['Весы', 10, 22], ['Скорпион', 11, 21], ['Стрелец', 12, 21], ['Козерог', 12, 31]];
  const FAMILY = { 'Козерог': 'В семье надёжен и основателен. Строит дом надолго.', 'Водолей': 'Ценит свободу и дружбу в браке. Нужен партнёр-единомышленник.', 'Рыбы': 'Чуткий и заботливый. Семья для него — тихая гавань.', 'Овен': 'Горячий и честный. Быстро вспыхивает, быстро мирится.', 'Телец': 'Хозяйственный и верный. Ценит уют и стабильность.', 'Близнецы': 'Лёгкий в общении, любит разговоры. Важно не скучать вместе.', 'Рак': 'Семья — центр его мира. Очень привязан к дому и родным.', 'Лев': 'Щедрый и гордый. Любит, когда им восхищаются.', 'Дева': 'Внимателен к мелочам и порядку. Заботу выражает делом.', 'Весы': 'Ищет гармонию и избегает ссор. Ценит красоту быта.', 'Скорпион': 'Глубокие чувства и сильная верность. Не прощает лжи.', 'Стрелец': 'Оптимист и путешественник. Важен общий горизонт.' };
  function sign(iso) { if (!iso) return null; const m = +iso.slice(5, 7), d = +iso.slice(8, 10); return SIGNS.find(([, mm, dd]) => m < mm || (m === mm && d <= dd))[0]; }
  function bioSvg(iso) {
    const b = new Date(iso), now = new Date(), W = 320, H = 110, days = 30;
    const t0 = Math.floor((now - b) / 864e5);
    const line = (P, c) => `<polyline fill="none" stroke="${c}" stroke-width="2" points="${Array.from({ length: days + 1 }, (_, i) => `${(i / days * W).toFixed(1)},${(H / 2 - Math.sin(2 * Math.PI * (t0 + i) / P) * (H / 2 - 8)).toFixed(1)}`).join(' ')}"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="График биоритмов на месяц"><line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}" stroke="#ccc"/>${line(23, '#A23B3B')}${line(28, '#23407A')}${line(33, '#4F8A3F')}</svg>
      <p class="legend"><span style="color:#A23B3B">● физический (23 дня)</span> <span style="color:#23407A">● эмоциональный (28)</span> <span style="color:#4F8A3F">● интеллектуальный (33)</span></p>`;
  }

  /* ---------- состояние ---------- */
  const fresh = () => ({ screen: 'start', f: { gender: 'Женский', birth: '1985-05-12', region: 'Тверская область', rel: 'Не указывать', eduKind: 'Высшее образование', eduSphere: 'Гуманитарное', job: 'Социальный труд', height: '168', weight: '62', body: BODY[1], marriages: '1 брак', kids: '1', kidsAge: '12', about: ABOUT[5], fam: QUOTES[0], contacts: ['WhatsApp', 'Телефон мобильный'], nat: 'русская' }, imp: {}, t: {}, cur: null, qi: 0, tmp: [], count: 7, inbox: 'new', sent: {} });
  let S; try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  // #state=… — открыть макет в заданном месте (для картинок на главной)
  { const H = location.hash.match(/^#state=(.+)/); if (H) { try { S = JSON.parse(decodeURIComponent(H[1])); } catch (e) {} } }
  const bmi = (h, w) => (h && w ? +(w / Math.pow(h / 100, 2)).toFixed(1) : null);
  const bmiWord = (x) => (x < 18.5 ? 'ниже нормы' : x < 25 ? 'норма' : x < 30 ? 'выше нормы' : 'значительно выше нормы');
  const done = () => TESTS.filter((T) => S.t[T.id]).length;

  window.NOTE_PAGE = 'Вариант 1 «Ваша версия»';
  window.NOTE_SCREEN = () => ({ start: 'вход', consent: 'согласие', anketa: 'анкета 1', tests: 'тесты', test: 'тест: ' + (TESTS.find((T) => T.id === S.cur) || {}).name, svod: 'анкета базовая (свод)', zayavka: 'заявка на подбор', cards: 'подбор', inbox: 'вам написали' }[S.screen]);

  const go = (s) => { S.screen = s; render(); window.scrollTo(0, 0); };
  function render() { save(); $('#app').innerHTML = (SCREENS[S.screen] || SCREENS.start)(); if (S.screen === 'anketa') afterAnketa(); }

  const sel = (name, list, v) => `<select name="${name}">${list.map((o) => `<option${o === v ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  const imp = (k, text) => `<label class="imp"><input type="checkbox" data-imp="${k}"${S.imp[k] ? ' checked' : ''}> важно для меня${text ? ` <small>${text}</small>` : ''}</label>`;

  const SCREENS = {
    start: () => `<div class="doc"><h2>Добро пожаловать</h2>
      <p>Наша цель — помочь вам найти спутника жизни для создания семьи. Поэтому анкеты для заполнения будут большими.</p>
      <p>Для более точного составления электронного портрета и получения эффективного результата надо отвечать правдиво.</p>
      <p>Определяется близость жизненных принципов и убеждений, совпадение базовых ценностей, психологической гибкости и физиологической гармонии.</p>
      <p><i>Важно помнить: описание совместимости — это ориентир, а не истина в первой инстанции.</i></p>
      <p class="note">Анкета — около 10 минут, тесты — около 30. Можно по частям: всё сохраняется.</p></div>
      <button class="btn" data-go="consent">Начать регистрацию</button>
      ${S.f.name ? '<button class="btn ghost" data-go="tests">Продолжить с того места</button>' : ''}`,

    consent: () => `<div class="doc"><h2>Согласие на обработку персональных данных</h2>
      <p>Анкета содержит личные сведения. Они используются только для подбора.</p>
      <p class="note">В настоящем сайте здесь будет полный текст согласия, составленный юристом.</p>
      <label class="imp big"><input type="checkbox" checked> Я согласен(на) на обработку персональных данных</label>
      <label class="imp big"><input type="checkbox" checked> Показывать другим только то, что я отметил(а)</label></div>
      <button class="btn" data-go="anketa">Далее</button>`,

    anketa: () => { const f = S.f, b = bmi(+f.height, +f.weight);
      return `<form class="doc" id="anketa"><span class="stamp">Анкета 1</span><h2>Личные данные</h2>
      <p class="note">* Параметр учитывается при подборе, если поставлена отметка «важно для меня».</p>
      <div class="field"><label>Имя (или никнейм)</label><input name="name" value="${esc(f.name)}" placeholder="Например, Ольга"></div>
      <div class="field"><label>Пол</label>${sel('gender', ['Женский', 'Мужской'], f.gender)}</div>
      <div class="field"><label>День, месяц, год рождения (18+)</label><input type="date" name="birth" value="${esc(f.birth)}" max="2008-11-08"></div>
      <div class="field"><label>Место рождения</label><input name="birthplace" value="${esc(f.birthplace)}" placeholder="Город"></div>
      <div class="field"><label>Религия</label>${sel('rel', RELIGION, f.rel)}${imp('rel')}</div>
      <div class="field"><label>Регион проживания (субъект РФ, 89 субъектов)</label><select name="region">${REGIONS.map(([g, l]) => `<optgroup label="${g}">${l.map((o) => `<option${o === f.region ? ' selected' : ''}>${o}</option>`).join('')}</optgroup>`).join('')}</select></div>
      <div class="field"><label>Национальность</label><input name="nat" value="${esc(f.nat)}">${imp('nat')}</div>
      <div class="field"><label>Образование — вид</label>${sel('eduKind', EDU, f.eduKind)}<label>Образование — сфера</label>${sel('eduSphere', SPHERE, f.eduSphere)}${imp('edu')}</div>
      <div class="field"><label>Род занятий, тип деятельности</label><select name="job">${JOBS.map(([j, d]) => `<option value="${j}"${j === f.job ? ' selected' : ''}>${j} (${d})</option>`).join('')}</select></div>
      <div class="field"><label>Рост (см) и вес (кг)</label><div class="seg"><input name="height" inputmode="numeric" value="${esc(f.height)}"><input name="weight" inputmode="numeric" value="${esc(f.weight)}"></div>
        <p class="bmi" id="bmi">${b ? `Индекс массы тела: <b>${b}</b> — ${bmiWord(b)}` : ''}</p>${imp('bmi', 'чтобы исключить нежелательные варианты, например мужчина большой, а женщина небольшого роста и худощавая, или наоборот')}</div>
      <div class="field"><label>Тип телосложения</label>${sel('body', BODY, f.body)}</div>
      <div class="field"><label>Семейный статус — количество браков</label>${sel('marriages', ['нет', '1 брак', '2 брака', '3 и более брака'], f.marriages)}
        <label>Дети</label><div class="seg">${sel('kids', ['нет', '1', '2', '3', 'более 3-х'], f.kids)}<input name="kidsAge" value="${esc(f.kidsAge)}" placeholder="возраст"></div></div>
      <div class="field"><label>Коротко (1–2 фразы) о себе — для карточки</label>${sel('about', [...ABOUT, 'Написать самому'], f.about)}
        <textarea name="aboutOwn" rows="2" placeholder="Своими словами" class="${f.about === 'Написать самому' ? '' : 'hide'}">${esc(f.aboutOwn)}</textarea></div>
      <div class="field"><label>Высказывание о семье — для карточки (${QUOTES.length} на выбор)</label>${sel('fam', QUOTES, f.fam)}</div>
      <div class="field"><label>Контакты для начала коммуникации — ровно 2</label><div class="checks">${CONTACTS.map((c) => `<label><input type="checkbox" data-contact="${c}"${(f.contacts || []).includes(c) ? ' checked' : ''}> ${c}</label>`).join('')}</div></div>
      <div class="field"><label>Фотографии</label><div class="photos"><div class="phbox">📷 Фото 1<br><small>с монитора, по методике — уточним с вами</small></div><div class="phbox">🖼 Фото 2<br><small>для карточки — прикрепить</small></div></div></div>
      </form><button class="btn" data-go="tests">Сохранить и перейти к тестам</button>`; },

    tests: () => `<div class="doc"><h2>Тесты-опросники</h2><p>5 тестов, 123 вопроса, около 30 минут. Можно проходить по одному.</p>
      <p class="prog">Пройдено ${done()} из 5</p>
      ${TESTS.map((T) => `<button class="test" data-test="${T.id}"><div>${T.name}<small>${T.meta}</small></div><span class="st ${S.t[T.id] ? 'ok' : 'go'}">${S.t[T.id] ? 'пройден ✓' : 'пройти →'}</span></button>${S.t[T.id] ? `<p class="res">${TESTS.find((x) => x.id === T.id).res(S.t[T.id])}${T.real ? '' : ' (пример)'}</p>` : ''}`).join('')}</div>
      <button class="btn" data-go="svod"${done() ? '' : ' disabled'}>Перейти к своду — «Анкета пользователя базовая»</button>
      ${done() < 5 ? '<p class="note">Свод можно открыть и раньше: непройденные тесты будут отмечены.</p>' : ''}`,

    test: () => { const T = TESTS.find((x) => x.id === S.cur), [q, a] = T.qs[S.qi];
      return `<div class="doc"><p class="q-meta">${T.name} · вопрос ${S.qi + 1} из ${T.qs.length}</p><div class="q-bar"><i style="width:${S.qi / T.qs.length * 100}%"></i></div>
        ${T.hint ? `<p class="note">${T.hint}</p>` : ''}<h3 class="q-text">${q}</h3>
        <div class="${a.length === 5 ? 'scale' : ''}">${a.map((o, k) => `<button class="q-opt" data-a="${k}">${o}</button>`).join('')}</div>
        ${S.qi ? '<button class="q-back" data-qback>← назад</button>' : ''}
        ${T.real ? '' : `<p class="note">В настоящем тесте ${T.meta.split(',')[0]} — ваш текст. Здесь несколько для показа.</p>`}</div>`; },

    svod: () => { const f = S.f, b = bmi(+f.height, +f.weight), sg = sign(f.birth);
      const row = (k, v) => `<div class="sv"><span>${k}</span><b>${esc(v || '—')}</b></div>`;
      return `<div class="doc"><span class="stamp">Свод</span><h2>Анкета пользователя базовая</h2>
      <p class="note">Результат анкеты «Личные данные» и тестов, сведённый в одну базу. Сравнивается с данными других пользователей.</p>
      <div class="photos"><div class="phbox">📷 Фото 1<br><small>с монитора</small></div><div class="phbox ini">${esc((f.name || '?')[0])}<br><small>Фото 2 — для карточки</small></div></div>
      ${row('Имя', f.name)}${row('Пол', f.gender)}${row('Дата рождения', f.birth && f.birth.split('-').reverse().join('.'))}${row('Место рождения', f.birthplace)}${row('Регион', f.region)}${row('Национальность', f.nat)}${row('Образование', f.eduKind + ', ' + (f.eduSphere || '').toLowerCase())}${row('Род занятий', f.job)}${row('Рост / вес', f.height + ' см / ' + f.weight + ' кг' + (b ? ' · ИМТ ' + b : ''))}${row('Телосложение', f.body)}${row('Семейный статус', 'браков: ' + f.marriages + ', детей: ' + f.kids + (f.kidsAge && f.kids !== 'нет' ? ' (' + f.kidsAge + ')' : ''))}
      <h3>Результаты тестов</h3>${TESTS.map((T) => row(T.name, S.t[T.id] ? T.res(S.t[T.id]).split(': ')[1] + (T.real ? '' : ' (пример)') : 'не пройден')).join('')}
      <h3>График биоритмов</h3><p class="note">Заполняется автоматически по дате рождения — на ближайший месяц.</p>${f.birth ? bioSvg(f.birth) : ''}
      <h3>Гороскоп — раздел «семейные отношения»</h3><p class="note">Заполняется автоматически по дате рождения. Текст — образец, будет из вашей программы.</p>${sg ? `<p class="zod"><b>${sg}.</b> ${FAMILY[sg]}</p>` : ''}
      ${row('Коротко о себе', f.about === 'Написать самому' ? f.aboutOwn : f.about)}${row('Высказывание о семье', '«' + f.fam + '»')}${row('Контакты', (f.contacts || []).join(', '))}</div>
      <h3 class="center">Так вас увидят другие</h3><p class="note center">Предпросмотр вашей карточки (образец №4)</p>
      ${card({ num: '508000127000', name: f.name || 'Вы', fam: f.fam, year: (f.birth || '').slice(0, 4), region: f.region, nat: f.nat, job: f.job, edu: f.eduKind, status: 'браков: ' + f.marriages + ', детей: ' + f.kids, about: f.about === 'Написать самому' ? f.aboutOwn : f.about, contacts: f.contacts, show: { nat: !!S.imp.nat, edu: !!S.imp.edu } }, { total: 75, bio: 70, psy: 78, soc: 76 }, true)}
      <button class="btn" data-go="zayavka">Подать заявку на подбор</button>`; },

    zayavka: () => `<h2 class="h">Заявка на подбор</h2>
      <div class="doc"><p><b>Сколько карточек показать?</b> Не более 7.</p><div class="counts">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<button data-count="${n}" class="${S.count === n ? 'sel' : ''}">${n}</button>`).join('')}</div>
      <p class="note">Показываем только тех, с кем совпадение больше 50%.</p></div>
      <h3 class="h">Подписка</h3><p>Подбор идёт из имеющейся базы. С расширением базы увеличивается шанс совместимости, поэтому оптимальнее подписка на период.</p>
      ${[3, 6, 9, 12].map((m) => `<div class="plan${m === 6 ? ' best' : ''}"><b>${m} месяцев</b><span>цена — позже</span></div>`).join('')}
      <p class="note">В макете оплаты нет: кнопка сразу показывает подбор.</p><button class="btn" data-go="cards">Показать подбор</button>`,

    cards: () => { const L = pick();
      return `<h2 class="h">Ваш подбор</h2><p class="note">${L.length ? `Показано: ${L.length}. Только совпадение больше 50%.` : ''} Все люди выдуманные. Кому написать и кому ответить — решаете вы.</p>
      ${Object.keys(S.imp).filter((k) => S.imp[k]).length ? `<p class="note">Учтено «важно для меня»: ${Object.keys(S.imp).filter((k) => S.imp[k]).map((k) => ({ rel: 'религия', nat: 'национальность', edu: 'образование', bmi: 'рост и вес' }[k])).join(', ')}.</p>` : ''}
      ${L.length ? L.map(({ p, m }) => card(p, m)).join('') : '<p class="doc">Пока никого больше 50% с учётом отметок «важно для меня». В настоящей базе людей будет больше.</p>'}
      ${S.inbox !== 'gone' ? `<button class="inbox" data-go="inbox">✉ Вам написали (1)</button>` : ''}
      <button class="btn ghost" data-go="zayavka">Изменить количество</button><button class="btn ghost" data-act="reset">Начать заново</button>`; },

    inbox: () => { const p = writer(), m = mt(p);
      return `<h2 class="h">Вам написали</h2>${card(p, m)}<div class="doc msg"><b>${p.name}:</b> «Здравствуйте! Увидел${p.g === D.W ? 'а' : ''} вашу карточку — у нас ${m.total}%. Давайте познакомимся?»</div>
      ${S.inbox === 'replied' ? `<div class="doc ok">Ваш ответ отправлен. Контакты ${p.name}: ${p.contacts.join(' и ')}. <span class="note">В настоящем сайте откроется переписка или WhatsApp.</span></div>`
        : `<div class="two"><button class="btn" data-act="reply">Ответить</button><button class="btn ghost" data-act="ignore">Не отвечать</button></div>`}
      <button class="btn ghost" data-go="cards">← К подбору</button>`; },
  };

  /* ---------- подбор по трём её осям ---------- */
  const userG = () => (S.f.gender === 'Мужской' ? D.M : D.W);
  const valAns = () => (S.t.val || D.QUESTIONS.map(() => 1));
  function mt(p) { const soc = D.valuesPct(valAns(), p); return { bio: p.bio, psy: p.psy, soc, total: Math.min(97, Math.round(0.3 * p.bio + 0.35 * p.psy + 0.35 * soc)) }; }
  function pick() {
    const f = S.f, ub = bmi(+f.height, +f.weight);
    return D.PEOPLE.filter((p) => p.g !== userG()).filter((p) => {
      if (S.imp.rel && f.rel !== 'Не указывать' && p.rel !== f.rel) return false;
      if (S.imp.nat && f.nat && p.nat.slice(0, 4).toLowerCase() !== f.nat.slice(0, 4).toLowerCase()) return false;
      if (S.imp.edu && p.edu.split(/[ ,]/)[0] !== f.eduKind.split(' ')[0] && !(f.eduKind === 'Несколько высших' && p.edu === 'Несколько высших')) return false;
      if (S.imp.bmi && ub) { const pb = p.g === D.M ? 24 + (p.age % 4) : 21 + (p.age % 4); if (Math.abs(pb - ub) > 8) return false; }
      return true;
    }).map((p) => ({ p, m: mt(p) })).filter((x) => x.m.total > 50).sort((x, y) => y.m.total - x.m.total).slice(0, S.count);
  }
  function writer() { const shown = pick().map((x) => x.p.name); return D.PEOPLE.filter((p) => p.g !== userG()).find((p) => !shown.includes(p.name)) || D.PEOPLE.find((p) => p.g !== userG()); }

  /* ---------- карточка по её образцу №4 ---------- */
  function card(p, m, preview) {
    const you = S.f.name ? 'вами, ' + esc(S.f.name) + ',' : 'вами';
    return `<article class="kcard${preview ? ' prev' : ''}"><div class="k-num">${p.num}</div><div class="k-head"><div class="k-photo">${esc((p.name || '?')[0])}</div><h3>${esc(p.name)}</h3></div>
      <p class="k-phrase">Близость жизненных принципов и убеждений, совпадение базовых ценностей, психологической гибкости и физиологической гармонии с ${preview ? '(имя того, кто смотрит)' : you} составляет <b>${m.total}%</b></p>
      <p class="k-axes">биологическая ${m.bio}% · психологическая ${m.psy}% · социальная ${m.soc}%${preview ? '' : '<br><small>биологическая и психологическая — примерные, пока нет ваших тестов</small>'}</p>
      <div class="k-quote"><small>Ключевая фраза о семье</small>«${esc(p.fam)}»</div>
      <details><summary>Краткая информация (общие сведения) — посмотреть</summary>
        <div class="sv"><span>Год рождения</span><b>${esc(p.year)}</b></div><div class="sv"><span>Регион проживания</span><b>${esc(p.region)}</b></div>
        ${p.show.nat ? `<div class="sv"><span>Национальность*</span><b>${esc(p.nat)}</b></div>` : ''}
        <div class="sv"><span>Род занятий</span><b>${esc(p.job)}${p.jobText ? ' — ' + esc(p.jobText) : ''}</b></div>
        ${p.show.edu ? `<div class="sv"><span>Образование*</span><b>${esc(p.edu)}</b></div>` : ''}
        <div class="sv"><span>Семейный статус</span><b>${esc(p.status || ('браков: ' + p.marriages + ', ' + p.kidsText))}</b></div>
        <div class="sv"><span>Коротко о себе</span><b>${esc(p.about)}</b></div>
        <div class="sv"><span>Контакты для начала коммуникации</span><b>${esc((p.contacts || []).join(', '))}</b></div>
        <p class="note">* показывается, если человек разрешил.</p>
        ${preview ? '' : (S.sent[p.name] ? `<p class="ok">Контакты ${esc(p.name)}: ${p.contacts.join(' и ')} (выдуманные). В настоящем сайте откроется WhatsApp.</p>` : `<button class="btn" data-write="${esc(p.name)}">Написать</button>`)}
      </details></article>`;
  }

  /* ---------- анкета: сохранение на ходу ---------- */
  function afterAnketa() {
    const form = $('#anketa');
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.name) S.f[el.name] = el.value;
      if (el.dataset.contact) {
        const c = $$('[data-contact]:checked', form);
        if (c.length > 2) { el.checked = false; alert('Можно выбрать только два контакта'); }
        S.f.contacts = $$('[data-contact]:checked', form).map((x) => x.dataset.contact);
      }
      if (el.name === 'about') $('[name=aboutOwn]', form).classList.toggle('hide', el.value !== 'Написать самому');
      if (el.name === 'height' || el.name === 'weight') { const b = bmi(+S.f.height, +S.f.weight); $('#bmi').innerHTML = b ? `Индекс массы тела: <b>${b}</b> — ${bmiWord(b)}` : ''; }
      save();
    });
  }

  document.addEventListener('change', (e) => { const k = e.target.dataset.imp; if (k) { S.imp[k] = e.target.checked; save(); } });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t || t.closest('.bug-dlg') || t.classList.contains('bug')) return;
    const d = t.dataset;
    if (d.go) { e.preventDefault(); return go(d.go); }
    if (d.test) { S.cur = d.test; S.qi = 0; S.tmp = []; return go('test'); }
    if (d.a != null) { const T = TESTS.find((x) => x.id === S.cur); S.tmp[S.qi] = T.qs[S.qi][1].length === 5 ? +d.a + 1 : +d.a;
      if (S.qi < T.qs.length - 1) { S.qi++; return render(); } S.t[S.cur] = S.tmp.slice(); return go('tests'); }
    if (d.qback != null) { S.qi--; return render(); }
    if (d.count) { S.count = +d.count; return render(); }
    if (d.write) { S.sent[d.write] = 1; render(); const det = $$('details').find((x) => x.closest('.kcard').innerHTML.includes(d.write)); if (det) det.open = true; return; }
    if (d.act === 'reply') { S.inbox = 'replied'; return render(); }
    if (d.act === 'ignore') { S.inbox = 'gone'; return go('cards'); }
    if (d.act === 'reset') { S = fresh(); return go('start'); }
  });
  document.addEventListener('DOMContentLoaded', render);
})();
