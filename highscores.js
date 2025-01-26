const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

if (!highScoresList) {
  console.error("Element with id 'highScoresList' not found in the DOM.");
} else if (highScores.length === 0) {
  highScoresList.innerHTML = "<li>No high scores yet!</li>";
} else {
  highScoresList.innerHTML = highScores
    .map(score => `<li class="high-score">${score.name} - ${score.score}</li>`)
    .join("");
}
