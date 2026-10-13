function normalizeEntries(root = document) {
  root.querySelectorAll('ul.dir li').forEach(li => {
    if (li.dataset.orangeNormalized === '1') return;

    const panel   = li.querySelector(':scope > .entry-panel');
    const wrapper = li.querySelector(':scope > .link-wrapper');
    if (!panel || !wrapper) return;

    const outside = li.querySelector(':scope > .entry-comment');
    if (outside) {
      const d = panel.querySelector('.entry-details');
      d ? panel.insertBefore(outside, d) : panel.appendChild(outside);
    }

    const tagSpan = li.querySelector(':scope > span[style*="display: contents"]');
    if (tagSpan) {
      while (tagSpan.firstChild) wrapper.appendChild(tagSpan.firstChild);
      tagSpan.remove();
    }

    const cb = li.querySelector(':scope > input[type=checkbox]');
    if (cb) {
      if (li.firstElementChild !== cb) {
        li.insertBefore(cb, li.firstElementChild);
      }
      cb.classList.add('entry-checkbox');
      cb.style.flex = '0 0 auto';
      cb.style.width = '.8em';
      cb.style.height = '.8em';
      cb.style.minWidth = '.8em';
      cb.style.maxWidth = '.8em';
      cb.style.boxSizing = 'border-box';
    }

    li.dataset.orangeNormalized = '1';
  });
}

normalizeEntries();

let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    normalizeEntries();
  });
}).observe(document.body, { childList: true, subtree: true });