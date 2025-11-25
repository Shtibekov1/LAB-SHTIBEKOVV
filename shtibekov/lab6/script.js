'use strict';

// ===================== Версионирование =====================

function VersionManager(initialVersion) {
  const versionString = initialVersion && initialVersion.trim()
    ? initialVersion.trim()
    : '0.0.1';

  const parsed = VersionManager.parseVersion(versionString);
  this._major = parsed.major;
  this._minor = parsed.minor;
  this._patch = parsed.patch;
  this._history = [];
}

VersionManager.parseVersion = function parseVersion(str) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(str);

  if (!match) {
    throw new Error('Некорректный формат версии!');
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (
    !Number.isInteger(major)
    || !Number.isInteger(minor)
    || !Number.isInteger(patch)
  ) {
    throw new Error('Некорректный формат версии!');
  }

  return { major, minor, patch };
};

VersionManager.prototype._saveState = function _saveState() {
  this._history.push({
    major: this._major,
    minor: this._minor,
    patch: this._patch
  });
};

VersionManager.prototype.major = function major() {
  this._saveState();
  this._major += 1;
  this._minor = 0;
  this._patch = 0;
  return this;
};

VersionManager.prototype.minor = function minor() {
  this._saveState();
  this._minor += 1;
  this._patch = 0;
  return this;
};

VersionManager.prototype.patch = function patch() {
  this._saveState();
  this._patch += 1;
  return this;
};

VersionManager.prototype.rollback = function rollback() {
  if (this._history.length === 0) {
    throw new Error('Невозможно выполнить откат!');
  }

  const previous = this._history.pop();
  this._major = previous.major;
  this._minor = previous.minor;
  this._patch = previous.patch;
  return this;
};

VersionManager.prototype.release = function release() {
  return `${this._major}.${this._minor}.${this._patch}`;
};

// ===================== Прямоугольник и квадрат =====================

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  getPerimeter() {
    return 2 * (this.width + this.height);
  }
}

class Square extends Rectangle {
  constructor(side) {
    super(side, side);
  }
}

// ===================== Температура =====================

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    const num = Number(value);

    if (!Number.isFinite(num) || num < -273.16 || num > 1.41e32) {
      throw new Error('Неверное значение температуры');
    }

    this._celsius = num;
  }

  toKelvin() {
    const kelvin = this._celsius + 273.15;
    return Number(kelvin.toFixed(2));
  }

  toFahrenheit() {
    const fahrenheit = (this._celsius * 9) / 5 + 32;
    return Number(fahrenheit.toFixed(2));
  }

  toString() {
    const kelvin = this._celsius + 273.15;
    return `${kelvin.toFixed(2)} K`;
  }

  static ensureInstance(temp) {
    if (!(temp instanceof Temperature)) {
      throw new TypeError('Ожидается экземпляр класса Temperature');
    }
  }

  static add(t1, t2) {
    Temperature.ensureInstance(t1);
    Temperature.ensureInstance(t2);
    return new Temperature(t1.celsius + t2.celsius);
  }

  static subtract(t1, t2) {
    Temperature.ensureInstance(t1);
    Temperature.ensureInstance(t2);
    return new Temperature(t1.celsius - t2.celsius);
  }
}

// ===================== RPS: Observer + SSE =====================

class RpsSubject {
  constructor() {
    this.observers = new Set();
  }

  subscribe(observer) {
    this.observers.add(observer);
  }

  unsubscribe(observer) {
    this.observers.delete(observer);
  }

  notify(round) {
    this.observers.forEach((observer) => {
      observer.update(round);
    });
  }

  resetAll() {
    this.observers.forEach((observer) => {
      if (typeof observer.reset === 'function') {
        observer.reset();
      }
    });
  }
}

class RpsHistoryObserver {
  constructor(listElement) {
    this.listElement = listElement;
    this.rounds = 0;
  }

  reset() {
    this.rounds = 0;
    if (this.listElement) {
      this.listElement.innerHTML = '';
    }
  }

  update(round) {
    if (!this.listElement) {
      return;
    }

    this.rounds += 1;
    const li = document.createElement('li');
    const winnerText = (() => {
      if (round.winner === 'player1') return 'Победил игрок 1';
      if (round.winner === 'player2') return 'Победил игрок 2';
      return 'Ничья';
    })();

    li.textContent = `#${this.rounds}: Игрок 1 — ${round.player1}, Игрок 2 — ${round.player2}. ${winnerText}.`;
    this.listElement.append(li);
  }
}

class RpsScoreObserver {
  constructor(p1Element, p2Element, drawElement) {
    this.p1Element = p1Element;
    this.p2Element = p2Element;
    this.drawElement = drawElement;
    this.reset();
  }

  reset() {
    this.p1Wins = 0;
    this.p2Wins = 0;
    this.draws = 0;
    this.render();
  }

  render() {
    if (this.p1Element) this.p1Element.textContent = String(this.p1Wins);
    if (this.p2Element) this.p2Element.textContent = String(this.p2Wins);
    if (this.drawElement) this.drawElement.textContent = String(this.draws);
  }

  update(round) {
    if (round.winner === 'player1') {
      this.p1Wins += 1;
    } else if (round.winner === 'player2') {
      this.p2Wins += 1;
    } else {
      this.draws += 1;
    }

    this.render();
  }
}

class RpsStatsObserver {
  constructor(elements) {
    this.elements = elements;
    this.reset();
  }

  reset() {
    this.counts = {
      p1: { Камень: 0, Ножницы: 0, Бумага: 0 },
      p2: { Камень: 0, Ножницы: 0, Бумага: 0 }
    };
    this.render();
  }

  render() {
    const { p1, p2 } = this.counts;

    if (this.elements.p1Rock) this.elements.p1Rock.textContent = String(p1.Камень);
    if (this.elements.p1Scissors) this.elements.p1Scissors.textContent = String(p1.Ножницы);
    if (this.elements.p1Paper) this.elements.p1Paper.textContent = String(p1.Бумага);

    if (this.elements.p2Rock) this.elements.p2Rock.textContent = String(p2.Камень);
    if (this.elements.p2Scissors) this.elements.p2Scissors.textContent = String(p2.Ножницы);
    if (this.elements.p2Paper) this.elements.p2Paper.textContent = String(p2.Бумага);
  }

  update(round) {
    if (this.counts.p1[round.player1] !== undefined) {
      this.counts.p1[round.player1] += 1;
    }
    if (this.counts.p2[round.player2] !== undefined) {
      this.counts.p2[round.player2] += 1;
    }
    this.render();
  }
}

function determineWinner(p1, p2) {
  if (p1 === p2) return 'draw';

  const ROCK = 'Камень';
  const SCISSORS = 'Ножницы';
  const PAPER = 'Бумага';

  if (
    (p1 === ROCK && p2 === SCISSORS)
    || (p1 === SCISSORS && p2 === PAPER)
    || (p1 === PAPER && p2 === ROCK)
  ) {
    return 'player1';
  }

  return 'player2';
}

// ===================== Инициализация DOM =====================

document.addEventListener('DOMContentLoaded', () => {
  // ----- Версионирование -----
  const versionForm = document.getElementById('version-form');
  const versionInput = document.getElementById('version-input');
  const versionCurrent = document.getElementById('version-current');
  const versionMessage = document.getElementById('version-message');
  const versionControls = document.getElementById('version-controls');
  const majorButton = document.getElementById('version-major');
  const minorButton = document.getElementById('version-minor');
  const patchButton = document.getElementById('version-patch');
  const rollbackButton = document.getElementById('version-rollback');

  let currentManager = null;

  function updateVersionDisplay() {
    if (!currentManager) {
      versionCurrent.textContent = 'Версия ещё не создана.';
      return;
    }
    versionCurrent.textContent = `Текущая версия: ${currentManager.release()}`;
  }

  if (versionForm) {
    versionForm.addEventListener('submit', (event) => {
      event.preventDefault();
      versionMessage.textContent = '';

      const value = versionInput && versionInput.value ? versionInput.value : '';

      try {
        currentManager = new VersionManager(value);
        updateVersionDisplay();
        if (versionControls) {
          versionControls.hidden = false;
        }
        if (versionInput) {
          versionInput.value = '';
        }
      } catch (error) {
        currentManager = null;
        versionCurrent.textContent = 'Ошибка при создании версии.';
        versionMessage.textContent = error.message;
        if (versionControls) {
          versionControls.hidden = true;
        }
      }
    });
  }

  function bindVersionButton(button, methodName) {
    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      if (!currentManager) {
        versionMessage.textContent = 'Сначала создайте менеджер версии.';
        return;
      }

      versionMessage.textContent = '';
      try {
        currentManager[methodName]();
        updateVersionDisplay();
      } catch (error) {
        versionMessage.textContent = error.message;
      }
    });
  }

  bindVersionButton(majorButton, 'major');
  bindVersionButton(minorButton, 'minor');
  bindVersionButton(patchButton, 'patch');
  bindVersionButton(rollbackButton, 'rollback');

  // ----- Прямоугольник / квадрат -----
  const rectWidthInput = document.getElementById('rect-width');
  const rectHeightInput = document.getElementById('rect-height');
  const rectAreaButton = document.getElementById('rect-area');
  const rectPerimeterButton = document.getElementById('rect-perimeter');
  const rectResult = document.getElementById('rect-result');

  function createShapeFromInputs() {
    const widthValue = rectWidthInput ? rectWidthInput.value : '';
    const heightValue = rectHeightInput ? rectHeightInput.value : '';

    const width = Number(widthValue);
    const height = Number(heightValue);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      if (rectResult) {
        rectResult.textContent = 'Введите положительные числа для ширины и высоты.';
      }
      return null;
    }

    if (width === height) {
      return { shape: new Square(width), type: 'Квадрат' };
    }

    return { shape: new Rectangle(width, height), type: 'Прямоугольник' };
  }

  function bindRectButton(button, mode) {
    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      const data = createShapeFromInputs();
      if (!data || !rectResult) {
        return;
      }

      const { shape, type } = data;

      if (mode === 'area') {
        const area = shape.getArea();
        rectResult.textContent = `${type}. Площадь: ${area.toFixed(2)}.`;
      } else if (mode === 'perimeter') {
        const perimeter = shape.getPerimeter();
        rectResult.textContent = `${type}. Периметр: ${perimeter.toFixed(2)}.`;
      }
    });
  }

  bindRectButton(rectAreaButton, 'area');
  bindRectButton(rectPerimeterButton, 'perimeter');

  // ----- Температура -----
  const temp1Input = document.getElementById('temp1');
  const temp2Input = document.getElementById('temp2');
  const temp1Display = document.getElementById('temp1-display');
  const temp2Display = document.getElementById('temp2-display');
  const tempAddButton = document.getElementById('temp-add');
  const tempSubtractButton = document.getElementById('temp-subtract');
  const tempResult = document.getElementById('temp-result');

  function getSelectedUnit() {
    const radios = document.querySelectorAll('input[name="temperature-unit"]');
    let value = 'c';

    radios.forEach((radio) => {
      if (radio.checked) {
        value = radio.value;
      }
    });

    return value;
  }

  function tryCreateTemperature(inputElement) {
    if (!inputElement) {
      return null;
    }

    const raw = inputElement.value.trim();
    if (raw === '') {
      return null;
    }

    try {
      // Конструктор сам валидирует диапазон.
      return new Temperature(Number(raw));
    } catch (error) {
      return null;
    }
  }

  function formatTemperature(temp, unit) {
    if (!(temp instanceof Temperature)) {
      return '—';
    }

    if (unit === 'k') {
      return `${temp.toKelvin().toFixed(2)} K`;
    }

    if (unit === 'f') {
      return `${temp.toFahrenheit().toFixed(2)} °F`;
    }

    return `${temp.celsius.toFixed(2)} °C`;
  }

  function updateTemperatureDisplays() {
    const unit = getSelectedUnit();
    const t1 = tryCreateTemperature(temp1Input);
    const t2 = tryCreateTemperature(temp2Input);

    if (temp1Display) {
      temp1Display.textContent = t1 ? formatTemperature(t1, unit) : '';
    }
    if (temp2Display) {
      temp2Display.textContent = t2 ? formatTemperature(t2, unit) : '';
    }
  }

  if (temp1Input) {
    temp1Input.addEventListener('input', updateTemperatureDisplays);
  }
  if (temp2Input) {
    temp2Input.addEventListener('input', updateTemperatureDisplays);
  }

  const unitRadios = document.querySelectorAll('input[name="temperature-unit"]');
  unitRadios.forEach((radio) => {
    radio.addEventListener('change', updateTemperatureDisplays);
  });

  function handleTemperatureOperation(mode) {
    const t1 = tryCreateTemperature(temp1Input);
    const t2 = tryCreateTemperature(temp2Input);

    if (!tempResult) {
      return;
    }

    if (!t1 || !t2) {
      tempResult.textContent = 'Введите корректные температуры в обоих полях.';
      return;
    }

    const unit = getSelectedUnit();
    let resultTemp;

    try {
      if (mode === 'add') {
        resultTemp = Temperature.add(t1, t2);
      } else {
        resultTemp = Temperature.subtract(t1, t2);
      }
    } catch (error) {
      tempResult.textContent = error.message;
      return;
    }

    tempResult.textContent = `Результат: ${formatTemperature(resultTemp, unit)}`;
  }

  if (tempAddButton) {
    tempAddButton.addEventListener('click', () => {
      handleTemperatureOperation('add');
    });
  }

  if (tempSubtractButton) {
    tempSubtractButton.addEventListener('click', () => {
      handleTemperatureOperation('subtract');
    });
  }

  // начальное обновление
  updateTemperatureDisplays();

  // ----- SSE RPS -----
  const rpsStatus = document.getElementById('rps-status');
  const rpsHistoryList = document.getElementById('rps-history');
  const rpsScoreP1 = document.getElementById('rps-score-p1');
  const rpsScoreP2 = document.getElementById('rps-score-p2');
  const rpsScoreDraw = document.getElementById('rps-score-draw');

  const rpsP1Rock = document.getElementById('rps-p1-rock');
  const rpsP1Scissors = document.getElementById('rps-p1-scissors');
  const rpsP1Paper = document.getElementById('rps-p1-paper');
  const rpsP2Rock = document.getElementById('rps-p2-rock');
  const rpsP2Scissors = document.getElementById('rps-p2-scissors');
  const rpsP2Paper = document.getElementById('rps-p2-paper');

  const rpsStartButton = document.getElementById('rps-start');
  const rpsStopButton = document.getElementById('rps-stop');

  const rpsSubject = new RpsSubject();

  const historyObserver = new RpsHistoryObserver(rpsHistoryList);
  const scoreObserver = new RpsScoreObserver(rpsScoreP1, rpsScoreP2, rpsScoreDraw);
  const statsObserver = new RpsStatsObserver({
    p1Rock: rpsP1Rock,
    p1Scissors: rpsP1Scissors,
    p1Paper: rpsP1Paper,
    p2Rock: rpsP2Rock,
    p2Scissors: rpsP2Scissors,
    p2Paper: rpsP2Paper
  });

  rpsSubject.subscribe(historyObserver);
  rpsSubject.subscribe(scoreObserver);
  rpsSubject.subscribe(statsObserver);

  let eventSource = null;

  if (!('EventSource' in window)) {
    if (rpsStatus) {
      rpsStatus.textContent = 'Ваш браузер не поддерживает Server-Sent Events.';
    }
    if (rpsStartButton) {
      rpsStartButton.disabled = true;
    }
  }

  function setRpsButtonsState(isRunning) {
    if (rpsStartButton) {
      rpsStartButton.disabled = isRunning;
    }
    if (rpsStopButton) {
      rpsStopButton.disabled = !isRunning;
    }
  }

  function startRpsStream() {
    if (eventSource || !('EventSource' in window)) {
      return;
    }

    rpsSubject.resetAll();
    if (rpsStatus) {
      rpsStatus.textContent = 'Подключение к потоку игр…';
    }

    // Важно: сервер только по http, с https не заработает.
    eventSource = new EventSource('http://95.163.242.125:80/rps/stream');

    eventSource.addEventListener('open', () => {
      if (rpsStatus) {
        rpsStatus.textContent = 'Соединение установлено. Ожидание раундов…';
      }
    });

    eventSource.addEventListener('error', () => {
      if (rpsStatus) {
        rpsStatus.textContent = 'Ошибка соединения с потоком игр.';
      }
    });

    eventSource.addEventListener('round', (event) => {
      try {
        const data = JSON.parse(event.data);
        const winner = determineWinner(data.player1, data.player2);
        const round = {
          player1: data.player1,
          player2: data.player2,
          winner
        };
        rpsSubject.notify(round);
      } catch (error) {
        if (rpsStatus) {
          rpsStatus.textContent = 'Ошибка обработки данных раунда.';
        }
      }
    });

    setRpsButtonsState(true);
  }

  function stopRpsStream() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (rpsStatus) {
      rpsStatus.textContent = 'Трансляция остановлена.';
    }
    setRpsButtonsState(false);
  }

  if (rpsStartButton) {
    rpsStartButton.addEventListener('click', startRpsStream);
  }

  if (rpsStopButton) {
    rpsStopButton.addEventListener('click', stopRpsStream);
  }
});
