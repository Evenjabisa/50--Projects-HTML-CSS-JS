const codes = document.querySelectorAll(".code");

codes[0].focus();

codes.forEach((code, idx) => {
  code.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
      codes[idx].value = "";
      setTimeout(() => {
        if (idx < codes.length - 1) {
          codes[idx + 1].focus();
        }
      }, 10);
    } else if (e.key === "Backspace") {
      setTimeout(() => {
        if (idx > 0) {
          codes[idx - 1].focus();
        }
      }, 10);
    }
  });
});
