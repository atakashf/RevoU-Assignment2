let rpsPlayerScore = 0;
let rpsAiScore = 0;
let currentRound = 1;
let gameInProgress = false;
let playerName = "";
let gameWon = false;

const rpsChoices = ["rock", "paper", "scissors"];
const rpsEmojis = { rock: "🪨", paper: "📄", scissors: "✂️" };

function toggleMobileMenu() {
  document.querySelector(".nav-menu").classList.toggle("active");
}

const playerNameInputSection = document.getElementById("player-name-input");
const playerNameInput = document.getElementById("rps-player-name");
const startGameBtn = document.getElementById("rps-start-btn");
const gameArea = document.getElementById("game-area");
const playerNameDisplay = document.getElementById("player-name-display");
const currentRoundSpan = document.getElementById("current-round");
const rpsScoreSpan = document.getElementById("rps-score");
const playerChoiceDisplay = document.getElementById("player-choice-display");
const aiChoiceDisplay = document.getElementById("ai-choice-display");
const rpsFeedback = document.getElementById("rps-feedback");
const choiceButtons = document.querySelectorAll(".choice-btn");

const gameModal = document.getElementById("game-modal");
const modalContent = gameModal.querySelector(".modal-content");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const playAgainBtn = document.getElementById("play-again-btn");

const leaderboardPanel = document.getElementById("leaderboard-panel");
const leaderboardList = document.getElementById("leaderboard-list");

function initGame() {
  rpsPlayerScore = 0;
  rpsAiScore = 0;
  currentRound = 1;
  gameInProgress = false;
  gameWon = false;

  updateGameUI();
  clearRPSChoiceDisplays();
  showRPSFeedback("", "");

  choiceButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("selected", "disabled");
  });
}

function startGame() {
  playerName = playerNameInput.value.trim();
  if (playerName === "") {
    showRPSFeedback("Please enter your name to start!", "error");
    return;
  }

  playerNameInputSection.classList.add("hidden");
  gameArea.classList.remove("hidden");
  leaderboardPanel.classList.remove("hidden");
  playerNameDisplay.textContent = playerName;

  initGame();
  loadLeaderboard("rock-paper-scissors");
}

function playRPS(playerChoice) {
  if (gameInProgress || currentRound > 3) return;
  gameInProgress = true;

  choiceButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.choice === playerChoice) btn.classList.add("selected");
  });

  const aiChoice = rpsChoices[Math.floor(Math.random() * rpsChoices.length)];
  updateRPSChoiceDisplays(playerChoice, aiChoice);

  const roundResult = determineRPSWinner(playerChoice, aiChoice);
  if (roundResult === "player") {
    rpsPlayerScore++;
    showRPSFeedback(
      `You win this round! ${rpsEmojis[playerChoice]} beats ${rpsEmojis[aiChoice]}`,
      "success"
    );
  } else if (roundResult === "ai") {
    rpsAiScore++;
    showRPSFeedback(
      `AI wins this round! ${rpsEmojis[aiChoice]} beats ${rpsEmojis[playerChoice]}`,
      "error"
    );
  } else {
    showRPSFeedback(
      `It's a tie! Both chose ${rpsEmojis[playerChoice]}`,
      "hint"
    );
  }

  updateGameUI();

  setTimeout(() => {
    if (currentRound >= 3) {
      endGame();
    } else {
      currentRound++;
      updateGameUI();
      gameInProgress = false;
      clearRPSChoiceDisplays();
      choiceButtons.forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove("selected");
      });
    }
  }, 2000);
}

function determineRPSWinner(playerChoice, aiChoice) {
  if (playerChoice === aiChoice) return "tie";
  const winConditions = { rock: "scissors", paper: "rock", scissors: "paper" };
  return winConditions[playerChoice] === aiChoice ? "player" : "ai";
}

function updateGameUI() {
  currentRoundSpan.textContent = `${currentRound}/3`;
  rpsScoreSpan.textContent = `You: ${rpsPlayerScore} | AI: ${rpsAiScore}`;
}

function updateRPSChoiceDisplays(playerChoice, aiChoice) {
  playerChoiceDisplay.textContent = rpsEmojis[playerChoice];
  aiChoiceDisplay.textContent = rpsEmojis[aiChoice];
}

function clearRPSChoiceDisplays() {
  playerChoiceDisplay.textContent = "?";
  aiChoiceDisplay.textContent = "?";
}

function showRPSFeedback(message, type) {
  rpsFeedback.textContent = message;
  rpsFeedback.className = `feedback ${type}`;
}

function endGame() {
  let title, finalMessage, messageType;

  if (rpsPlayerScore > rpsAiScore) {
    title = "🎉 Congratulations!";
    finalMessage = `You won the match! Final score: You ${rpsPlayerScore} - ${rpsAiScore} AI`;
    messageType = "success";
    gameWon = true;
  } else if (rpsAiScore > rpsPlayerScore) {
    title = "😞 Game Over!";
    finalMessage = `AI won the match! Final score: You ${rpsPlayerScore} - ${rpsAiScore} AI`;
    messageType = "error";
    gameWon = false;
  } else {
    title = "🤝 It's a tie!";
    finalMessage = `Final score: You ${rpsPlayerScore} - ${rpsAiScore} AI`;
    messageType = "hint";
    gameWon = false;
  }

  updateLeaderboard("rock-paper-scissors", playerName, gameWon);

  choiceButtons.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });

  showModal(title, finalMessage, messageType);
}

const modalBackdrop = document.querySelector(".modal-backdrop");

function showModal(title, message, type) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalMessage.className = `modal-message ${type || ""}`;
  gameModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

function hideModal() {
  gameModal.classList.add("hidden");
  modalBackdrop.classList.add("hidden");
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
  let record = leaderboard.find((r) => r.name === playerName);

  if (record) {
    won ? record.wins++ : record.losses++;
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

  choiceButtons.forEach((btn) => {
    btn.addEventListener("click", () => playRPS(btn.dataset.choice));
  });

  playAgainBtn.addEventListener("click", () => {
    hideModal();
    gameArea.classList.remove("hidden");
    leaderboardPanel.classList.remove("hidden");
    initGame();
  });

  if (!gameArea.classList.contains("hidden")) {
    loadLeaderboard("rock-paper-scissors");
  }
});
