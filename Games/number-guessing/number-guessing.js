function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.querySelector(".hamburger");
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
}

let targetNumber = 0;
let attemptsLeft = 10;
let previousGuesses = [];
let gameScore = 0;
let playerName = "";
let gameWon = false;

const playerNameInputSection = document.getElementById("player-name-input");
const playerNameInput = document.getElementById("ng-player-name");
const startGameBtn = document.getElementById("ng-start-btn");
const gameArea = document.getElementById("game-area");
const playerNameDisplay = document.getElementById("player-name-display");
const attemptsLeftSpan = document.getElementById("attempts-left");
const currentScoreSpan = document.getElementById("current-score");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const guessFeedback = document.getElementById("guess-feedback");
const guessesList = document.getElementById("guesses-list");

const gameModal = document.getElementById("game-modal");
const modalContent = gameModal.querySelector(".modal-content");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const playAgainBtn = document.getElementById("play-again-btn");

const leaderboardPanel = document.getElementById("leaderboard-panel");
const leaderboardList = document.getElementById("leaderboard-list");

function initGame() {
  targetNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = 10;
  previousGuesses = [];
  gameScore = 0;
  gameWon = false;

  updateGameUI();
  clearGuessFeedback();
  clearPreviousGuesses();
  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.style.opacity = "1";
  guessBtn.style.opacity = "1";

  console.log(`Debug: Target number is ${targetNumber}`);
}

function startGame() {
  playerName = playerNameInput.value.trim();
  if (playerName === "") {
    showGuessFeedback("Please enter your name to start!", "error");
    return;
  }

  playerNameInputSection.classList.add("hidden");
  gameArea.classList.remove("hidden");
  leaderboardPanel.classList.remove("hidden");
  playerNameDisplay.textContent = playerName;

  initGame();
  loadLeaderboard("guess-the-number");
}

function updateGameUI() {
  attemptsLeftSpan.textContent = attemptsLeft;
  currentScoreSpan.textContent = gameScore;
}

function validateGuessInput(input) {
  if (!input || input.trim() === "")
    return { isValid: false, error: "Please enter a number!" };

  const number = parseInt(input);
  if (isNaN(number))
    return { isValid: false, error: "Please enter a valid number!" };
  if (number < 1 || number > 100)
    return { isValid: false, error: "Number must be between 1 and 100!" };
  if (previousGuesses.includes(number))
    return { isValid: false, error: "You already guessed this number!" };

  return { isValid: true, number };
}

function makeGuess() {
  const validation = validateGuessInput(guessInput.value);
  if (!validation.isValid) {
    showGuessFeedback(validation.error, "error");
    return;
  }

  const guess = validation.number;
  previousGuesses.push(guess);
  addGuessToHistory(guess);
  attemptsLeft--;

  if (guess === targetNumber) {
    gameScore = (attemptsLeft + 1) * 10;
    gameWon = true;
    endGame();
  } else if (attemptsLeft === 0) {
    gameWon = false;
    endGame();
  } else {
    const hint =
      guess > targetNumber ? "Too high! Try lower." : "Too low! Try higher.";
    showGuessFeedback(hint, "hint");
  }

  updateGameUI();
  guessInput.value = "";
}

function showGuessFeedback(message, type) {
  guessFeedback.textContent = message;
  guessFeedback.className = `feedback ${type}`;
}
function clearGuessFeedback() {
  guessFeedback.textContent = "";
}
function addGuessToHistory(guess) {
  const guessItem = document.createElement("div");
  guessItem.className = "guess-item";
  guessItem.textContent = guess;
  guessesList.appendChild(guessItem);
}
function clearPreviousGuesses() {
  guessesList.innerHTML = "";
}

function endGame() {
  guessBtn.disabled = true;
  guessInput.disabled = true;
  guessBtn.style.opacity = "0.5";
  guessInput.style.opacity = "0.5";

  updateLeaderboard("guess-the-number", playerName, gameWon);

  const title = gameWon ? "🎉 Congratulations!" : "😢 Game Over!";
  const message = gameWon
    ? `You guessed ${targetNumber} and scored ${gameScore} points!`
    : `The number was ${targetNumber}. Better luck next time!`;

  showModal(title, message, gameWon ? "success" : "error");
}

function showModal(title, message, type) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  modalContent.classList.remove("success", "error", "hidden");
  if (type) modalContent.classList.add(type);

  gameModal.classList.remove("hidden");
  gameModal.style.display = "flex";
}

function hideModal() {
  gameModal.classList.add("hidden");
  gameModal.style.display = "none";
}

function loadLeaderboard(gameName) {
  const leaderboard =
    JSON.parse(localStorage.getItem(`${gameName}-leaderboard`)) || [];
  renderLeaderboard(leaderboard);
  return leaderboard;
}
function saveLeaderboard(gameName, leaderboard) {
  localStorage.setItem(`${gameName}-leaderboard`, JSON.stringify(leaderboard));
}
function updateLeaderboard(gameName, playerName, won) {
  const leaderboard = loadLeaderboard(gameName);
  let playerRecord = leaderboard.find((r) => r.name === playerName);

  if (playerRecord) {
    won ? playerRecord.wins++ : playerRecord.losses++;
  } else {
    leaderboard.push({
      name: playerName,
      wins: won ? 1 : 0,
      losses: won ? 0 : 1,
    });
  }

  leaderboard.sort((a, b) => b.wins - a.wins);
  saveLeaderboard(gameName, leaderboard);
  renderLeaderboard(leaderboard);
}
function renderLeaderboard(leaderboard) {
  leaderboardList.innerHTML = "";
  if (!leaderboard.length) {
    const noRecords = document.createElement("li");
    noRecords.textContent = "No records yet.";
    noRecords.style.textAlign = "center";
    noRecords.style.color = "#ccc";
    leaderboardList.appendChild(noRecords);
    return;
  }
  leaderboard.forEach((record, i) => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `
      <span class="player-name">${i + 1}. ${record.name}</span>
      <span class="player-record">W: ${record.wins} | L: ${record.losses}</span>
    `;
    leaderboardList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) hamburger.addEventListener("click", toggleMobileMenu);

  startGameBtn.addEventListener("click", startGame);
  guessBtn.addEventListener("click", makeGuess);
  guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") makeGuess();
  });
  playAgainBtn.addEventListener("click", () => {
    hideModal();
    initGame();
  });

  if (!gameArea.classList.contains("hidden"))
    loadLeaderboard("guess-the-number");
});
