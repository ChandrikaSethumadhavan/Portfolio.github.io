// Interactive Resume - JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loader = document.getElementById('loader');
  const gameWorld = document.getElementById('gameWorld');
  const sectionsTrack = document.getElementById('sectionsTrack');
  const character = document.getElementById('character');
  const progressFill = document.getElementById('progressFill');
  const sectionNav = document.getElementById('sectionNav');
  const scrollHint = document.getElementById('scrollHint');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const sectionDots = document.querySelectorAll('.section-dot');
  const sections = document.querySelectorAll('.game-section');

  // State
  let currentScroll = 0;
  let targetScroll = 0;
  let isScrolling = false;
  let lastScrollTime = Date.now();

  // Hide loader after animation
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2500);

  // Calculate total scrollable width
  const getTotalWidth = () => {
    return sectionsTrack.scrollWidth - window.innerWidth;
  };

  // Update progress bar
  const updateProgress = () => {
    const progress = (currentScroll / getTotalWidth()) * 100;
    progressFill.style.width = `${Math.min(progress, 100)}%`;
  };

  // Update active section
  const updateActiveSection = () => {
    const sectionWidth = window.innerWidth;
    const currentSectionIndex = Math.round(currentScroll / sectionWidth);

    sectionDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSectionIndex);
    });
  };

  // Parallax effect
  const updateParallax = () => {
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed) || 0.5;
      const offset = currentScroll * speed;
      layer.style.transform = `translateX(${-offset}px)`;
    });
  };

  // Character animation
  const updateCharacter = () => {
    const now = Date.now();
    const timeSinceScroll = now - lastScrollTime;

    if (timeSinceScroll < 150) {
      character.classList.add('walking');
    } else {
      character.classList.remove('walking');
    }
  };

  // Smooth scroll animation
  const smoothScroll = () => {
    const diff = targetScroll - currentScroll;

    if (Math.abs(diff) > 0.5) {
      currentScroll += diff * 0.1;
      sectionsTrack.style.transform = `translateX(${-currentScroll}px)`;

      updateParallax();
      updateProgress();
      updateActiveSection();
      updateCharacter();

      requestAnimationFrame(smoothScroll);
    } else {
      currentScroll = targetScroll;
      isScrolling = false;
    }
  };

  // Handle wheel scroll
  const handleWheel = (e) => {
    // If the wheel event originated inside a scrollable inner panel that can
    // still scroll in the wheel direction, let the browser handle it natively.
    const scrollable = e.target.closest('.projects .section-content');
    if (scrollable) {
      const delta = e.deltaY;
      const atTop = scrollable.scrollTop <= 0;
      const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
      if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
        return;
      }
    }

    e.preventDefault();

    lastScrollTime = Date.now();

    // Convert vertical scroll to horizontal
    const delta = e.deltaY || e.deltaX;
    targetScroll += delta;

    // Clamp scroll position
    targetScroll = Math.max(0, Math.min(targetScroll, getTotalWidth()));


    if (!isScrolling) {
      isScrolling = true;
      smoothScroll();
    }
  };

  // Handle touch scroll
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
      lastScrollTime = Date.now();

      targetScroll += diffX * 2;
      targetScroll = Math.max(0, Math.min(targetScroll, getTotalWidth()));

      if (!isScrolling) {
        isScrolling = true;
        smoothScroll();
      }

      touchStartX = touchEndX;
    }
  };

  const handleTouchEnd = () => {
    touchStartX = 0;
    touchStartY = 0;
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const scrollAmount = window.innerWidth * 0.5;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        targetScroll += scrollAmount;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        targetScroll -= scrollAmount;
        break;
      case 'Home':
        targetScroll = 0;
        break;
      case 'End':
        targetScroll = getTotalWidth();
        break;
      default:
        return;
    }

    e.preventDefault();
    lastScrollTime = Date.now();
    targetScroll = Math.max(0, Math.min(targetScroll, getTotalWidth()));

    if (!isScrolling) {
      isScrolling = true;
      smoothScroll();
    }
  };

  // Section navigation click
  sectionDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      targetScroll = index * window.innerWidth;
      lastScrollTime = Date.now();

      if (!isScrolling) {
        isScrolling = true;
        smoothScroll();
      }
    });
  });

  // Animate skill towers on scroll
  const animateSkillTowers = () => {
    const skillSection = document.getElementById('skills');
    const skillRect = skillSection.getBoundingClientRect();

    if (skillRect.left < window.innerWidth && skillRect.right > 0) {
      const towers = skillSection.querySelectorAll('.tower-fill');
      towers.forEach(tower => {
        tower.style.width = tower.style.getPropertyValue('--fill');
      });
    }
  };

  // Intersection observer for animations
  const observeAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  };

  // Event listeners
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('keydown', handleKeyDown);

  // Handle window resize
  window.addEventListener('resize', () => {
    targetScroll = Math.min(targetScroll, getTotalWidth());
    if (!isScrolling) {
      currentScroll = targetScroll;
      sectionsTrack.style.transform = `translateX(${-currentScroll}px)`;
      updateParallax();
      updateProgress();
      updateActiveSection();
    }
  });

  // Initialize
  observeAnimations();

  // Animate elements periodically
  setInterval(() => {
    animateSkillTowers();
  }, 500);

  // Add floating animation delays to elements
  document.querySelectorAll('.float-icon').forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.5}s`;
  });

  // Add stagger to building windows
  document.querySelectorAll('.building-window').forEach((window, index) => {
    window.style.setProperty('--i', index);
  });

  // Easter egg: Konami code
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        // Easter egg triggered!
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 5000);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Add rainbow animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // === PROJECT MODAL FUNCTIONALITY ===
  console.log('Setting up project modal...');

  const projectData = {
    surgidoc: {
      title: 'SurgiDoc AI — Agentic GenAI Documentation',
      badge: 'Black Forest Hackathon 2025 (SxH track)',
      description: 'A full agentic AI workflow for automated surgical report generation. Vision Transformer (EndoViT) analyses surgeon-selected frames, a RAG pipeline grounds the context against a medical knowledge base, and an OpenAI LLM produces structured clinical documentation. Shipped end-to-end in 48 hours.',
      tech: ['PyTorch', 'EndoViT (ViT)', 'RAG', 'OpenAI API', 'Python REST API', 'React', 'TypeScript', 'TailwindCSS'],
      highlights: [
        'Full agentic workflow: image analysis → RAG retrieval → LLM report generation',
        'AI quality filtering automatically removes blurry/dark frames',
        'Tablet-optimised swipe interface for surgeon-driven curation',
        'Responsible AI via RAG grounding and structured output validation',
        'Team delivery within 48-hour hackathon window'
      ],
      github: 'https://github.com/ChandrikaSethumadhavan/BFH-SxH',
      video: 'videos/surgidoc-demo.mp4'
    },
    mealsormiles: {
      title: 'Meals or Miles — Recipe Carbon Analyzer',
      badge: 'Black Forest Hackathon 2025 (Offenburg)',
      description: 'A recipe analysis tool that calculates per-meal carbon emissions and suggests sustainable ingredient replacements using vector embeddings for multi-language matching, while preserving nutritional balance.',
      tech: ['Python', 'Flask', 'Vector Embeddings', 'Multi-objective Optimization', 'Nutritional DB'],
      highlights: [
        'Real-time CO₂ footprint calculation per recipe',
        'Identifies key emitters (>15% of total carbon) and replaces them',
        'Multi-objective optimisation preserves protein, carbs and fat',
        'Multilingual ingredient matching via vector embeddings',
        'Flask backend, zero external API calls, minimal compute overhead'
      ],
      github: 'https://github.com/ChandrikaSethumadhavan/meal-emission-tracker',
      video: 'videos/meals-or-miles-demo.mp4'
    },
    automl: {
      title: 'Carbon-Aware AutoML — Zero-Cost Proxy NAS',
      badge: 'Coursework / AutoML',
      description: 'Resource-aware AutoML pipeline combining zero-cost proxy NAS and carbon-aware hyperparameter search for efficient neural-network model selection on vision datasets.',
      tech: ['Python', 'PyTorch', 'TorchVision', 'Optuna', 'CodeCarbon', 'AutoML'],
      highlights: [
        'Zero-cost proxies for efficient architecture ranking',
        'Optuna HPO with CodeCarbon emissions tracking',
        '86.26% accuracy / 0.796 F1 on skin-cancer classification',
        'Evaluated across 5 datasets (flowers, emotions, fashion, skin cancer) — 64.6% to 97.0% accuracy'
      ],
      github: 'https://github.com/ChandrikaSethumadhavan/Adaptive-and-Efficient-Model-Selection-using-Zero-Cost-and-Resource-Aware-Techniques-'
    },
    onnx: {
      title: 'Deployment-Aware AutoML — ONNX Inference Optimisation',
      badge: 'Coursework Extension / Edge ML',
      description: 'Extended the AutoML pipeline with a deployment stage: automatic ONNX export, dynamic INT8 quantisation, and structured multi-backend inference benchmarking across PyTorch CPU, ORT CPU and ORT CUDA.',
      tech: ['PyTorch', 'ONNX', 'ONNX Runtime', 'INT8 Quantisation', 'CUDA'],
      highlights: [
        '1.87× CPU and 8.54× GPU speedup with no accuracy loss',
        '74.8% model-size reduction (54.71 MB → 13.78 MB) via INT8 quantisation',
        'Multi-backend benchmarking (PyTorch CPU, ORT CPU, ORT CUDA)',
        'Operator fusion and memory-layout optimisations for edge deployment'
      ],
      github: 'https://github.com/ChandrikaSethumadhavan/Adaptive-and-Efficient-Model-Selection-using-Zero-Cost-and-Resource-Aware-Techniques-'
    },
    msp430: {
      title: 'MSP430 Microcontroller Programming',
      badge: 'Embedded C',
      description: 'Embedded systems projects on the MSP430: bare-metal C covering peripherals, timing, and fault recovery for real-time operation.',
      tech: ['Embedded C', 'MSP430', 'Keil uVision', 'ADC', 'Interrupts'],
      highlights: [
        'LED toggling, shift registers, ADCs, interrupt handling, timer configuration',
        'Watchdog Timer (WDT) for deadlock recovery and system reset',
        'Task management via preprocessor directives for real-time scheduling'
      ],
      github: 'https://github.com/ChandrikaSethumadhavan/MSP430-Microcontroller-projects'
    },
    prediflex: {
      title: 'Prediflex Smart Insole — Microsystems Design',
      badge: 'Microsystems Design Lab',
      description: 'Virtual design and analytical modelling of an energy-harvesting microcontroller system powered by passive piezoelectric sensors that convert biomechanical energy into usable electrical power for real-time pediatric gait analysis.',
      tech: ['ESP32', 'Piezoelectric Harvesting', 'PCB Design', 'Low-Power Embedded'],
      highlights: [
        'Passive piezo harvesting powers MCU + wireless module',
        'Ultra-low-power architecture conforming to international standards',
        'Real-time pediatric gait analysis with predictive abnormality assessment',
        'Sustainable materials and seamless integration into footwear'
      ],
      github: 'https://github.com/ChandrikaSethumadhavan/Microsystems_Design_Prediflex'
    }
  };

  // Modal elements
  const projectModal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDescription = document.getElementById('modalDescription');
  const modalTech = document.getElementById('modalTech');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalGithub = document.getElementById('modalGithub');
  const modalVideoSection = document.getElementById('modalVideoSection');
  const modalVideo = document.getElementById('modalVideo');
  const modalVideoSource = document.getElementById('modalVideoSource');

  console.log('Modal element found:', projectModal);

  if (projectModal) {
    const modalOverlay = projectModal.querySelector('.modal-overlay');

    // Open modal function
    const openModal = (projectId) => {
      console.log('Opening modal for:', projectId);
      const project = projectData[projectId];
      if (!project) {
        console.log('Project not found:', projectId);
        return;
      }

      modalTitle.textContent = project.title;
      modalBadge.textContent = project.badge;
      modalDescription.textContent = project.description;

      // Populate tech tags
      modalTech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join('');

      // Populate highlights
      modalHighlights.innerHTML = project.highlights.map(h => `<li>${h}</li>`).join('');

      // Set GitHub link
      modalGithub.href = project.github;

      // Handle video
      if (project.video && modalVideoSection && modalVideoSource) {
        modalVideoSource.src = project.video;
        modalVideo.load();
        modalVideoSection.style.display = 'block';
      } else if (modalVideoSection) {
        modalVideoSection.style.display = 'none';
      }

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Modal opened');
    };

    // Close modal function
    const closeModal = () => {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
      // Pause video when closing modal
      if (modalVideo) {
        modalVideo.pause();
      }
    };

    // Add click listeners to project cards
    const projectCards = document.querySelectorAll('.project-card');
    console.log('Found project cards:', projectCards.length);

    projectCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const projectId = this.getAttribute('data-project');
        openModal(projectId);
      });
    });

    // Close modal events
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
      }
    });
  } else {
    console.error('Project modal not found!');
  }

  console.log('%c Welcome to Chandrika\'s Interactive Resume! ', 'background: linear-gradient(135deg, #0099e5, #a855f7); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
  console.log('%c Use scroll, arrow keys, or click the navigation dots to explore! ', 'color: #a855f7; font-size: 12px;');
  console.log('%c Click on any project card to see details! ', 'color: #00d4ff; font-size: 12px;');
});
