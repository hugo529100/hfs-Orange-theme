function normalizeEntries(root = document) {
  root.querySelectorAll('ul.dir li').forEach(li => {
    const panel   = li.querySelector(':scope > .entry-panel');
    const wrapper = li.querySelector(':scope > .link-wrapper');
    if (!panel || !wrapper) return;

    // comment 在 li 下 → 移进 panel，且排在 details 前
    const outside = li.querySelector(':scope > .entry-comment');
    if (outside) {
      const d = panel.querySelector('.entry-details');
      d ? panel.insertBefore(outside, d) : panel.appendChild(outside);
    }

    // hfs 标签 → 移进 link-wrapper
    const tagSpan = li.querySelector(':scope > span[style*="display: contents"]');
    if (tagSpan) {
      while (tagSpan.firstChild) wrapper.appendChild(tagSpan.firstChild);
      tagSpan.remove();
    }
  });
}

// 首次执行
normalizeEntries();

// 仅当目录是 AJAX 切换时才需要下面这段，整页刷新可删
let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    normalizeEntries();
  });
}).observe(document.body, { childList: true, subtree: true });