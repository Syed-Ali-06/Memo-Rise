const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

const MAX_QUESTIONS = parseInt(localStorage.getItem('numQuestions')) || 10;
const CORRECT_BONUS = 10;

// Load questions based on the selected Juz
function loadQuestions() {
    const selectedJuz = localStorage.getItem('selectedJuz') || "1"; // Default to Juz 1

    fetch("previous.json")
        .then(res => res.json())
        .then(loadedQuestions => {
            if (loadedQuestions[selectedJuz]) {
                questions = loadedQuestions[selectedJuz];
                startGame();
            } else {
                console.error(`No questions found for Juz ${selectedJuz}`);
            }
        })
        .catch(err => {
            console.error('Error fetching questions:', err);
        });
}

// Start the game
function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];

    if (availableQuestions.length === 0) {
        console.error("No questions available.");
        return;
    }

    game.classList.remove("hidden");
    loader.classList.add("hidden");
    getNewQuestion();
}

// Fetch a new question
function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        window.location.assign("end.html");
        return;
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions.splice(questionIndex, 1)[0];

    if (question) {
        question.innerText = currentQuestion.question;
    }

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        if (number && currentQuestion["choice" + number]) {
            choice.innerText = currentQuestion["choice" + number];
        }
    });

    acceptingAnswers = true;
}

// Handle choice selection
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        if (!selectedAnswer) return;

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

// Increment the score
function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

// Load questions when the page loads
window.onload = loadQuestions;
