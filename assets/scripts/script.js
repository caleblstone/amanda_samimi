document.addEventListener('DOMContentLoaded', function () {
  // Always sync dark mode with user preference
  function syncDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  syncDarkMode();

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncDarkMode);
  }

  // Hashes for both desktop and mobile, in order
  const hashes = ['visual-art', 'film', 'about'];

  // Desktop workBox toggling
  const workBoxes = document.querySelectorAll('.workBox');
  workBoxes.forEach((box, idx) => {
    box.addEventListener('click', function (e) {
      // Prevent toggling when clicking inside .categoryContent
      if (e.target.closest('.categoryContent')) return;
      setActiveByIndex(idx, true);
    });
  });

  // Mobile pills logic
  const pills = document.querySelectorAll('#mobileWorkBox .pill');
  const scrollFixBoxes = document.querySelectorAll('#mobileWorkBox .scrollFixBox');
  pills.forEach((pill, idx) => {
    pill.addEventListener('click', function () {
      setActiveByIndex(idx, true);
    });
  });

  // Unified function to activate by index and update hash
  function setActiveByIndex(idx, updateHash = true) {
    // Desktop
    if (workBoxes.length) {
      workBoxes.forEach((box, boxIdx) => {
        if (boxIdx === idx) {
          box.classList.add('open');
          box.classList.remove('closed');
        } else {
          box.classList.remove('open');
          box.classList.add('closed');
        }
      });
    }
    // Mobile
    if (scrollFixBoxes.length) {
      scrollFixBoxes.forEach((box, boxIdx) => {
        if (boxIdx === idx) {
          box.classList.add('open');
          box.classList.remove('closed');
        } else {
          box.classList.remove('open');
          box.classList.add('closed');
        }
      });
      pills.forEach((p, pIdx) => {
        if (pIdx === idx) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }
    if (updateHash && hashes[idx]) {
      window.location.hash = hashes[idx];
    }
  }

  // On hash change or load, activate the correct section
  function activateFromHash() {
    const hash = window.location.hash.replace('#', '');
    const idx = hashes.indexOf(hash);
    if (idx !== -1) {
      setActiveByIndex(idx, false);
    } else {
      setActiveByIndex(0, false); // default to first section
    }
  }

  window.addEventListener('hashchange', activateFromHash);
  activateFromHash(); // run on initial load
});