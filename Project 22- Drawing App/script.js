/* ============================
   Drawing App - Slider Panel
   Comments are in English
   ============================ */

/* ---------- Language data ---------- */
const langData = {
  en: {
    toolsTitle: "Drawing Tools",
    color: "Color",
    size: "Size:",
    opacity: "Opacity:",
    undo: "Undo",
    redo: "Redo",
    clear: "Clear",
    background: "Background",
    save: "Save",
    shortcuts: "Shortcuts: Z Undo · Y Redo · C Clear · S Save",
    hint: "Press and drag to draw — Touch supported",
  },
  ar: {
    toolsTitle: "أدوات الرسم",
    color: "اللون",
    size: "الحجم:",
    opacity: "الشفافية:",
    undo: "تراجع",
    redo: "إعادة",
    clear: "مسح",
    background: "خلفية",
    save: "حفظ",
    shortcuts: "اختصارات: Z تراجع · Y إعادة · C مسح · S حفظ",
    hint: "اضغط واسحب للرسم — يدعم اللمس",
  },
};

let currentLang = "en";

/* ---------- Elements ---------- */
const toggleBtn = document.getElementById("toggleBtn");
const panel = document.getElementById("toolsPanel");

const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");
const fillBtn = document.getElementById("fillBtn");
const lineBtn = document.getElementById("lineBtn");
const rectBtn = document.getElementById("rectBtn");
const textBtn = document.getElementById("textBtn");

const colorPicker = document.getElementById("colorPicker");
const presetColorsEl = document.getElementById("presetColors");
const sizeRange = document.getElementById("size");
const sizeVal = document.getElementById("sizeVal");
const opacityRange = document.getElementById("opacity");
const opacityVal = document.getElementById("opacityVal");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");
const bgUpload = document.getElementById("bgUpload");
const fitBtn = document.getElementById("fitBtn");
const downloadBtn = document.getElementById("downloadBtn");
const langBtn = document.getElementById("langBtn");

const hintText = document.getElementById("hintText");
const shortcutsInfo = document.getElementById("shortcutsInfo");

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

/* ---------- State ---------- */
let currentTool = "brush";
let drawing = false;
let startX = 0,
  startY = 0;
let brush = {
  size: Number(sizeRange.value) || 6,
  color: colorPicker.value || "#000000",
  opacity: (Number(opacityRange.value) || 100) / 100,
};

/* History as dataURLs */
const history = {
  stack: [],
  index: -1,
  push(dataURL) {
    if (this.index < this.stack.length - 1) this.stack.splice(this.index + 1);
    this.stack.push(dataURL);
    this.index = this.stack.length - 1;
    updateUR();
  },
  canUndo() {
    return this.index > 0;
  },
  canRedo() {
    return this.index < this.stack.length - 1;
  },
  undo() {
    if (this.canUndo()) {
      this.index--;
      this.restore();
    }
  },
  redo() {
    if (this.canRedo()) {
      this.index++;
      this.restore();
    }
  },
  restore() {
    const url = this.stack[this.index];
    if (!url) {
      clearCanvasImmediate();
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = url;
    updateUR();
  },
};

function updateUR() {
  undoBtn.disabled = !history.canUndo();
  redoBtn.disabled = !history.canRedo();
}

/* ---------- Helpers ---------- */

// set UI language and direction
function applyLanguage(lang) {
  currentLang = lang;
  const d = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang === "ar" ? "ar" : "en";
  document.documentElement.dir = d;
  // update texts
  const t = langData[lang];
  document.getElementById("toolsTitle").textContent = t.toolsTitle;
  document.getElementById("colorLabel").textContent = t.color;
  document.getElementById("sizeLabel").childNodes[0].textContent = t.size + " ";
  document.getElementById("opacityLabel").childNodes[0].textContent =
    t.opacity + " ";
  undoBtn.textContent = t.undo;
  redoBtn.textContent = t.redo;
  clearBtn.textContent = t.clear;
  document.getElementById("bgLabel").textContent = t.background;
  downloadBtn.textContent = t.save;
  shortcutsInfo.textContent = t.shortcuts;
  hintText.textContent = t.hint;

  // reposition floating & panel handled by CSS [dir] selectors
}

// convert pointer event to canvas coords (supports touch)
function getPosFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches.length) {
    const t = e.touches[0];
    return {
      x: (t.clientX - rect.left) * (canvas.width / rect.width),
      y: (t.clientY - rect.top) * (canvas.height / rect.height),
    };
  } else {
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }
}

// resize canvas to parent stage, preserving content by scaling current image
function resizeCanvasPreserve() {
  const parent = canvas.parentElement;
  const targetW = Math.max(64, parent.clientWidth - 36);
  const targetH = Math.max(64, parent.clientHeight - 36);
  // snapshot
  const snapshot = canvas.toDataURL("image/png");
  const img = new Image();
  img.onload = () => {
    canvas.width = targetW;
    canvas.height = targetH;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    pushState();
  };
  img.onerror = () => {
    canvas.width = targetW;
    canvas.height = targetH;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushState();
  };
  img.src = snapshot;
}

/* ---------- Drawing flow ---------- */

function startDrawing(e) {
  e.preventDefault();
  const p = getPosFromEvent(e);
  startX = p.x;
  startY = p.y;
  drawing = true;

  ctx.lineWidth = brush.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = brush.opacity;

  if (currentTool === "brush" || currentTool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : brush.color;
  } else if (currentTool === "fill") {
    // simple fill: fill whole canvas with color
    ctx.fillStyle = brush.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawing = false;
    pushState();
  }
}

function drawingMove(e) {
  if (!drawing) return;
  const p = getPosFromEvent(e);

  if (currentTool === "brush" || currentTool === "eraser") {
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  } else {
    // for shape preview: we redraw the last saved state then draw a temporary shape
    // simple approach: restore last state image then draw shape on top
    if (history.index >= 0) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawPreviewShape(p);
      };
      img.src = history.stack[history.index];
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPreviewShape(p);
    }
  }
}

function drawPreviewShape(p) {
  ctx.strokeStyle = brush.color;
  ctx.fillStyle = brush.color;
  ctx.lineWidth = brush.size;
  if (currentTool === "line") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  } else if (currentTool === "rect") {
    ctx.beginPath();
    ctx.strokeRect(startX, startY, p.x - startX, p.y - startY);
  } else if (currentTool === "text") {
    // just show caret or sample
    ctx.font = `${brush.size * 3}px sans-serif`;
    ctx.fillText("Text", startX, startY);
  }
}

function stopDrawing(e) {
  if (!drawing) return;
  drawing = false;
  const p = getPosFromEvent(e);

  if (currentTool === "line") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = brush.color;
    ctx.stroke();
  } else if (currentTool === "rect") {
    ctx.strokeStyle = brush.color;
    ctx.strokeRect(startX, startY, p.x - startX, p.y - startY);
  } else if (currentTool === "text") {
    const text = prompt(currentLang === "ar" ? "أدخل النص:" : "Enter text:");
    if (text) {
      ctx.fillStyle = brush.color;
      ctx.font = `${brush.size * 3}px sans-serif`;
      ctx.fillText(text, startX, startY);
    }
  } else if (currentTool === "brush" || currentTool === "eraser") {
    ctx.closePath();
  }

  pushState();
}

/* ---------- History and utilities ---------- */
function pushState() {
  try {
    const data = canvas.toDataURL("image/png");
    history.push(data);
  } catch (e) {
    console.warn("pushState failed", e);
  }
}

function clearCanvasImmediate() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function downloadPNG() {
  const a = document.createElement("a");
  a.download = "drawing.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}

/* ---------- Tool selection UI ---------- */
const toolBtns = [brushBtn, eraserBtn, fillBtn, lineBtn, rectBtn, textBtn];
function setActiveTool(name) {
  currentTool = name;
  toolBtns.forEach((b) => b.classList.remove("active"));
  if (name === "brush") brushBtn.classList.add("active");
  if (name === "eraser") eraserBtn.classList.add("active");
  if (name === "fill") fillBtn.classList.add("active");
  if (name === "line") lineBtn.classList.add("active");
  if (name === "rect") rectBtn.classList.add("active");
  if (name === "text") textBtn.classList.add("active");
}

/* ---------- Preset colors ---------- */
const presets = [
  "#000000",
  "#ffffff",
  "#e11d48",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
];
function renderPresets() {
  presetColorsEl.innerHTML = "";
  presets.forEach((c) => {
    const but = document.createElement("button");
    but.className = "tool-btn";
    but.style.padding = "6px";
    but.style.minWidth = "28px";
    but.style.minHeight = "28px";
    but.style.borderRadius = "8px";
    but.style.background = c;
    but.title = c;
    but.addEventListener("click", () => {
      colorPicker.value = rgbToHex(c);
      brush.color = colorPicker.value;
    });
    presetColorsEl.appendChild(but);
  });
}
function rgbToHex(c) {
  return c;
}

/* ---------- Event wiring ---------- */

// toggle panel open/close
toggleBtn.addEventListener("click", () => {
  const open = panel.classList.toggle("open");
  panel.setAttribute("aria-hidden", !open);
});

// close panel when clicking outside
window.addEventListener("click", (e) => {
  if (!panel.classList.contains("open")) return;
  const isInside = panel.contains(e.target) || toggleBtn.contains(e.target);
  if (!isInside) {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }
});

// tool button handlers
brushBtn.addEventListener("click", () => setActiveTool("brush"));
eraserBtn.addEventListener("click", () => setActiveTool("eraser"));
fillBtn.addEventListener("click", () => setActiveTool("fill"));
lineBtn.addEventListener("click", () => setActiveTool("line"));
rectBtn.addEventListener("click", () => setActiveTool("rect"));
textBtn.addEventListener("click", () => setActiveTool("text"));

// color & size & opacity
colorPicker.addEventListener("input", (e) => {
  brush.color = e.target.value;
});
sizeRange.addEventListener("input", (e) => {
  brush.size = Number(e.target.value);
  sizeVal.textContent = brush.size;
});
opacityRange.addEventListener("input", (e) => {
  brush.opacity = Number(e.target.value) / 100;
  opacityVal.textContent = Number(e.target.value);
});

// undo / redo / clear / download
undoBtn.addEventListener("click", () => history.undo());
redoBtn.addEventListener("click", () => history.redo());
clearBtn.addEventListener("click", () => {
  clearCanvasImmediate();
  pushState();
});
downloadBtn.addEventListener("click", downloadPNG);

// background upload
bgUpload.addEventListener("change", (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      pushState();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(f);
});

// fit to screen
fitBtn.addEventListener("click", () => resizeCanvasPreserve());

// language toggle
langBtn.addEventListener("click", () => {
  applyLanguage(currentLang === "en" ? "ar" : "en");
  // adjust floating position automatically handled by CSS [dir]
});

// keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    history.undo();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
    e.preventDefault();
    history.redo();
  } else if (e.key.toLowerCase() === "z") {
    history.undo();
  } else if (e.key.toLowerCase() === "y") {
    history.redo();
  } else if (e.key.toLowerCase() === "c") {
    clearCanvasImmediate();
    pushState();
  } else if (e.key.toLowerCase() === "s") {
    e.preventDefault();
    downloadPNG();
  }
});

// pointer events for drawing (mouse + touch)
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawingMove);
window.addEventListener("mouseup", stopDrawing);

canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", drawingMove, { passive: false });
window.addEventListener("touchend", stopDrawing, { passive: false });

/* ---------- Initialize ---------- */
function initialize() {
  // initial canvas sizing
  const parent = canvas.parentElement;
  canvas.width = Math.max(300, parent.clientWidth - 36);
  canvas.height = Math.max(200, parent.clientHeight - 36);

  // white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // defaults
  setActiveTool("brush");
  renderPresets();
  pushState();
  applyLanguage(currentLang);

  window.addEventListener("resize", () => {
    // debounce
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(() => resizeCanvasPreserve(), 160);
  });
}

initialize();
