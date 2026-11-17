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

/* ===== 高性能模式（前台 Options 對話框勾選項） =====
   在前台頁面按齒輪「Options」打開的對話框內新增勾選項，
   狀態存於 localStorage（每個瀏覽器各自記住）。為了兼容大部分
   移動設備，預設勾選（高性能）；取消勾選才是畫質模式。
   勾選後於 body 加上 .orange-low-perf，由 style.css 全局
   禁用陰影、模糊與非必要動畫。 */
const LOW_PERF_CLASS       = 'orange-low-perf';
const LOW_PERF_STORAGE_KEY = 'orange-low-perf';
const LOW_PERF_PANEL_ID    = 'orange-low-perf-panel';
const LOW_PERF_CHECKBOX_ID = 'orange-low-perf-checkbox';

function isLowPerformanceEnabled() {
  try {
    // 預設開啟：只有使用者明確關閉（存 '0'）才回到畫質模式
    return localStorage.getItem(LOW_PERF_STORAGE_KEY) !== '0';
  } catch (e) {
    return true;
  }
}

function setLowPerformanceEnabled(enabled) {
  try {
    localStorage.setItem(LOW_PERF_STORAGE_KEY, enabled ? '1' : '0');
  } catch (e) {
    // 隱私模式或封鎖 localStorage 時忽略，仍於本次頁面生效
  }
}

function applyLowPerformanceMode(enabled) {
  if (!document.body) return;
  if (enabled === undefined) enabled = isLowPerformanceEnabled();
  document.body.classList.toggle(LOW_PERF_CLASS, enabled);
}

function buildLowPerformanceOption() {
  const panel = document.createElement('div');
  panel.id = LOW_PERF_PANEL_ID;
  panel.style.cssText = 'margin-top:1em;padding-top:1em;border-top:1px solid var(--faint-contrast);';

  const label = document.createElement('label');
  label.style.cssText = 'display:flex;align-items:center;cursor:pointer;';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = LOW_PERF_CHECKBOX_ID;
  checkbox.checked = isLowPerformanceEnabled();
  checkbox.addEventListener('change', () => {
    setLowPerformanceEnabled(checkbox.checked);
    applyLowPerformanceMode(checkbox.checked);
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode('High-performance mode'));
  panel.appendChild(label);

  return panel;
}

function ensureLowPerformanceOption() {
  if (!document.body) return;
  if (document.getElementById(LOW_PERF_PANEL_ID)) return;

  // Options 對話框以 #option-theme / #option-sort-by 等核心選項識別，
  // 避免誤插入上傳、登入等其他對話框。
  const dialogs = document.querySelectorAll('.dialog');
  for (const dialog of dialogs) {
    if (!dialog.querySelector('#option-theme, #option-sort-by, #option-tile-size')) continue;
    const content = dialog.querySelector('.dialog-content');
    if (!content) continue;
    const container = content.querySelector(':scope > div') || content;
    container.appendChild(buildLowPerformanceOption());
    return;
  }
}

let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    normalizeEntries();
    ensureLowPerformanceOption();
  });
}).observe(document.body, { childList: true, subtree: true });

function initLowPerformanceMode() {
  applyLowPerformanceMode();
  ensureLowPerformanceOption();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLowPerformanceMode, { once: true });
} else {
  initLowPerformanceMode();
}
window.addEventListener('load', initLowPerformanceMode, { once: true });
