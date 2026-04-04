let questions = [];
let currentIndex = 0;
let score = 0;

async function initQuiz() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        
        // ATTENTE DU CLIC SUR LE BOUTON
        document.getElementById('start-btn').onclick = () => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('quiz-content').classList.remove('hidden');
            showQuestion();
        };
    } catch (error) {
        document.getElementById('question-text').innerText = "Erreur de chargement.";
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById('chapter-name').innerText = q.chapter;
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, q.correctAnswer, q.context);
        container.appendChild(btn);
    });
    updateUI();
}

function checkAnswer(selected, correct, context) {
    const feed = document.getElementById('feedback');
    feed.classList.remove('hidden');
    if (selected === correct) {
        score++;
        feed.className = 'correct';
        feed.innerHTML = "✅ " + context;
    } else {
        feed.className = 'wrong';
        feed.innerHTML = "❌ " + context;
    }
    document.getElementById('next-btn').classList.remove('hidden');
}

function updateUI() {
    const percent = (currentIndex / questions.length) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    if (currentIndex < questions.length) showQuestion();
    else alert("Fin du quiz ! Score : " + score + "/" + questions.length);
};

initQuiz();
