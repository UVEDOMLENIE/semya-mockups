/* Кнопка «Замечание» — общая для всех страниц «СемьЯ».
   Замечания копятся в этом браузере (ключ semya-notes) и уходят тремя путями:
   «Поделиться» (на телефоне откроет WhatsApp и др.), «Скопировать», «Скачать (Word)». */
(function () {
  const KEY = 'semya-notes';
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const save = (l) => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
  const asText = () => 'Замечания — «СемьЯ»\n\n' + load().map((n, i) => `${i + 1}. ${n.at}, «${n.screen}»\n${n.t}`).join('\n\n');
  const inFrame = (() => { try { return window.top !== window.self; } catch (e) { return true; } })();

  let dlg, btn;
  function where() {
    const page = (window.NOTE_PAGE || document.title || '').trim();
    let screen = '';
    if (typeof window.NOTE_SCREEN === 'function') { try { screen = window.NOTE_SCREEN() || ''; } catch (e) {} }
    if (!screen) { const s = document.querySelector('[data-screen].on'); if (s) screen = s.dataset.title || s.dataset.screen; }
    return page + (screen ? ' / ' + screen : '');
  }
  function refresh() {
    const n = load().length;
    if (btn) btn.textContent = '✎ Замечание' + (n ? ' · ' + n : '');
    if (dlg) dlg.querySelector('.bug-count').textContent = n ? 'Сохранено замечаний: ' + n + '. Отправьте их Диме кнопкой «Поделиться» или «Скопировать».' : 'Пока замечаний нет.';
  }
  function flash(t) { const p = dlg.querySelector('.bug-ok'); p.textContent = t; setTimeout(() => { p.textContent = ''; }, 2500); }
  function open(prefix) {
    if (!dlg) build();
    dlg.classList.add('on'); refresh();
    const ta = dlg.querySelector('textarea'); if (prefix != null) ta.value = prefix; ta.focus();
  }
  function build() {
    dlg = document.createElement('div'); dlg.className = 'bug-dlg';
    dlg.innerHTML = `<div class="bug-box"><b>Замечание</b>
      <p class="bug-hint">Что не так, что непонятно, что пришло в голову? Пишите как есть — экран запомнится сам.</p>
      <textarea rows="5"></textarea>
      <div class="bug-row"><button data-save>Сохранить</button><button data-x>Закрыть</button></div>
      <p class="bug-count"></p>
      <div class="bug-row"><button data-share>Поделиться</button><button data-copy>Скопировать</button><button data-dl>Скачать (Word)</button></div>
      <p class="bug-ok"></p></div>`;
    document.body.append(dlg);
    if (!navigator.share) dlg.querySelector('[data-share]').style.display = 'none';
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.classList.remove('on'); });
    dlg.querySelector('[data-x]').onclick = () => dlg.classList.remove('on');
    dlg.querySelector('[data-save]').onclick = () => {
      const ta = dlg.querySelector('textarea'); const t = ta.value.trim(); if (!t) return;
      const l = load(); l.push({ t, screen: where(), at: new Date().toLocaleString('ru-RU') }); save(l);
      ta.value = ''; refresh(); flash('Сохранено ✓');
    };
    dlg.querySelector('[data-share]').onclick = async () => {
      if (!load().length) return flash('Сначала сохраните замечание');
      try { await navigator.share({ title: 'Замечания — СемьЯ', text: asText() }); } catch (e) {}
    };
    dlg.querySelector('[data-copy]').onclick = async () => {
      if (!load().length) return flash('Сначала сохраните замечание');
      try { await navigator.clipboard.writeText(asText()); flash('Скопировано — вставьте в WhatsApp'); }
      catch (e) { const ta = dlg.querySelector('textarea'); ta.value = asText(); ta.select(); flash('Выделите и скопируйте текст'); }
    };
    dlg.querySelector('[data-dl]').onclick = () => {
      const l = load();
      const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:14pt"><h1>Замечания — «СемьЯ»</h1>` +
        l.map((n, i) => `<p><b>${i + 1}.</b> ${esc(n.at)}, экран «${esc(n.screen)}»<br>${esc(n.t)}</p>`).join('') + '</body></html>';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + html], { type: 'application/msword' }));
      a.download = 'zamechaniya-semya.doc'; a.click();
    };
  }
  window.NOTES = { open, count: () => load().length };
  document.addEventListener('click', (e) => {
    const n = e.target.closest('[data-note]'); if (n) { e.preventDefault(); open(n.dataset.note); }
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (inFrame) return;
    btn = document.createElement('button'); btn.className = 'bug'; btn.type = 'button';
    btn.onclick = () => open(); document.body.append(btn); refresh();
  });
})();
