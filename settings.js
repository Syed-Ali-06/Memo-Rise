// Save settings elements
const numQuestionsInput = document.getElementById('numQuestions');
const saveSettingsButton = document.getElementById('saveSettings');
const clearHighScoresButton = document.getElementById('clearHighScores');
const juzSelection = document.getElementById('juz-selection');

// Load saved settings on page load
window.onload = () => {
    // Load number of questions
    const savedNumQuestions = localStorage.getItem('numQuestions');
    if (savedNumQuestions) {
        numQuestionsInput.value = savedNumQuestions;
    }

    // Load Juz selection
    const savedJuz = localStorage.getItem('selectedJuz');
    if (savedJuz) {
        juzSelection.value = savedJuz;
    }

    // Populate the Juz dropdown
    populateJuzDropdown();
};

// Populate Juz dropdown
function populateJuzDropdown() {
    for (let i = 1; i <= 30; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Juz ${i}`;
        juzSelection.appendChild(option);
    }
}

// Save settings
saveSettingsButton.addEventListener('click', () => {
    const numQuestions = numQuestionsInput.value;
    const selectedJuz = juzSelection.value;

    // Save to localStorage
    localStorage.setItem('numQuestions', numQuestions);
    localStorage.setItem('selectedJuz', selectedJuz);

    alert('Settings saved!');
});

// Clear high scores
clearHighScoresButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all high scores?')) {
        localStorage.removeItem('highScores');
        alert('High scores cleared!');
    }
});

// Navigate back to home
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'home.html';
});