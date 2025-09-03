function scrollToGames() {
  const gamesPreview = document.getElementById("games-preview");
  if (gamesPreview) {
    gamesPreview.scrollIntoView({ behavior: "smooth" });
  }
}

function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.querySelector(".hamburger");

  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
}

function storeHighScore(gameName, score) {
  const currentHighScore = getHighScore(gameName);
  if (score > currentHighScore) {
    localStorage.setItem(`${gameName}-highscore`, score.toString());
    console.log(`New high score for ${gameName}: ${score}`);
  }
}

function getHighScore(gameName) {
  const score = localStorage.getItem(`${gameName}-highscore`);
  return score ? parseInt(score) : 0;
}

document.addEventListener("DOMContentLoaded", function () {
  initGuessGame();

  const guessBtn = document.getElementById("guess-btn");
  const guessInput = document.getElementById("guess-input");
  const resetGuessBtn = document.getElementById("reset-guess-btn");

  guessBtn.addEventListener("click", makeGuess);
  guessInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      makeGuess();
    }
  });
  resetGuessBtn.addEventListener("click", resetGuessGame);

  const resetMemoryBtn = document.getElementById("reset-memory-btn");
  resetMemoryBtn.addEventListener("click", resetMemoryGame);

  const choiceButtons = document.querySelectorAll(".choice-btn");
  choiceButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const choice = this.dataset.choice;
      playRPS(choice);
    });
  });

  const resetRPSBtn = document.getElementById("reset-rps-btn");
  resetRPSBtn.addEventListener("click", resetRPSGame);

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("href").substring(1);
      showSection(sectionId);
    });
  });

  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  const mobileNavLinks = document.querySelectorAll(".nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const navMenu = document.querySelector(".nav-menu");
      const hamburger = document.querySelector(".hamburger");
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addTemporaryClass(element, className, duration = 1000) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

function scrollToGames() {
  const gamesPreview = document.getElementById("games-preview");
  if (gamesPreview) {
    gamesPreview.scrollIntoView({ behavior: "smooth" });
  }
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
    targetSection.classList.add("fade-in");
  }
  updateNavigation(sectionId);
}

function updateNavigation(sectionId) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.classList.add("active");
    }
  });
}

function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.querySelector(".hamburger");

  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const sectionId = href.substring(1);
        showSection(sectionId);
      }
      const navMenu = document.querySelector(".nav-menu");
      const hamburger = document.querySelector(".hamburger");
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  });

  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(initialHash)) {
    showSection(initialHash);
  } else {
    showSection("home");
  }
});
