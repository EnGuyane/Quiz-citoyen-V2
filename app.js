let questions = [];
let currentIndex = 0;
let score = 0;

async function initQuiz() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        
        // On active le bouton de démarrage
        document.getElementById('start-btn').onclick = () => {
            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('quiz-content').style.display = 'block';
            showQuestion();
        };
    } catch (error) {
        document.getElementById('question-text').innerText = "Erreur de chargement des questions.";
        console.error(error);
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById('chapter-name').innerText = q.chapter;
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('stats').innerText = `Question ${currentIndex + 1} / ${questions.length}`;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.style.padding = "12px";
        btn.style.textAlign = "left";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #ddd";
        btn.style.borderRadius = "8px";
        btn.style.backgroundColor = "white";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, q.correctAnswer, q.context);
        container.appendChild(btn);
    });

    const percent = (currentIndex / questions.length) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
}

function checkAnswer(selected, correct, context) {
    const btns = document.querySelectorAll('#options-container button');
    btns.forEach(b => b.disabled = true);

    const feed = document.getElementById('feedback');
    feed.style.display = 'block';
    
    if (selected === correct) {
        score++;
        feed.style.backgroundColor = "#d4edda";
        feed.style.color = "#155724";
        feed.innerHTML = "<strong>✅ Correct !</strong><br>" + context;
    } else {
        feed.style.backgroundColor = "#f8d7da";
        feed.style.color = "#721c24";
        feed.innerHTML = "<strong>❌ Erreur.</strong><br>" + context;
    }
    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        alert(`Quiz terminé ! Votre score : ${score} / ${questions.length}`);
        location.reload();
    }
};

initQuiz();
