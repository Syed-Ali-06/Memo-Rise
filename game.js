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

// Retrieve the number of questions from localStorage, with a fallback to 10 if not set
const MAX_QUESTIONS = parseInt(localStorage.getItem('numQuestions')) || 5;
const CORRECT_BONUS = 10;

// Function to load questions based on the selected Juz
function loadQuestions() {
    const selectedJuz = localStorage.getItem('selectedJuz') || 1; // Default to Juz 1 if none selected

    fetch("questions.json")
        .then(res => res.json())
        .then(loadedQuestions => {
            console.log('Loaded Questions:', loadedQuestions); // Log the entire JSON object

            if (selectedJuz && loadedQuestions[selectedJuz]) {
                questions = loadedQuestions[selectedJuz];
                console.log(`Questions for Juz ${selectedJuz}:`, questions); // Log the filtered questions
            } else {
                console.error(`No questions found for Juz ${selectedJuz}`);
                questions = []; // Ensure questions is an empty array if no questions are found
            }

            startGame(); // Start the game after questions are loaded
        })
        .catch(err => {
            console.error('Error fetching questions:', err);
        });
}

startGame = () => {
    questionCounter = 0;
    score = 0;
    if (questions.length === 0) {
        console.error('No questions available to start the game.');
        return;
    }
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("end.html");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply == "correct") {
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

loadQuestions();

