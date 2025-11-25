/* eslint-disable no-unused-vars */
'use strict';

// ===== Константы API (замени на реальные адреса сервера) =====
const GALLERY_API_URL = 'http://localhost:3000/images';
const TEMPERATURE_API_URL = 'http://localhost:3000/temperature';

// ===== Утилита: показ тостов =====

function createToast(message, type) {
  const container = document.getElementById('toast-container');
  if (!container) {
    return;
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast--visible';
  if (type === 'error') {
    toast.classList.add('toast--error');
  } else {
    toast.classList.add('toast--info');
  }

  const textSpan = document.createElement('div');
  textSpan.className = 'toast__message';
  textSpan.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'toast__close';
  closeButton.setAttribute('aria-label', 'Закрыть уведомление');
  closeButton.textContent = '×';

  closeButton.addEventListener('click', () => {
    hideToast(toast);
  });

  toast.append(textSpan, closeButton);
  container.append(toast);

  // Авто-закрытие через 4 секунды
  window.setTimeout(() => hideToast(toast), 4000);
}

function hideToast(toast) {
  if (!toast) {
  return;
  }

  toast.classList.remove('toast--visible');
  window.setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 200);
}

function showInfoToast(message) {
  createToast(message, 'info');
}

function showErrorToast(message) {
  createToast(message, 'error');
}

// ===== Утилита: fetch с повторами =====

async function fetchWithRetry(url, options, maxAttempts, delayMs) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, delayMs);
        });
      }
    }
  }

  throw lastError;
}

// ===== Галерея =====

async function loadGallery() {
  const loader = document.getElementById('gallery-loader');
  const status = document.getElementById('gallery-status');
  const grid = document.getElementById('gallery-grid');
  const refreshButton = document.getElementById('gallery-refresh');

  if (!loader || !status || !grid || !refreshButton) {
    return;
  }

  loader.hidden = false;
  status.textContent = '';
  grid.innerHTML = '';
  refreshButton.disabled = true;

  try {
    const response = await fetchWithRetry(
      GALLERY_API_URL,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      },
      3,
      1000
    );

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      status.textContent = 'Изображения не найдены.';
      return;
    }

    data.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'gallery-card';

      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'gallery-card__image-wrapper';

      const img = document.createElement('img');
      img.src = String(item.url || '');
      img.alt = String(item.title || 'Изображение');

      imageWrapper.appendChild(img);

      const body = document.createElement('div');
      body.className = 'gallery-card__body';

      const title = document.createElement('h3');
      title.className = 'gallery-card__title';
      title.textContent = String(item.title || 'Без названия');

      const desc = document.createElement('p');
      desc.className = 'gallery-card__desc';
      desc.textContent = String(
        item.description || 'Описание отсутствует.'
      );

      body.append(title, desc);
      card.append(imageWrapper, body);
      grid.append(card);
    });

    status.textContent = '';
  } catch (error) {
    status.textContent = 'Не удалось загрузить изображения.';
    showErrorToast('Ошибка при загрузке галереи. Попробуйте позже.');
  } finally {
    loader.hidden = true;
    refreshButton.disabled = false;
  }
}

// ===== Температура =====

async function handleTemperatureSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const roomInput = document.getElementById('room');
  const temperatureInput = document.getElementById('temperature');
  const status = document.getElementById('temperature-status');
  const submitButton = document.getElementById('temperature-submit');

  if (!roomInput || !temperatureInput || !status || !submitButton) {
    return;
  }

  const room = roomInput.value.trim();
  const temperatureValue = temperatureInput.value.trim();
  const temperatureNumber = Number(temperatureValue);

  if (!room || !Number.isFinite(temperatureNumber)) {
    status.textContent =
      'Проверьте корректность аудитории и температуры.';
    showErrorToast('Некорректные данные формы.');
    return;
  }

  status.textContent = 'Отправка данных…';
  submitButton.disabled = true;

  try {
    const payload = {
      room,
      temperature: temperatureNumber
    };

    const response = await fetch(TEMPERATURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const message =
      typeof data.message === 'string'
        ? data.message
        : 'Данные успешно отправлены.';

    status.textContent = message;
    showInfoToast(message);
    form.reset();
  } catch (error) {
    status.textContent = 'Не удалось отправить данные.';
    showErrorToast('Ошибка при отправке температуры.');
  } finally {
    submitButton.disabled = false;
  }
}

// ===== Переключение темы =====

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // ignore
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.textContent = isDark ? 'Светлая тема' : 'Темная тема';
  }
}

function initThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) {
  return;
  }


  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // Синхронизируем текст кнопки с темой, применённой в <head>
  const initialTheme =
    document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(initialTheme);
}

// ===== Инициализация =====

document.addEventListener('DOMContentLoaded', () => {
  // Галерея: первая загрузка и кнопка обновления
  const refreshButton = document.getElementById('gallery-refresh');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadGallery();
    });
  }
  loadGallery();

  // Форма температуры
  const temperatureForm = document.getElementById('temperature-form');
  if (temperatureForm) {
    temperatureForm.addEventListener('submit', handleTemperatureSubmit);
  }

  // Тема
  initThemeToggle();
});
