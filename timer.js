const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const timer = document.getElementById("timeLeft");
const timeInput = document.getElementById("timeInput");
const startGameBtn = document.getElementById("startGameBtn");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let timeLeft;
let userTime;
let timerInterval;

let selectedJuz;
let maxQuestions;

// Fetch the settings from localStorage or any other persistent storage
function loadSettings() {
  selectedJuz = localStorage.getItem('selectedJuz') || 1; // Default to Juz 1 if not set
  maxQuestions = parseInt(localStorage.getItem('numQuestions')) || 6; // Default to 6 questions if not set
}

fetch("questions.json")
  .then(res => res.json())
  .then(loadedQuestions => {
    loadSettings();  // Load settings before starting the game
    questions = loadedQuestions[selectedJuz]; // Get questions based on selected Juz
    startGameBtn.addEventListener('click', () => {
      userTime = parseInt(timeInput.value);
      startGame();
    });
  })
  .catch(err => {
    console.error(err);
  });

const CORRECT_BONUS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    game.classList.remove("hidden");
    loader.classList.add("hidden");
    document.getElementById("timer-settings").classList.add("hidden");
    getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {  // Use maxQuestions here
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html");
  }

  clearInterval(timerInterval);

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${maxQuestions}`;  // Use maxQuestions here
  progressBarFull.style.width = `${(questionCounter / maxQuestions) * 100}%`;  // Use maxQuestions here

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;

  startTimer();
};

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    clearInterval(timerInterval);

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

startTimer = () => {
  timeLeft = userTime || 5;

  timer.style.fontSize = "2.5rem";
  timer.style.fontWeight = "bold";
  timer.style.color = "#FF0000";

  timer.innerText = `Time Left: ${timeLeft}`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timer.innerText = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 1000);
};

handleTimeOut = () => {
  acceptingAnswers = false;

  choices.forEach(choice => {
    choice.parentElement.classList.add("incorrect");
  });

  setTimeout(() => {
    choices.forEach(choice => {
      choice.parentElement.classList.remove("incorrect");
    });
    getNewQuestion();
  }, 1000);
};
