// ============================================================================
// VANTAGE INFRA — Luxury Site Architecture & Interactive Plaster Simulator Engine
// ============================================================================

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initGlobalUtilities();
  initMobileNavigation();
  initDynamicCycleEngines();
  initInteractiveMaterialPhysics();
  initPremiumScrollObserver();
  initLimeSimulatorEngine();
});

function initGlobalUtilities() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initMobileNavigation() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function buildMaterialCycleSVG(stages, options = {}) {
  const { showLabels = false, centerLabel = '' } = options;
  const size = showLabels ? 240 : 200;
  const cx = size / 2, cy = size / 2;
  const r = showLabels ? 62 : 78;
  const labelOffset = showLabels ? 30 : 0;

  const angles = [-90, 0, 90, 180]; 
  const nodes = angles.map((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
      dx: Math.cos(rad),
      dy: Math.sin(rad),
      label: stages[i]
    };
  });

  const nodeCircles = nodes.map(n => 
    `<circle class="cycle-node" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="4.2"></circle>`
  ).join('');

  let labels = '';
  if (showLabels) {
    labels = nodes.map(n => {
      const lx = cx + n.dx * (r + labelOffset);
      const ly = cy + n.dy * (r + labelOffset);
      return `<text class="cycle-node-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${n.label}</text>`;
    }).join('');
  }

  const center = centerLabel 
    ? `<text class="cycle-center-label" x="${cx}" y="${cy + 5}" text-anchor="middle">${centerLabel}</text>`
    : '';

  return `
    <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle class="cycle-ring" cx="${cx}" cy="${cy}" r="${r}"></circle>
      ${nodeCircles}
      ${labels}
      ${center}
    </svg>
  `;
}

function initDynamicCycleEngines() {
  const WATER_STAGES = ['Evaporation', 'Condensation', 'Precipitation', 'Collection'];
  const LIME_STAGES = ['Limestone', 'Quicklime', 'Slaked lime', 'Carbonation'];

  const cycleMark = document.getElementById('cycleMark');
  const dividerMark = document.getElementById('dividerMark');
  const dividerText = document.getElementById('dividerText');
  const cycleDivider = document.getElementById('cycleDivider');

  if (cycleMark) cycleMark.innerHTML = buildMaterialCycleSVG(WATER_STAGES, { showLabels: true });
  if (dividerMark) dividerMark.innerHTML = buildMaterialCycleSVG(WATER_STAGES, { showLabels: false });

  const WATER_PHRASE = 'A cycle managed, not fought';
  const LIME_PHRASE = 'A cycle that builds the wall itself';
  let dividerFlipped = false;
  let ticking = false;

  function updateDivider() {
    if (!cycleDivider || !dividerMark || !dividerText) return;
    const rect = cycleDivider.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    const shouldFlip = rect.top < mid && rect.bottom > 0;

    if (shouldFlip !== dividerFlipped) {
      dividerFlipped = shouldFlip;
      cycleDivider.classList.toggle('is-flipped', dividerFlipped);
      dividerMark.classList.toggle('is-lime', dividerFlipped);

      dividerText.classList.add('is-fading');
      setTimeout(() => {
        dividerText.textContent = dividerFlipped ? LIME_PHRASE : WATER_PHRASE;
        dividerText.classList.remove('is-fading');
      }, 300);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateDivider);
      ticking = true;
    }
  }, { passive: true });
}

function initInteractiveMaterialPhysics() {
  const cards = document.querySelectorAll('.service-card, .finish-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initPremiumScrollObserver() {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));
}

/**
 * 7. THE INTERACTIVE LIME FORMULATION SIMULATOR ENGINE
 * Drives sequential mechanical layer rendering and atomic crystal stabilization arrays[cite: 4]
 */
function initLimeSimulatorEngine() {
  const deck = document.getElementById('limeSimulationDeck');
  if (!deck) return;

  const tabs = deck.querySelectorAll('.sim-tab-btn');
  const nodes = deck.querySelectorAll('.sim-step-node');
  const actionBtn = document.getElementById('btnTriggerAction');
  const readout = document.getElementById('canvasReadout');
  const canvas = document.getElementById('carbonationCanvas');
  const ctx = canvas.getContext('2d');

  let currentFinish = 'araish';
  let activeStep = 1;
  let particles = [];
  let animationId = null;
  let crystallizationProgress = 0;
  let activeMode = 'CO2'; // Mode alternates between CO2 and H2O

  // Formulations Matrix Map
  const formulaData = {
    araish: {
      title: "Araish Formulation",
      steps: [
        "Coarse structural slaked lime base with screened sharp sand parameters.",
        "Intermediate level leveling matrix engineered to distribute structural stresses.",
        "Micro-filtered marble-dust lime burnished layer absorbing room CO₂ molecules."
      ],
      actionText: "Inject CO₂ Molecules",
      successText: "Crystallization Matrix Complete: Calcium Carbonate Stable"
    },
    tadelakt: {
      title: "Tadelakt Formulation",
      steps: [
        "Dense hydraulic base mix laid to form a compression-resistant shell.",
        "Mechanically compacted leveling lime layer built using traditional wooden float tooling.",
        "Burnished surface treated with olive soap solution to initiate waterproof sealing."
      ],
      actionText: "Simulate Monsoon Downpour",
      successText: "Hydrophobic Hydrostatic Tension Peak: Moisture Barrier Active"
    },
    marmorino: {
      title: "Marmorino Formulation",
      steps: [
        "Medium-grain natural river sand backing map ensuring maximum adhesion properties.",
        "Coarse marble aggregate layout layer optimizing light refraction depth indexes.",
        "Fine mineral compound paste troweled flush to develop classic satin veining patterns."
      ],
      actionText: "Apply Gallery Accent Light",
      successText: "Mineral Micro-Refraction Peak: Refractive Pattern Locked"
    }
  };

  function updateInterface() {
    const data = formulaData[currentFinish];
    deck.querySelector('.sim-title').textContent = data.title;
    actionBtn.textContent = data.actionText;
    readout.textContent = "Status: Analytical Model Calibrated";
    
    document.getElementById('step-desc-1').textContent = data.steps[0];
    document.getElementById('step-desc-2').textContent = data.steps[1];
    document.getElementById('step-desc-3').textContent = data.steps[2];

    activeStep = 1;
    crystallizationProgress = 0;
    triggerStepSequence();
  }

  function triggerStepSequence() {
    nodes.forEach((node, i) => {
      node.classList.toggle('active', (i + 1) === activeStep);
    });

    document.getElementById('vizLayer1').classList.toggle('active', activeStep >= 1);
    document.getElementById('vizLayer2').classList.toggle('active', activeStep >= 2);
    document.getElementById('vizLayer3').classList.toggle('active', activeStep >= 3);

    if (activeStep < 3) {
      setTimeout(() => {
        activeStep++;
        triggerStepSequence();
      }, 1500);
    } else {
      initSimulationVisuals();
    }
  }

  // Pure Procedural Molecular Particle Canvas System Loops
  function initSimulationVisuals() {
    particles = [];
    crystallizationProgress = 0;
    cancelAnimationFrame(animationId);

    const count = currentFinish === 'tadelakt' ? 60 : 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -40,
        r: Math.random() * 2.5 + 1.5,
        speed: Math.random() * 1.2 + 0.8,
        opacity: Math.random() * 0.6 + 0.4,
        crystallized: false
      });
    }
    runSimulationLoop();
  }

  function runSimulationLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allLocked = true;

    particles.forEach(p => {
      if (!p.crystallized) {
        p.y += p.speed;
        if (p.y > canvas.height - 35) {
          p.crystallized = true;
        }
        allLocked = false;
      } else {
        p.opacity = Math.min(1, p.opacity + 0.02);
      }

      ctx.beginPath();
      if (currentFinish === 'araish') {
        ctx.arc(p.x, p.y, p.crystallized ? p.r * 1.4 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.crystallized ? `rgba(187, 107, 58, ${p.opacity})` : `rgba(110, 100, 87, ${p.opacity})`;
      } else if (currentFinish === 'tadelakt') {
        // Draw fluid rain streams cascading vertically
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + 8);
        ctx.strokeStyle = p.crystallized ? `rgba(76, 107, 110, 0.1)` : `rgba(76, 107, 110, ${p.opacity})`;
        ctx.stroke();
      } else {
        // Render geometric crystalline structures reflecting light
        ctx.rect(p.x, p.y, p.r * 2, p.r * 2);
        ctx.fillStyle = p.crystallized ? `rgba(220, 208, 184, ${p.opacity})` : `rgba(42, 37, 32, 0.2)`;
      }
      if (currentFinish !== 'tadelakt') ctx.fill();
    });

    if (allLocked && crystallizationProgress > 0) {
      readout.textContent = formulaData[currentFinish].successText;
      actionBtn.removeAttribute('disabled');
    } else {
      animationId = requestAnimationFrame(runSimulationLoop);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFinish = tab.dataset.finish;
      updateInterface();
    });
  });

  actionBtn.addEventListener('click', () => {
    actionBtn.setAttribute('disabled', 'true');
    readout.textContent = "Status: Simulating Atmospheric Phase Reaction...";
    crystallizationProgress = 1;
    initSimulationVisuals();
  });

  // Self-start configuration array loop
  updateInterface();
}