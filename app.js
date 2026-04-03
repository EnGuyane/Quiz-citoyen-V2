let questions = [];
let currentIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const chapterName = document.getElementById('chapter-name');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const stats = document.getElementById('stats');

// Enregistrement du Service Worker pour le mode PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

async function initQuiz() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        // Mélanger les questions si besoin : questions.sort(() => Math.random() - 0.5);
        showQuestion();
    } catch (error) {
        questionText.innerText = "Erreur de chargement des questions.";
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    chapterName.innerText = q.chapter;
    questionText.innerText = q.question;
    feedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, q.correctAnswer, q.context);
        optionsContainer.appendChild(btn);
    });

    updateUI();
}

function checkAnswer(selected, correct, context) {
    const allButtons = document.querySelectorAll('.option');
    allButtons.forEach(b => b.disabled = true);

    feedback.classList.remove('hidden');
    if (selected === correct) {
        score++;
        feedback.className = 'correct';
        feedback.innerHTML = "<strong>✅ Correct !</strong><br>" + context;
    } else {
        feedback.className = 'wrong';
        feedback.innerHTML = "<strong>❌ Erreur.</strong><br>" + context;
    }
    nextBtn.classList.remove('hidden');
}

nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};

function updateUI() {
    const percent = ((currentIndex) / questions.length) * 100;
    progressBar.style.width = percent + "%";
    stats.innerText = `Question ${currentIndex + 1} / ${questions.length}`;
}

function showResult() {
    questionText.innerText = "Quiz Terminé !";
    optionsContainer.innerHTML = `<h3>Votre score : ${score} / ${questions.length}</h3>`;
    chapterName.innerText = "Résultat";
    nextBtn.innerText = "Recommencer";
    nextBtn.classList.remove('hidden');
    nextBtn.onclick = () => location.reload();
}

initQuiz();
