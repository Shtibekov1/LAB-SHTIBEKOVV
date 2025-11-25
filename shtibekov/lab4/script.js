'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ================== Задача 1. Resolve ==================

  function job() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve('работа сделана');
      }, 2000);
    });
  }

  const jobButton = document.querySelector('#job-button');
  const jobStatus = document.querySelector('#job-status');

  if (jobButton && jobStatus) {
    jobButton.addEventListener('click', () => {
      jobStatus.textContent = 'Работа выполняется…';
      jobButton.disabled = true;

      job()
        .then((result) => {
          jobStatus.textContent = result;
        })
        .catch(() => {
          jobStatus.textContent = 'Произошла ошибка при выполнении работы.';
        })
        .finally(() => {
          jobButton.disabled = false;
        });
    });
  }

  // ================== Задача 2. Случайные данные и ошибки ==================

  function getData(errorProbability = 0.5, rawText = '') {
    const dataString = `Синтетические данные: ${rawText}`;

    return (numberValue) => {
      const numeric = Number(numberValue);

      if (!Number.isFinite(numeric)) {
        throw new Error('Аргумент должен быть числом (не NaN).');
      }

      if (Math.random() < errorProbability) {
        return null;
      }

      return dataString;
    };
  }

  const getDataForm = document.querySelector('#getdata-form');
  const probabilityInput = document.querySelector('#probability');
  const dataTextInput = document.querySelector('#data-text');
  const dataNumberInput = document.querySelector('#data-number');
  const getDataResult = document.querySelector('#getdata-result');

  if (
    getDataForm &&
    probabilityInput &&
    dataTextInput &&
    dataNumberInput &&
    getDataResult
  ) {
    getDataForm.addEventListener('submit', (event) => {
      event.preventDefault();

      let probability = Number(probabilityInput.value);
      if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
        probability = 0.5;
      }

      const text = dataTextInput.value.trim();
      const numberValue = dataNumberInput.value;

      const generator = getData(probability, text);

      try {
        const result = generator(numberValue);
        if (result === null) {
          getDataResult.textContent =
            'Результат: null (возникла синтетическая ошибка по вероятности).';
        } else {
          getDataResult.textContent = `Результат: ${result}`;
        }
      } catch (error) {
        getDataResult.textContent = `Ошибка: ${error.message}`;
      }
    });
  }

  // ================== Задача 3. Крафт ==================

  const inventory = {
    wood: 0,
    stick: 0,
    ironOre: 0,
    ironIngot: 0,
    pickaxe: 0
  };

  const recipes = {
    wood: {
      name: 'Дерево',
      craftingTime: 500,
      requiredItems: [],
      failProbability: 0.1
    },
    stick: {
      name: 'Палка',
      craftingTime: 800,
      requiredItems: ['wood'],
      failProbability: 0.15
    },
    ironOre: {
      name: 'Железная руда',
      craftingTime: 1000,
      requiredItems: [],
      failProbability: 0.2
    },
    ironIngot: {
      name: 'Железный слиток',
      craftingTime: 1200,
      requiredItems: ['ironOre'],
      failProbability: 0.25
    },
    pickaxe: {
      name: 'Кирка',
      craftingTime: 1500,
      requiredItems: ['stick', 'ironIngot'],
      failProbability: 0.3
    }
  };

  const craftLogList = document.querySelector('#craft-log-list');

  function appendLog(message) {
    if (!craftLogList) {
      return;
    }
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString();
    li.textContent = `${time} — ${message}`;
    craftLogList.append(li);
  }

  function updateCountDisplay(key) {
    const span = document.querySelector(
      `.craft-count[data-item-count="${key}"]`
    );
    if (span) {
      span.textContent = String(inventory[key]);
    }
  }

  function updateStatus(key, text) {
    const statusElement = document.querySelector(
      `.craft-status[data-item-status="${key}"]`
    );
    if (statusElement) {
      statusElement.textContent = text;
    }
  }

  function ensureDependencies(recipeKey) {
    const recipe = recipes[recipeKey];
    const required = recipe.requiredItems;

    if (!required || required.length === 0) {
      return Promise.resolve();
    }

    const dependencyPromises = required.map((depKey) => {
      if (inventory[depKey] > 0) {
        appendLog(
          `Используем уже имеющийся ресурс: ${recipes[depKey].name} для ${recipe.name}.`
        );
        return Promise.resolve({ key: depKey, status: 'fromInventory' });
      }

      appendLog(
        `Начинаем крафт ресурса ${recipes[depKey].name} для ${recipe.name}.`
      );
      updateStatus(depKey, 'Создание…');

      return craftItem(depKey)
        .then(() => ({ key: depKey, status: 'crafted' }))
        .catch((error) => ({ key: depKey, status: 'failed', error }));
    });

    return Promise.all(dependencyPromises).then((results) => {
      const hasFailed = results.some(
        (result) => result.status === 'failed'
      );

      if (hasFailed) {
        appendLog(
          `Не удалось создать все ресурсы для ${recipe.name}. Основной предмет не будет создан.`
        );
        throw new Error(
          `Не удалось создать все ресурсы для ${recipe.name}.`
        );
      }
    });
  }

  function craftItem(key) {
    const recipe = recipes[key];

    if (!recipe) {
      return Promise.reject(new Error('Неизвестный предмет.'));
    }

    return ensureDependencies(key)
      .then(() => {
        const lacksResources = recipe.requiredItems.some(
          (depKey) => inventory[depKey] <= 0
        );

        if (lacksResources) {
          throw new Error(
            `Недостаточно ресурсов для создания предмета: ${recipe.name}.`
          );
        }

        recipe.requiredItems.forEach((depKey) => {
          inventory[depKey] -= 1;
          updateCountDisplay(depKey);
        });

        updateStatus(key, 'Создание…');
        appendLog(`Создание предмета: ${recipe.name}…`);

        return new Promise((resolve, reject) => {
          window.setTimeout(() => {
            const failed = Math.random() < recipe.failProbability;

            if (failed) {
              updateStatus(key, 'Неудача');
              appendLog(`Не удалось создать предмет: ${recipe.name}.`);
              reject(new Error(`Крафт ${recipe.name} провален.`));
              return;
            }

            inventory[key] += 1;
            updateCountDisplay(key);
            updateStatus(key, 'Успех');
            appendLog(`Успешно создан предмет: ${recipe.name}.`);
            resolve();
          }, recipe.craftingTime);
        });
      })
      .catch((error) => {
        if (!error || !error.message) {
          appendLog(`Ошибка при создании предмета: ${key}.`);
        } else {
          appendLog(`Ошибка: ${error.message}`);
        }
        throw error;
      });
  }

  const craftButtons = document.querySelectorAll('[data-craft-button]');

  craftButtons.forEach((button) => {
    const itemKey = button.getAttribute('data-craft-button');

    button.addEventListener('click', () => {
      if (!itemKey || !recipes[itemKey]) {
        return;
      }

      button.disabled = true;

      craftItem(itemKey)
        .catch(() => {
          // Ошибки уже отражены в логе и статусах.
        })
        .finally(() => {
          button.disabled = false;
        });
    });
  });
});
