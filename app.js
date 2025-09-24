// 画面上に各デモの現在サイズ（px / % / vw / vh / em / rem / font-size）を表示する
document.addEventListener("DOMContentLoaded", () => {
  const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  function ensureIndicator(el) {
    let ind = el.querySelector(".size-indicator");
    if (!ind) {
      ind = document.createElement("span");
      ind.className = "size-indicator";
      ind.style.display = "block";
      ind.style.marginTop = "8px";
      ind.style.fontWeight = "700";
      ind.style.height = "50px";
      el.appendChild(ind);
    }
    return ind;
  }

  function ensureLabel(el) {
    // メイン表示用ラベル（textContent を直接書き換える代わりに使う）
    let lbl = el.querySelector(".demo-label");
    if (!lbl) {
      lbl = document.createElement("div");
      lbl.className = "demo-label";
      lbl.style.display = "block";
      lbl.style.fontWeight = "600";
      // label を先頭に挿入（元の説明テキストの代わりになる）
      el.insertBefore(lbl, el.firstChild);
    }
    return lbl;
  }

  function updateIndicators() {
    const demos = document.querySelectorAll(".demo-box, .clamp-text");
    demos.forEach((el) => {
      const ind = ensureIndicator(el);
      const lbl = ensureLabel(el);
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      let indicatorText = "";
      let labelText = "";

      if (el.classList.contains("px-demo")) {
        const w = Math.round(rect.width);
        indicatorText = `${w}px`;
        labelText = `幅: ${w}px`;
      } else if (el.classList.contains("percent-demo")) {
        const w = Math.floor(rect.width);
        const parent = el.parentElement || document.documentElement;
        const parentW =
          parent.getBoundingClientRect().width ||
          document.documentElement.clientWidth;
        const pct = Math.floor((w / parentW) * 100) + 1;
        indicatorText = `${pct}% (${w}px)`;
        labelText = `幅: ${pct}%`;
      } else if (el.classList.contains("vw-demo")) {
        const w = Math.floor(rect.width);
        const vw = Math.floor(((w / window.innerWidth) * 100).toFixed(1));
        indicatorText = `${w}px (${vw}vw)`;
        labelText = `幅: ${w}px (${vw}vw)`;
      } else if (el.classList.contains("vh-demo")) {
        const h = Math.floor(rect.height);
        const vh = Math.floor((h / window.innerHeight) * 100);
        indicatorText = `${h}px (${vh}vh)`;
        labelText = `高さ: ${h}px \n (${vh}vh)`;
      } else if (el.classList.contains("em-demo")) {
        const style = window.getComputedStyle(el);
        const w = rect.width;
        const parentFont =
          parseFloat(getComputedStyle(el.parentElement).fontSize) || 16;
        const em = (w / parentFont).toFixed(2);
        indicatorText = `${em}em (${Math.round(w)}px)`;
        labelText = `幅: ${em}em (${Math.round(w)}px)`;
      } else if (el.classList.contains(".parent-container")) {
        const instruction = el.querySelector(".instruction");
        const style = window.getComputedStyle(el);
        console.log(style.fontSize);
        instruction.textContent = `親コンテナのフォントサイズ: ${style.fontSize}`;
      } else if (el.classList.contains("rem-demo")) {
        const w = rect.width;
        const rootFont =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const rem = (w / rootFont).toFixed(2);
        indicatorText = `${rem}rem (${Math.round(w)}px)`;
        labelText = `幅: ${rem}rem (${Math.round(w)}px)`;
      } else if (el.classList.contains("clamp-demo")) {
        const w = Math.round(rect.width);
        indicatorText = `${w}px`;
        labelText = `幅 (clamp): ${w}px`;
      } else if (el.classList.contains("clamp-text")) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        const rootFont =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const rem = (fs / rootFont).toFixed(2);
        indicatorText = `font-size: ${Math.round(fs)}px (${rem}rem)`;
        // clamp-text はラベルは既存テキストを残したいので短めに
        labelText = `テキストサイズ: ${Math.round(fs)}px`;
      } else {
        indicatorText = `${Math.round(rect.width)}×${Math.round(
          rect.height
        )}px`;
        labelText = `${Math.round(rect.width)}×${Math.round(rect.height)}px`;
      }

      // ラベルとインジケーターを更新（indicator は下部、label は上部）
      lbl.textContent = labelText;
      ind.textContent = indicatorText;
    });

    const parent = document.querySelector(".parent-container");
    if (parent) {
      const instruction = parent.querySelector(".instruction");
      const style = window.getComputedStyle(parent);
      instruction.textContent = `親コンテナのフォントサイズ: ${style.fontSize}`;
    }
  }

  const handle = debounce(updateIndicators, 80);
  updateIndicators();
  window.addEventListener("resize", handle);
  // フォントサイズを変えたり CSS を編集した時に反映させたい場合は MutationObserver も有効
  const mo = new MutationObserver(debounce(updateIndicators, 300));
  mo.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    childList: true,
  });
});
