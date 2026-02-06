/**
 * vaemptîness Corporate Landing Page JavaScript
 * Vanilla JS implementation for interactions
 */

(function() {
  'use strict';

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Don't prevent default for href="#" or empty
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Scroll animations using Intersection Observer
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animate-fade-up class
    document.querySelectorAll('.animate-fade-up').forEach(el => {
      observer.observe(el);
    });
  }

  // Form submission handling
  function initFormHandling() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;

      // Show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<svg class="w-5 h-5 animate-spin inline-block" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Enviando...';

      try {
        const formData = new FormData(form);

        // If using Formspree or similar service
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Show success message
          showSuccessMessage();
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage();
      } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }

  // Show success message
  function showSuccessMessage() {
    const formContainer = document.querySelector('#contact-form').parentElement;
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.';
    formContainer.insertBefore(successMessage, formContainer.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }

  // Show error message
  function showErrorMessage() {
    const formContainer = document.querySelector('#contact-form').parentElement;
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-success'; // Reuse same styling but with different colors
    errorMessage.style.backgroundColor = 'hsl(0 84% 60% / 0.1)';
    errorMessage.style.color = 'hsl(0 84% 60%)';
    errorMessage.textContent = 'Hubo un error al enviar el formulario. Por favor, intenta nuevamente o contáctanos directamente.';
    formContainer.insertBefore(errorMessage, formContainer.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }

  // Form validation helper
  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });

    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
      }
    }

    return isValid;
  }

  // Initialize all functionality when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initSmoothScroll();
    initScrollAnimations();
    initFormHandling();
  }

})();
