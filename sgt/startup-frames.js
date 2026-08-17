(() => {
  const intro = document.querySelector('#frameIntro');
  const button = document.querySelector('#frameIntroButton');
  const hint = document.querySelector('#frameIntroHint');
  if (!intro || !button) return;
  let started = false;
  const delays = [0, 270, 170, 115, 95];
  button.addEventListener('click', () => {
    if (started) return;
    started = true;
    hint.textContent = 'PEELING THE NOTE...';
    delays.forEach((delay, index) => {
      setTimeout(() => {
        const frame = button.querySelector(`[data-frame="${index + 1}"]`);
        if (!frame) return;
        frame.classList.add('peeling');
        setTimeout(() => frame.remove(), 620);
      }, delay);
    });
    setTimeout(() => {
      intro.classList.add('done');
      setTimeout(() => intro.remove(), 420);
    }, delays.at(-1) + 650);
  });
})();
