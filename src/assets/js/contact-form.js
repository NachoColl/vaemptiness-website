// Contact form submission

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    const formData = new FormData(form);

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Clear previous status
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        if (formStatus) {
          formStatus.textContent = '¡Mensaje enviado correctamente! Te responderemos pronto.';
          formStatus.classList.add('success');
        }
        form.reset();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
          }
        }, 5000);
      } else {
        // Error response from server
        if (formStatus) {
          formStatus.textContent = 'Error al enviar el mensaje. Por favor, intenta de nuevo.';
          formStatus.classList.add('error');
        }
      }
    } catch (error) {
      // Network error
      if (formStatus) {
        formStatus.textContent = 'Error al enviar el mensaje. Por favor, intenta de nuevo.';
        formStatus.classList.add('error');
      }
    } finally {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
});
