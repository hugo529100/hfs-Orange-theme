function normalizeEntries(root = document) {
  root.querySelectorAll('ul.dir li').forEach(li => {
    if (li.dataset.orangeNormalized === '1') return;

    const panel   = li.querySelector(':scope > .entry-panel');
    const wrapper = li.querySelector(':scope > .link-wrapper');
    if (!panel || !wrapper) return;

    // comment 移到 panel 最後（大小/時間之後），讓它常駐在格子底部
    const comment = li.querySelector(':scope > .entry-comment') || panel.querySelector(':scope > .entry-comment');
    if (comment) {
      panel.appendChild(comment);
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

/* ===== 對話框堆疊：被上層覆蓋的檔案／資料夾選單 =====
   被覆蓋時先隱藏（省一層繪製）；上層關閉後不急著回復顯示，
   等 300ms 讓選單自己完成關閉，避免「閃一下才消失」。
   只改 class/顯示，不動 HFS 的對話框狀態與回調。 */
const DIALOG_COVERED_CLASS = 'orange-dialog-covered';
const DIALOG_REVEAL_DELAY = 300;
let dialogRevealTimer = 0;
let dialogRevealLayer = null;

function getDialogLayers() {
  return Array.prototype.slice.call(document.querySelectorAll('.dialog-backdrop'));
}

function cancelDialogReveal() {
  if (dialogRevealTimer) {
    clearTimeout(dialogRevealTimer);
    dialogRevealTimer = 0;
  }
  dialogRevealLayer = null;
}

function syncDialogLayers() {
  const layers = getDialogLayers();
  if (!layers.length) {
    cancelDialogReveal();
    return;
  }
  const top = layers[layers.length - 1];

  for (const layer of layers) {
    if (!layer.classList.contains('file-dialog')) continue;

    if (layer !== top) {
      layer.classList.add(DIALOG_COVERED_CLASS);
      if (dialogRevealLayer === layer) cancelDialogReveal();
    } else if (layer.classList.contains(DIALOG_COVERED_CLASS) && dialogRevealLayer !== layer) {
      // 剛成為最上層：延遲回復顯示
      dialogRevealLayer = layer;
      dialogRevealTimer = setTimeout(() => {
        dialogRevealTimer = 0;
        const el = dialogRevealLayer;
        dialogRevealLayer = null;
        if (!el || !el.isConnected) return;
        const now = getDialogLayers();
        if (now[now.length - 1] === el) el.classList.remove(DIALOG_COVERED_CLASS);
      }, DIALOG_REVEAL_DELAY);
    }
  }
}

/* ===== 列表載入 spinner：置中於「可見的文件區域」 =====
   CSS 會把 getfilelist 的 fa-spin6 換成圓環；這裡再依 list-wrapper
   與視窗的交集算出中心，避免它落在整個瀏覽器中央（含 header 上方）。 */
function positionListSpinner() {
  const spinner = document.querySelector('ul.dir > .spinner');
  if (!spinner) return;
  const wrapper = spinner.closest('.list-wrapper');
  const wr = wrapper ? wrapper.getBoundingClientRect() : null;
  const top = Math.max(0, wr ? wr.top : 0);
  const bottom = Math.min(window.innerHeight, wr ? wr.bottom : window.innerHeight);
  const left = Math.max(0, wr ? wr.left : 0);
  const right = Math.min(window.innerWidth, wr ? wr.right : window.innerWidth);
  const cs = getComputedStyle(spinner);
  const w = parseFloat(cs.width) || 0;
  const h = parseFloat(cs.height) || 0;
  spinner.style.position = 'fixed';
  spinner.style.inset = 'auto';
  spinner.style.left = ((left + right) / 2) + 'px';
  spinner.style.top = ((top + bottom) / 2) + 'px';
  spinner.style.margin = '0';
  spinner.style.marginLeft = (-w / 2) + 'px';
  spinner.style.marginTop = (-h / 2) + 'px';
}

let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    normalizeEntries();
    ensureLowPerformanceOption();
    syncDialogLayers();
    positionListSpinner();
  });
}).observe(document.body, { childList: true, subtree: true });
window.addEventListener('resize', positionListSpinner, { passive: true });
window.addEventListener('scroll', positionListSpinner, { passive: true, capture: true });

function initLowPerformanceMode() {
  applyLowPerformanceMode();
  ensureLowPerformanceOption();
  syncDialogLayers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLowPerformanceMode, { once: true });
} else {
  initLowPerformanceMode();
}
window.addEventListener('load', initLowPerformanceMode, { once: true });
