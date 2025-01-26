const audioElement = document.getElementById("recitationAudio");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let questionCounter = 0;
let availableQuestions = [];
let score = 0; // Add a score variable to track correct answers
let questions = [];

const MAX_QUESTIONS = 9;

// Fetch questions from JSON file
fetch("reciters.json")
    .then((res) => res.json())
    .then((loadedQuestions) => {
        questions = loadedQuestions;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0; // Reset score when the game starts
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        // Save the score in localStorage to retrieve it on the high score page
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("end.html");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    audioElement.src = currentQuestion.audioSrc;
    audioElement.play();

    choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

// Add event listeners for answer choices
choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(10); // Increment score for a correct answer
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
};

// Display high score on the high-score page
document.addEventListener("DOMContentLoaded", () => {
    const highScoreDisplay = document.getElementById("highScore");
    if (highScoreDisplay) {
        const mostRecentScore = localStorage.getItem("mostRecentScore") || 0;
        highScoreDisplay.innerText = `Your Score: ${mostRecentScore}`;
    }
});
