// vaemptîness - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Prevent default behavior on dropdown toggles (must be before other handlers)
    const dropdownToggles = mainNav.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      toggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
    });

    // Close menu when clicking a link (but not dropdown toggles)
    const navLinks = mainNav.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Small delay for dropdown items to allow navigation
        if (link.closest('.dropdown-menu')) {
          setTimeout(() => {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
          }, 100);
        } else {
          mainNav.classList.remove('active');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Scroll indicator smooth scroll
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollBy({
        top: window.innerHeight - 100,
        behavior: 'smooth'
      });
    });

    // Fade scroll indicator on scroll
    window.addEventListener('scroll', () => {
      const scrollDistance = window.scrollY;
      const fadeStart = 50;
      const fadeEnd = 300;

      if (scrollDistance <= fadeStart) {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      } else if (scrollDistance >= fadeEnd) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        // Gradual fade between fadeStart and fadeEnd
        const fadeProgress = (scrollDistance - fadeStart) / (fadeEnd - fadeStart);
        scrollIndicator.style.opacity = (1 - fadeProgress).toString();
        scrollIndicator.style.pointerEvents = fadeProgress > 0.5 ? 'none' : 'auto';
      }
    });
  }

  // Fade-in animations on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-in, [data-aos="fade-up"]');
  fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Smooth scroll for anchor links (exclude dropdown toggles)
  document.querySelectorAll('a[href^="#"]:not(.dropdown-toggle)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Testimonials Carousel
  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    const track = carousel.querySelector('.testimonials-track');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
      // Move track
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
      });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped left
          currentSlide = (currentSlide + 1) % totalSlides;
        } else {
          // Swiped right
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        updateCarousel();
      }
    }
  }

  // Expandable detail toggle
  const expandableToggles = document.querySelectorAll('.expandable-toggle');
  expandableToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const content = toggle.nextElementSibling;
      const toggleText = toggle.querySelector('.toggle-text');

      toggle.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        content.setAttribute('hidden', '');
        if (toggleText) toggleText.textContent = 'ampliar';
      } else {
        content.removeAttribute('hidden');
        if (toggleText) toggleText.textContent = 'reducir';
      }
    });
  });
});

// Blog Filters
const filterLinks = document.querySelectorAll('.filter-link');

if (filterLinks.length > 0) {
  const postCards = document.querySelectorAll('.post-card');
  const noResults = document.getElementById('no-results');
  const monthsRow = document.querySelector('.filter-row-months');

  let selectedYear = '';
  let selectedMonth = '';

  function filterPosts() {
    let visibleCount = 0;

    postCards.forEach(card => {
      const postDate = card.getAttribute('data-date');

      if (!postDate) {
        card.classList.add('hidden');
        return;
      }

      const [year, month] = postDate.split('-');
      let showCard = true;

      // Filter by year
      if (selectedYear && year !== selectedYear) {
        showCard = false;
      }

      // Filter by month
      if (selectedMonth && month !== selectedMonth) {
        showCard = false;
      }

      if (showCard) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }

  // Add event listeners to filter links
  filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const filterType = link.getAttribute('data-filter-type');
      const filterValue = link.getAttribute('data-filter-value');

      // Handle "all" filter - clear all filters
      if (filterType === 'all') {
        selectedYear = '';
        selectedMonth = '';

        // Hide months row
        if (monthsRow) {
          monthsRow.style.display = 'none';
        }

        // Remove active from all filter links
        filterLinks.forEach(l => l.classList.remove('active'));

        // Add active only to "Todos"
        link.classList.add('active');
      } else {
        // Remove active class from siblings in same row
        const siblings = link.parentElement.querySelectorAll('.filter-link');
        siblings.forEach(sibling => sibling.classList.remove('active'));

        // Remove active from "Todos" link
        const todosLink = document.querySelector('.filter-all');
        if (todosLink) {
          todosLink.classList.remove('active');
        }

        // Add active class to clicked link
        link.classList.add('active');

        // Update selected filters
        if (filterType === 'year') {
          selectedYear = filterValue;
          selectedMonth = ''; // Clear month selection when year changes

          // Show months row
          if (monthsRow) {
            monthsRow.style.display = 'flex';
          }

          // Remove active from all month links
          const monthLinks = monthsRow ? monthsRow.querySelectorAll('.filter-link') : [];
          monthLinks.forEach(ml => ml.classList.remove('active'));
        } else if (filterType === 'month') {
          selectedMonth = filterValue;
        }
      }

      // Apply filters
      filterPosts();
    });
  });
}
