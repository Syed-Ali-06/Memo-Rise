const wordContainer = document.getElementById("wordContainer");
const submitBtn = document.getElementById("submitBtn");
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const arabicVerse = document.getElementById("arabicVerse");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let correctOrder = [];

let questions = [];

fetch("verses.json")
    .then(res => res.json())
    .then(loadedQuestions => {
        questions = loadedQuestions;
        startGame();
    })
    .catch(err => {
        console.error(err);
    });

const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        return window.location.assign("end.html");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    correctOrder = [...currentQuestion.words];
    
    // Display the Arabic verse
    arabicVerse.innerText = currentQuestion.arabic;

    const shuffledWords = [...currentQuestion.words]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    wordContainer.innerHTML = "";
    shuffledWords.forEach(word => {
        const wordBox = document.createElement("div");
        wordBox.classList.add("word-box");
        wordBox.draggable = true;
        wordBox.innerText = word;

        wordBox.addEventListener("dragstart", dragStart);
        wordBox.addEventListener("dragover", dragOver);
        wordBox.addEventListener("drop", dragDrop);

        wordContainer.appendChild(wordBox);
    });

    availableQuestions.splice(questionIndex, 1);
};

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.innerText);
    e.target.classList.add("dragging");
}

function dragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(wordContainer, e.clientX);
    const dragging = document.querySelector(".dragging");
    if (afterElement == null) {
        wordContainer.appendChild(dragging);
    } else {
        wordContainer.insertBefore(dragging, afterElement);
    }
}

function dragDrop(e) {
    e.target.classList.remove("dragging");
}

function getDragAfterElement(container, x) {
    const draggableElements = [
        ...container.querySelectorAll(".word-box:not(.dragging)")
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

submitBtn.addEventListener("click", () => {
    const arrangedWords = Array.from(wordContainer.children).map(
        wordBox => wordBox.innerText
    );
    const correctCount = arrangedWords.reduce(
        (count, word, index) => (word === correctOrder[index] ? count + 1 : count),
        0
    );

    alert(`You got ${correctCount} out of ${correctOrder.length} correct!`);

    getNewQuestion();
});
