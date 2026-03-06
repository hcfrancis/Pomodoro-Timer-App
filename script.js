(function () {
  const display = document.getElementById('display');
  const ring = document.getElementById('ring');
  const startBtn = document.getElementById('start');
  const restartBtn = document.getElementById('restart');
  const stream = document.getElementById('stream');
  const presets = document.querySelectorAll('.presets button');

  const CIRCUMFERENCE = 2 * Math.PI * 47;

  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let interval = null;

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function updateRing() {
    var progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
    ring.style.strokeDasharray = CIRCUMFERENCE;
    ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  }

  function render() {
    display.textContent = format(remaining);
    display.classList.toggle('done', remaining === 0);
    updateRing();
  }

  function updateStartBtn() {
    startBtn.textContent = interval ? 'Pause' : 'Start';
  }

  function tick() {
    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;
      stream.pause();
      stream.currentTime = 0;
      updateStartBtn();
      return;
    }
    remaining--;
    render();
  }

  function toggleStartPause() {
    if (interval) {
      clearInterval(interval);
      interval = null;
      stream.pause();
    } else {
      if (remaining <= 0) return;
      stream.play().catch(function () {});
      interval = setInterval(tick, 1000);
    }
    updateStartBtn();
  }

  function stopTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    stream.pause();
    stream.currentTime = 0;
    updateStartBtn();
  }

  function setDuration(minutes) {
    stopTimer();
    totalSeconds = minutes * 60;
    remaining = totalSeconds;
    render();
  }

  function restartTimer() {
    stopTimer();
    remaining = totalSeconds;
    render();
  }

  startBtn.addEventListener('click', toggleStartPause);
  restartBtn.addEventListener('click', restartTimer);
  presets.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setDuration(Number(btn.dataset.min));
    });
  });

  render();
  updateStartBtn();
})();
