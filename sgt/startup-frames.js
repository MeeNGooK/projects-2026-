(() => {
  const intro = document.querySelector('#frameIntro');
  const button = document.querySelector('#frameIntroButton');
  const hint = document.querySelector('#frameIntroHint');
  if (!intro || !button) return;
  let current = 1;
  let busy = false;
  button.addEventListener('click', () => {
    if (busy) return;
    const frame = button.querySelector(`[data-frame="${current}"]`);
    if (!frame) return;
    busy = true;
    frame.classList.add('peeling');
    if (current < 5) hint.textContent = `TOUCH TO PEEL · ${current + 1} / 5`;
    setTimeout(() => {
      frame.remove();
      current += 1;
      busy = false;
      if (current === 6) {
        intro.classList.add('done');
        setTimeout(() => intro.remove(), 420);
      }
    }, 620);
  });
})();
