document.addEventListener('DOMContentLoaded', function () {
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

// Carousel logic
(function() {
  const modal = document.getElementById('carouselModal');
  if (!modal) return;
  const overlay = modal.querySelector('.carousel-overlay');
  const closeBtn = modal.querySelector('.carousel-close');
  const prevBtn = modal.querySelector('.carousel-prev');
  const nextBtn = modal.querySelector('.carousel-next');
  const imageDiv = modal.querySelector('.carousel-image');
  const textDiv = modal.querySelector('.carousel-text');

  let currentWorks = [];
  let currentIndex = 0;

  // Helper to extract image src and text from a .work element
  function getWorkData(work) {
    const img = work.querySelector('.workImage img');
    const text = work.querySelector('.workText');
    return {
      imgSrc: img ? img.src : '',
      imgAlt: img ? img.alt : '',
      textHtml: text ? text.innerHTML : ''
    };
  }

  // Show modal with given works and index
  function showModal(works, idx) {
    currentWorks = works;
    currentIndex = idx;
    updateModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Update modal content
  function updateModal() {
    const work = currentWorks[currentIndex];
    const data = getWorkData(work);
    imageDiv.innerHTML = `<img src="${data.imgSrc}" alt="${data.imgAlt}">`;
    textDiv.innerHTML = data.textHtml;
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    nextBtn.style.display = currentIndex < currentWorks.length - 1 ? 'block' : 'none';
  }

  // Hide modal
  function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Event listeners
  closeBtn.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);
  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      updateModal();
    }
  });
  nextBtn.addEventListener('click', function() {
    if (currentIndex < currentWorks.length - 1) {
      currentIndex++;
      updateModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'Escape') hideModal();
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      currentIndex--;
      updateModal();
    }
    if (e.key === 'ArrowRight' && currentIndex < currentWorks.length - 1) {
      currentIndex++;
      updateModal();
    }
  });

  // Attach click listeners to all .work elements inside each .workBox
  document.querySelectorAll('.workBox').forEach(workBox => {
    const works = Array.from(workBox.querySelectorAll('.work'));
    works.forEach((work, idx) => {
      work.style.cursor = 'pointer';
      work.addEventListener('click', function(e) {
  // Prevent following links inside .work
  if (e.target.tagName === 'A' || e.target.closest('a')) return;
  // Disable carousel on mobile
  if (window.innerWidth <= 600) return;
  showModal(works, idx);
});
    });
  });

  function syncTextWidthToImage() {
  const img = imageDiv.querySelector('img');
  if (img && textDiv) {
    function setWidth() {
      textDiv.style.width = img.offsetWidth + 'px';
    }
    if (!img.complete) {
      img.onload = setWidth;
    } else {
      setWidth();
    }
  }
}

function updateModal() {
  const work = currentWorks[currentIndex];
  const data = getWorkData(work);
  imageDiv.innerHTML = `<img src="${data.imgSrc}" alt="${data.imgAlt}">`;
  textDiv.innerHTML = data.textHtml;
  prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
  nextBtn.style.display = currentIndex < currentWorks.length - 1 ? 'block' : 'none';

  // Wait for the DOM to update before syncing width
  setTimeout(syncTextWidthToImage, 0);
}
})();