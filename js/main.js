// Navigation active state on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Portfolio filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category') || '';

      if (filter === 'all' || category.includes(filter)) {
        item.style.display = 'block';
        item.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translate(0, 0) scale(1)';
    }
  });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
  observer.observe(item);
});

// Observe skill cards
document.querySelectorAll('.skill-card').forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px) scale(0.95)';
  item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
  observer.observe(item);
});

// Observe contact items
document.querySelectorAll('.contact-item').forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px) scale(1)';
  item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
  observer.observe(item);
});
