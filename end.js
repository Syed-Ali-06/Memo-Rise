const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
if (!mostRecentScore) {
  console.error("No recent score found in localStorage.");
  finalScore.innerText = "No recent score available!";
} else {
  finalScore.innerText = mostRecentScore;
}


const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
    
});


saveHighScore = e => {
  e.preventDefault();

  // Use the most recent score instead of generating a random score
  const score = {
    score: parseInt(mostRecentScore), // Ensure it's an integer
    name: username.value.trim(), // Trim whitespace from the username
  };

  // Add the new score, sort, and keep only the top 5
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score); // Sort in descending order
  highScores.splice(MAX_HIGH_SCORES); // Keep only the top 5 scores

  // Save updated high scores to localStorage
  localStorage.setItem("highScores", JSON.stringify(highScores));

  // Redirect to the home page or high scores page
  window.location.assign("/");
};
