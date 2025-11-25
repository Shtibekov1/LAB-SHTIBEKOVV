const likeButton = document.querySelector(".js-like-button");
const likeStatus = document.querySelector("#like-status");

const like2Button = document.querySelector(".js-like2-button");
const dislikeButton = document.querySelector(".js-dislike-button");
const likeDislikeStatus = document.querySelector("#like-dislike-status");

const cartCountElement = document.querySelector("#cart-count");
const cartStatusElement = document.querySelector("#cart-status");
const addToCartButtons = document.querySelectorAll(".js-add-to-cart");

const numbersListElement = document.querySelector("#numbers-list");
const sortAscButton = document.querySelector(".js-sort-asc");
const sortDescButton = document.querySelector(".js-sort-desc");
const sortResetButton = document.querySelector(".js-sort-reset");

const coordsOutputElement = document.querySelector("#coords-output");

const originalNumbers = createRandomNumbers(10, 0, 100);
let currentNumbers = [...originalNumbers];
let cartCount = 0;

// ---------- Инициализация ----------

function initPage() {
  initLike();
  initLikeDislike();
  initCart();
  initSort();
  initCoordsTracking();
}

document.addEventListener("DOMContentLoaded", initPage);

// ---------- 1. Like ----------

function initLike() {
  if (likeButton === null || likeStatus === null) {
    return;
  }

  likeButton.addEventListener("click", handleLikeClick);
}

function handleLikeClick(event) {
  const button = event.currentTarget;
  const isActive = button.getAttribute("aria-pressed") === "true";
  const newState = !isActive;

  button.setAttribute("aria-pressed", newState ? "true" : "false");

  if (newState) {
    likeStatus.textContent = "Статус: лайк поставлен";
  } else {
    likeStatus.textContent = "Статус: лайк не поставлен";
  }
}

// ---------- 2. Like / Dislike ----------

function initLikeDislike() {
  if (
    like2Button === null ||
    dislikeButton === null ||
    likeDislikeStatus === null
  ) {
    return;
  }

  like2Button.addEventListener("click", handleSecondLikeClick);
  dislikeButton.addEventListener("click", handleDislikeClick);
}

function handleSecondLikeClick() {
  toggleLikeDislikeState(true);
}

function handleDislikeClick() {
  toggleLikeDislikeState(false);
}

function toggleLikeDislikeState(isLike) {
  const currentLikePressed =
    like2Button.getAttribute("aria-pressed") === "true";
  const currentDislikePressed =
    dislikeButton.getAttribute("aria-pressed") === "true";

  if (isLike) {
    const newState = !currentLikePressed;
    like2Button.setAttribute("aria-pressed", newState ? "true" : "false");
    dislikeButton.setAttribute("aria-pressed", "false");

    if (newState) {
      likeDislikeStatus.textContent = "Статус: нравится";
    } else {
      likeDislikeStatus.textContent = "Статус: ничего не выбрано";
    }
  } else {
    const newState = !currentDislikePressed;
    dislikeButton.setAttribute("aria-pressed", newState ? "true" : "false");
    like2Button.setAttribute("aria-pressed", "false");

    if (newState) {
      likeDislikeStatus.textContent = "Статус: не нравится";
    } else {
      likeDislikeStatus.textContent = "Статус: ничего не выбрано";
    }
  }
}

// ---------- 3. Корзина ----------

function initCart() {
  if (
    cartCountElement === null ||
    cartStatusElement === null ||
    addToCartButtons.length === 0
  ) {
    return;
  }

  addToCartButtons.forEach(attachAddToCartHandler);
  updateCartOutput();
}

function attachAddToCartHandler(button) {
  button.addEventListener("click", handleAddToCartClick);
}

function handleAddToCartClick() {
  cartCount += 1;
  updateCartOutput();
}

function updateCartOutput() {
  cartCountElement.textContent = String(cartCount);
  cartStatusElement.textContent = `В корзине ${cartCount} товар(ов)`;
}

// ---------- 4. Сортировка ----------

function initSort() {
  if (
    numbersListElement === null ||
    sortAscButton === null ||
    sortDescButton === null ||
    sortResetButton === null
  ) {
    return;
  }

  renderNumbersList(currentNumbers);

  sortAscButton.addEventListener("click", handleSortAscClick);
  sortDescButton.addEventListener("click", handleSortDescClick);
  sortResetButton.addEventListener("click", handleSortResetClick);
}

function handleSortAscClick() {
  currentNumbers = [...currentNumbers].sort(compareNumbersAsc);
  renderNumbersList(currentNumbers);
}

function handleSortDescClick() {
  currentNumbers = [...currentNumbers].sort(compareNumbersDesc);
  renderNumbersList(currentNumbers);
}

function handleSortResetClick() {
  currentNumbers = [...originalNumbers];
  renderNumbersList(currentNumbers);
}

function compareNumbersAsc(a, b) {
  return a - b;
}

function compareNumbersDesc(a, b) {
  return b - a;
}

function renderNumbersList(numbers) {
  numbersListElement.innerHTML = "";

  numbers.forEach(addNumberListItem);
}

function addNumberListItem(number) {
  const listItem = document.createElement("li");
  listItem.textContent = String(number);
  numbersListElement.append(listItem);
}

function createRandomNumbers(count, min, max) {
  const result = [];

  for (let index = 0; index < count; index += 1) {
    const value = getRandomInteger(min, max);
    result.push(value);
  }

  return result;
}

function getRandomInteger(min, max) {
  const minSafe = Math.ceil(min);
  const maxSafe = Math.floor(max);

  return Math.floor(Math.random() * (maxSafe - minSafe + 1)) + minSafe;
}

// ---------- 5. Координаты ----------

function initCoordsTracking() {
  if (coordsOutputElement === null) {
    return;
  }

  document.addEventListener("pointerdown", handlePointerDown);
}

function handlePointerDown(event) {
  const x = event.clientX;
  const y = event.clientY;
  const tagName = event.target.tagName.toLowerCase();

  coordsOutputElement.textContent = `X: ${x}, Y: ${y} — ${tagName}`;
}
