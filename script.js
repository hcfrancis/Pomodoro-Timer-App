(function () {
  const display = document.getElementById('display');
  const startBtn = document.getElementById('start');
  const restartBtn = document.getElementById('restart');
  const stream = document.getElementById('stream');
  const presets = document.querySelectorAll('.presets button');

  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let interval = null;
  let isEditing = false;
  let editMins = '';
  let editSecs = '';
  let editSection = 'mins';

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function render() {
    if (isEditing) return;
    display.textContent = format(remaining);
    display.classList.toggle('done', remaining === 0);
  }

  function renderEdit() {
    var c = '<span class="cursor">|</span>';
    var mDisplay = editMins.padEnd(2, '-');
    var sDisplay = editSecs.padEnd(2, '-');
    var html;
    if (editSection === 'mins') {
      html = editMins + c + mDisplay.slice(editMins.length) + ':' + sDisplay;
    } else {
      html = mDisplay + ':' + editSecs + c + sDisplay.slice(editSecs.length);
    }
    display.innerHTML = html;
  }

  function enterEditMode() {
    if (interval) return;
    isEditing = true;
    editMins = '';
    editSecs = '';
    editSection = 'mins';
    renderEdit();
  }

  function commitEdit() {
    isEditing = false;
    if (editMins === '' && editSecs === '') { render(); return; }
    var m = editMins === '' ? 0 : parseInt(editMins, 10);
    var s = editSecs === '' ? 0 : parseInt(editSecs, 10);
    if (isNaN(m) || m > 59) m = 59;
    if (isNaN(s) || s > 59) s = 59;
    if (m === 0 && s === 0) s = 1;
    totalSeconds = m * 60 + s;
    remaining = totalSeconds;
    render();
  }

  function updateStartBtn() {
    startBtn.classList.toggle('playing', !!interval);
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

  display.addEventListener('focus', function () {
    if (!interval) enterEditMode();
  });

  display.addEventListener('blur', function () {
    if (isEditing) commitEdit();
  });

  display.addEventListener('keydown', function (e) {
    if (!isEditing) return;
    if (/^[0-9]$/.test(e.key)) {
      if (editSection === 'mins' && editMins.length < 2) {
        if (editMins.length === 0 && parseInt(e.key) > 5) { e.preventDefault(); return; }
        editMins += e.key;
        if (editMins.length === 2) editSection = 'secs';
        renderEdit();
      } else if (editSection === 'secs' && editSecs.length < 2) {
        if (editSecs.length === 0 && parseInt(e.key) > 5) { e.preventDefault(); return; }
        editSecs += e.key;
        renderEdit();
      }
    } else if (e.key === ':') {
      editSection = 'secs';
      renderEdit();
    } else if (e.key === 'Backspace') {
      if (editSection === 'secs' && editSecs.length === 0) {
        editSection = 'mins';
      } else if (editSection === 'secs') {
        editSecs = editSecs.slice(0, -1);
      } else {
        editMins = editMins.slice(0, -1);
      }
      renderEdit();
    } else if (e.key === 'Enter') {
      display.blur();
    } else if (e.key === 'Escape') {
      display.blur();
    }
    e.preventDefault();
  });

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
