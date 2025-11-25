'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('#register-dialog');
  const openButton = document.querySelector('[data-open-register]');
  const closeButton = dialog.querySelector('[data-close-dialog]');
  const content = dialog.querySelector('.dialog__content');

  const form = dialog.querySelector('#register-form');
  const fields = [...form.querySelectorAll('input[required]')];

  const passwordInput = dialog.querySelector('#password');
  const togglePassword = dialog.querySelector('[data-toggle-password]');

  // ===== Helpers =====

  function getErrorBlock(field) {
    return document.getElementById(field.getAttribute('aria-describedby'));
  }

  function buildMessage(field) {
    const v = field.validity;

    if (v.valueMissing) return 'Это обязательное поле.';
    if (v.tooShort) return `Минимум ${field.getAttribute('minlength')} символов.`;
    if (v.typeMismatch && field.type === 'email')
      return 'Введите корректный email.';
    return 'Некорректное значение.';
  }

  function showError(field) {
    const block = getErrorBlock(field);
    block.textContent = buildMessage(field);
    block.hidden = false;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    const block = getErrorBlock(field);
    block.textContent = '';
    block.hidden = true;
    field.removeAttribute('aria-invalid');
  }

  function validate(field) {
    if (field.checkValidity()) {
      clearError(field);
      return true;
    }
    showError(field);
    return false;
  }

  // ===== Dialog Open/Close =====

  openButton.addEventListener('click', (e) => {
    e.preventDefault();
    dialog.showModal();
  });

  closeButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  content.addEventListener('click', (e) => e.stopPropagation());

  // ===== Validate on blur =====

  fields.forEach((f) =>
    f.addEventListener('blur', () => validate(f))
  );

  // ===== Submit =====

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;
    let firstBad = null;

    fields.forEach((f) => {
      if (!validate(f)) {
        ok = false;
        if (!firstBad) firstBad = f;
      }
    });

    if (!ok) {
      firstBad.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    console.log('Form data:', data);

    form.reset();
    fields.forEach(clearError);
    dialog.close();
  });

  // ===== Show password while holding button =====

  togglePassword.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    passwordInput.type = 'text';
  });

  function hide() {
    passwordInput.type = 'password';
  }

  togglePassword.addEventListener('pointerup', hide);
  togglePassword.addEventListener('pointerleave', hide);
  togglePassword.addEventListener('pointercancel', hide);
});
