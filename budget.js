function initBudgetPage() {
document.querySelectorAll('.toggle-wrap').forEach(wrap => {
  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
      var view = this.getAttribute('data-view');
      wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelector('.budget-plan-view').classList.toggle('active', view === 'plan');
      document.querySelector('.budget-spent-view').classList.toggle('active', view === 'spent');
    });
  });
});

(function() {
  var overlay = document.getElementById('addOverlay');
  var modal = overlay && overlay.querySelector('.add-modal');
  var fab = document.querySelector('.fab');
  var addDesc = document.getElementById('addDesc');
  var addAmount = document.getElementById('addAmount');
  var chip = document.getElementById('addChip');
  var categoriesScroll = document.getElementById('addCategoriesScroll');
  var celebration = document.getElementById('addCelebration');
  var particlesEl = document.getElementById('addParticles');

  function openAdd() {
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (addDesc) addDesc.value = '';
    if (addAmount) addAmount.value = '';
    if (chip) {
      chip.style.position = '';
      chip.style.left = '';
      chip.style.top = '';
      chip.style.margin = '';
      chip.style.zIndex = '';
      chip.classList.remove('dragging');
    }
    updateChipText();
    if (addDesc) setTimeout(function() { addDesc.focus(); }, 100);
  }

  function closeAdd() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearDropState();
  }

  function updateChipText() {
    if (!chip) return;
    var label = (addDesc && addDesc.value.trim()) || 'Item';
    var amount = (addAmount && addAmount.value.trim()) || '0';
    var num = parseFloat(amount);
    if (isNaN(num)) num = 0;
    chip.querySelector('.chip-label').textContent = label;
    chip.querySelector('.chip-amount').textContent = '$' + (num.toFixed(2));
  }

  if (addDesc) addDesc.addEventListener('input', updateChipText);
  if (addAmount) addAmount.addEventListener('input', updateChipText);

  function clearDropState() {
    if (!categoriesScroll) return;
    categoriesScroll.querySelectorAll('.add-category-card').forEach(function(card) {
      card.classList.remove('drop-target-active', 'drop-target-dimmed');
    });
  }

  function setDropTarget(activeCard) {
    categoriesScroll.querySelectorAll('.add-category-card').forEach(function(card) {
      if (card === activeCard) {
        card.classList.add('drop-target-active');
        card.classList.remove('drop-target-dimmed');
      } else {
        card.classList.remove('drop-target-active');
        card.classList.add('drop-target-dimmed');
      }
    });
  }

  if (fab) fab.addEventListener('click', openAdd);
  if (overlay) overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeAdd();
  });

  var addCategoryLink = document.querySelector('a.add-category');
  var addCategoryOverlay = document.getElementById('addCategoryOverlay');
  var addCategoryCancel = document.getElementById('addCategoryCancel');
  var outfitGrid = document.getElementById('outfitGrid');

  function openAddCategoryModal() {
    if (!addCategoryOverlay) return;
    addCategoryOverlay.classList.add('is-open');
    addCategoryOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeAddCategoryModal() {
    if (!addCategoryOverlay) return;
    addCategoryOverlay.classList.remove('is-open');
    addCategoryOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (addCategoryLink) {
    addCategoryLink.addEventListener('click', function(e) {
      e.preventDefault();
      openAddCategoryModal();
    });
  }
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.closest && e.target.closest('a.add-category')) {
      e.preventDefault();
      openAddCategoryModal();
    }
  });
  if (addCategoryOverlay) {
    addCategoryOverlay.addEventListener('click', function(e) {
      if (e.target === addCategoryOverlay) closeAddCategoryModal();
    });
  }
  if (addCategoryCancel) addCategoryCancel.addEventListener('click', closeAddCategoryModal);

  if (outfitGrid) {
    outfitGrid.querySelectorAll('.outfit-option').forEach(function(btn) {
      btn.addEventListener('click', function() {
        outfitGrid.querySelectorAll('.outfit-option').forEach(function(b) {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('selected');
        this.setAttribute('aria-pressed', 'true');
      });
    });
  }

  var addCategoryForm = document.getElementById('addCategoryForm');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('newCategoryName') && document.getElementById('newCategoryName').value.trim();
      var amount = document.getElementById('newCategoryAmount') && document.getElementById('newCategoryAmount').value;
      var selected = outfitGrid && outfitGrid.querySelector('.outfit-option.selected');
      var outfit = selected ? selected.getAttribute('data-outfit') : '';
      closeAddCategoryModal();
    });
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get('add') === '1') { openAdd(); history.replaceState({}, '', window.location.pathname); }
  if (params.get('scan') === '1') {
    var so = document.getElementById('scanOverlay');
    if (so) { so.classList.add('is-open'); so.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
    history.replaceState({}, '', window.location.pathname);
  }

  if (chip && categoriesScroll) {
    var cards = categoriesScroll.querySelectorAll('.add-category-card');
    var dragStartX, dragStartY, chipStartLeft, chipStartTop;

    function getClientXY(e) {
      if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }
    function cardAt(x, y) {
      var found = null;
      cards.forEach(function(card) {
        var r = card.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) found = card;
      });
      return found;
    }
    function finishDrag(clientX, clientY) {
      chip.classList.remove('dragging');
      chip.style.position = '';
      chip.style.left = '';
      chip.style.top = '';
      chip.style.margin = '';
      chip.style.zIndex = '';
      var found = cardAt(clientX, clientY);
      clearDropState();
      if (found) {
        var label = found.getAttribute('data-label') || found.getAttribute('data-category');
        showCelebration(label, function() { closeAdd(); });
      }
    }

    chip.addEventListener('mousedown', function(e) {
      if (e.button !== 0) return;
      e.preventDefault();
      var rect = chip.getBoundingClientRect();
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      chipStartLeft = rect.left;
      chipStartTop = rect.top;
      chip.classList.add('dragging');
      chip.style.position = 'fixed';
      chip.style.left = rect.left + 'px';
      chip.style.top = rect.top + 'px';
      chip.style.margin = '0';
      chip.style.zIndex = '100';
      setDropTarget(null);
    });
    chip.addEventListener('touchstart', function(e) {
      if (e.touches.length !== 1) return;
      var rect = chip.getBoundingClientRect();
      var t = e.touches[0];
      dragStartX = t.clientX;
      dragStartY = t.clientY;
      chipStartLeft = rect.left;
      chipStartTop = rect.top;
      chip.classList.add('dragging');
      chip.style.position = 'fixed';
      chip.style.left = rect.left + 'px';
      chip.style.top = rect.top + 'px';
      chip.style.margin = '0';
      chip.style.zIndex = '100';
      setDropTarget(null);
    }, { passive: true });

    document.addEventListener('mousemove', function(e) {
      if (!chip.classList.contains('dragging')) return;
      var dx = e.clientX - dragStartX;
      var dy = e.clientY - dragStartY;
      chip.style.left = (chipStartLeft + dx) + 'px';
      chip.style.top = (chipStartTop + dy) + 'px';
      setDropTarget(cardAt(e.clientX, e.clientY));
    });
    document.addEventListener('touchmove', function(e) {
      if (!chip.classList.contains('dragging') || e.touches.length !== 1) return;
      e.preventDefault();
      var t = e.touches[0];
      var dx = t.clientX - dragStartX;
      var dy = t.clientY - dragStartY;
      chip.style.left = (chipStartLeft + dx) + 'px';
      chip.style.top = (chipStartTop + dy) + 'px';
      setDropTarget(cardAt(t.clientX, t.clientY));
    }, { passive: false });

    document.addEventListener('mouseup', function(e) {
      if (!chip.classList.contains('dragging')) return;
      finishDrag(e.clientX, e.clientY);
    });
    document.addEventListener('touchend', function(e) {
      if (!chip.classList.contains('dragging')) return;
      var x = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0;
      var y = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0;
      finishDrag(x, y);
    }, { passive: true });
  }

  function showCelebration(categoryLabel, done) {
    var t = document.getElementById('addCelebrationText');
    if (t) t.textContent = categoryLabel ? 'Added to ' + categoryLabel + '!' : 'Added!';
    if (!celebration || !particlesEl) {
      if (done) setTimeout(done, 400);
      return;
    }
    celebration.classList.add('is-active');
    var count = 12;
    particlesEl.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var angle = (i / count) * Math.PI * 2;
      var dist = 80 + Math.random() * 40;
      var bx = Math.cos(angle) * dist;
      var by = Math.sin(angle) * dist;
      var s = document.createElement('span');
      s.style.setProperty('--bx', bx + 'px');
      s.style.setProperty('--by', by + 'px');
      s.style.animationDelay = (i * 0.02) + 's';
      particlesEl.appendChild(s);
    }
    setTimeout(function() {
      celebration.classList.remove('is-active');
      if (typeof done === 'function') done();
    }, 800);
  }

  var scanOverlay = document.getElementById('scanOverlay');
  var scanBtn = document.getElementById('scanBtn');
  var scanClose = document.getElementById('scanClose');
  var scanFileInput = document.getElementById('scanFileInput');
  var scanCaptureBtn = document.getElementById('scanCaptureBtn');
  var scanFrame = document.getElementById('scanFrame');
  var scanErrorMsg = document.getElementById('scanErrorMsg');
  var scanView = document.getElementById('scanView');
  var scanRecordView = document.getElementById('scanRecordView');
  var scanRecordImg = document.getElementById('scanRecordImg');
  var scanAmount = document.getElementById('scanAmount');
  var scanCategory = document.getElementById('scanCategory');
  var scanRecordBtn = document.getElementById('scanRecordBtn');

  if (scanBtn) scanBtn.addEventListener('click', function() {
    if (scanOverlay) {
      scanOverlay.classList.add('is-open');
      scanOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      scanView.style.display = '';
      scanRecordView.style.display = 'none';
      scanFrame.classList.remove('has-image');
      scanFrame.querySelector('.scan-frame-placeholder').style.display = '';
      if (scanFrame.querySelector('img')) scanFrame.querySelector('img').remove();
      scanErrorMsg.style.display = 'none';
      scanFileInput.value = '';
    }
  });
  if (scanClose) scanClose.addEventListener('click', function() {
    if (scanOverlay) {
      scanOverlay.classList.remove('is-open');
      scanOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
  if (scanCaptureBtn) scanCaptureBtn.addEventListener('click', function() { scanFileInput.click(); });
  if (scanFileInput) scanFileInput.addEventListener('change', function() {
    var file = this.files && this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      scanErrorMsg.style.display = 'none';
      var placeholder = scanFrame.querySelector('.scan-frame-placeholder');
      if (placeholder) placeholder.style.display = 'none';
      var img = scanFrame.querySelector('img');
      if (img) img.remove();
      img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Scanned';
      scanFrame.appendChild(img);
      scanFrame.classList.add('has-image');
      scanRecordImg.src = e.target.result;
      scanView.style.display = 'none';
      scanRecordView.style.display = '';
    };
    reader.readAsDataURL(file);
  });
  if (scanRecordBtn) scanRecordBtn.addEventListener('click', function() {
    if (scanOverlay) {
      scanOverlay.classList.remove('is-open');
      scanOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    var cat = scanCategory && scanCategory.value ? scanCategory.value : 'Groceries';
    var celebText = document.getElementById('addCelebrationText');
    if (celebration && celebText) {
      celebText.textContent = 'Added to ' + cat + '!';
      celebration.classList.add('is-active');
      setTimeout(function() { celebration.classList.remove('is-active'); }, 800);
    }
  });
})();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBudgetPage);
} else {
  initBudgetPage();
}
