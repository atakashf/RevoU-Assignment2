let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;
let playerName = "";
let gameWon = false;

const cardSymbols = ["🎮", "🎯", "🧠", "✂️", "🎲", "🎪", "🎨", "🎭"];
const MAX_MOVES = 30;

function toggleMobileMenu() {
  document.querySelector(".nav-menu").classList.toggle("active");
}

const playerNameInputSection = document.getElementById("player-name-input");
const playerNameInput = document.getElementById("mc-player-name");
const startGameBtn = document.getElementById("mc-start-btn");
const gameArea = document.getElementById("game-area");
const playerNameDisplay = document.getElementById("player-name-display");
const memoryGameBoard = document.getElementById("memory-game-board");
const memoryMovesSpan = document.getElementById("memory-moves");
const pairsFoundSpan = document.getElementById("pairs-found");
const memoryFeedback = document.getElementById("memory-feedback");

const gameModal = document.getElementById("game-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const playAgainBtn = document.getElementById("play-again-btn");

const leaderboardPanel = document.getElementById("leaderboard-panel");
const leaderboardList = document.getElementById("leaderboard-list");

function initGame() {
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  canFlip = true;
  gameWon = false;

  memoryCards = [...cardSymbols, ...cardSymbols];

  for (let i = memoryCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [memoryCards[i], memoryCards[j]] = [memoryCards[j], memoryCards[i]];
  }

  createMemoryBoard();
  updateGameUI();
  showMemoryFeedback("", "");
}

function startGame() {
  playerName = playerNameInput.value.trim();
  if (playerName === "") {
    showModal("Error", "Please enter your name to start the game!", "error");
    return;
  }

  playerNameInputSection.classList.add("hidden");
  gameArea.classList.remove("hidden");
  leaderboardPanel.classList.remove("hidden");
  playerNameDisplay.textContent = playerName;

  initGame();
  loadLeaderboard("memory-card-game");
}

function createMemoryBoard() {
  memoryGameBoard.innerHTML = "";

  memoryCards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.index = index;
    card.dataset.symbol = symbol;

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.textContent = "?";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.textContent = symbol;
    cardFront.style.display = "none";

    card.appendChild(cardBack);
    card.appendChild(cardFront);

    card.addEventListener("click", () => flipMemoryCard(index));

    memoryGameBoard.appendChild(card);
  });
}

function flipMemoryCard(cardIndex) {
  if (!canFlip || flippedCards.length >= 2) return;

  const card = document.querySelector(`[data-index="${cardIndex}"]`);
  if (card.classList.contains("flipped") || card.classList.contains("matched"))
    return;

  card.classList.add("flipped");
  card.querySelector(".card-front").style.display = "flex";
  card.querySelector(".card-back").style.display = "none";

  flippedCards.push({
    index: cardIndex,
    symbol: card.dataset.symbol,
    element: card,
  });

  if (flippedCards.length === 2) {
    moves++;
    updateGameUI();

    if (moves >= MAX_MOVES && matchedPairs < cardSymbols.length) {
      gameWon = false;
      endGame();
    } else {
      checkMemoryMatch();
    }
  }
}

function checkMemoryMatch() {
  canFlip = false;
  const [card1, card2] = flippedCards;

  if (card1.symbol === card2.symbol) {
    setTimeout(() => {
      card1.element.classList.add("matched");
      card2.element.classList.add("matched");
      card1.element.classList.remove("flipped");
      card2.element.classList.remove("flipped");

      matchedPairs++;
      updateGameUI();

      if (matchedPairs === cardSymbols.length) {
        gameWon = true;
        endGame();
      }

      flippedCards = [];
      canFlip = true;
    }, 500);
  } else {
    setTimeout(() => {
      card1.element.classList.remove("flipped");
      card2.element.classList.remove("flipped");

      card1.element.querySelector(".card-front").style.display = "none";
      card1.element.querySelector(".card-back").style.display = "flex";
      card2.element.querySelector(".card-front").style.display = "none";
      card2.element.querySelector(".card-back").style.display = "flex";

      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}

/**
 * UI Updates
 */
function updateGameUI() {
  memoryMovesSpan.textContent = moves;
  pairsFoundSpan.textContent = `${matchedPairs}/${cardSymbols.length}`;
}

function calculateMemoryScore() {
  const maxScore = 1000;
  const minMoves = cardSymbols.length;
  const penalty = Math.max(0, moves - minMoves) * 10;
  return Math.max(100, maxScore - penalty);
}

function endGame() {
  const score = calculateMemoryScore();
  updateLeaderboard("memory-card-game", playerName, gameWon);

  const title = gameWon ? "🎉 Congratulations!" : "😢 Game Over!";
  const message = gameWon
    ? `You matched all pairs in ${moves} moves! Your score: ${score}`
    : `You ran out of moves! Maximum allowed is ${MAX_MOVES}.`;

  showModal(title, message, gameWon ? "success" : "error");
}

function showModal(title, message, type) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalMessage.className = `modal-message ${type || ""}`;
  gameModal.classList.remove("hidden");
}

function hideModal() {
  gameModal.classList.add("hidden");
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
    playerRecord = { name: playerName, wins: won ? 1 : 0, losses: won ? 0 : 1 };
    leaderboard.push(playerRecord);
  }

  leaderboard.sort((a, b) => b.wins - a.wins);
  saveLeaderboard(gameName, leaderboard);
  renderLeaderboard(leaderboard);
}

function renderLeaderboard(leaderboard) {
  leaderboardList.innerHTML = "";
  if (leaderboard.length === 0) {
    const noRecords = document.createElement("li");
    noRecords.textContent = "No records yet.";
    leaderboardList.appendChild(noRecords);
    return;
  }

  leaderboard.forEach((record, index) => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `
      <span class="player-name">${index + 1}. ${record.name}</span>
      <span class="player-record">W: ${record.wins} | L: ${record.losses}</span>
    `;
    leaderboardList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  startGameBtn.addEventListener("click", startGame);

  playAgainBtn.addEventListener("click", () => {
    hideModal();
    initGame();
  });

  document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) hamburger.addEventListener("click", toggleMobileMenu);
});

  gameModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) hideModal();
  });
});
