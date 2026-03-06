(function () {
  const display = document.getElementById('display');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const restartBtn = document.getElementById('restart');
  const stream = document.getElementById('stream');
  const presets = document.querySelectorAll('.presets button');

  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let interval = null;

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function render() {
    display.textContent = format(remaining);
    display.classList.toggle('done', remaining === 0);
  }

  function tick() {
    if (remaining <= 0) {
      stopTimer();
      stream.pause();
      stream.currentTime = 0;
      return;
    }
    remaining--;
    render();
  }

  function startTimer() {
    if (interval) return;
    stream.play().catch(function () {});
    interval = setInterval(tick, 1000);
    startBtn.disabled = true;
  }

  function stopTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    stream.pause();
    stream.currentTime = 0;
    startBtn.disabled = false;
  }

  function pauseTimer() {
    if (!interval) return;
    clearInterval(interval);
    interval = null;
    stream.pause();
    startBtn.disabled = false;
  }

  function setDuration(minutes) {
    stopTimer();
    totalSeconds = minutes * 60;
    remaining = totalSeconds;
    render();
  }

  function restartTimer() {
    remaining = totalSeconds;
    stream.currentTime = 0;
    render();
    if (!interval) {
      startTimer();
    } else {
      stream.play().catch(function () {});
    }
  }

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  restartBtn.addEventListener('click', restartTimer);
  presets.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setDuration(Number(btn.dataset.min));
    });
  });

  render();
})();
