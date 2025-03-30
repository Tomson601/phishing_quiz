let userData = {};
let score = 0;
let usedQuestions = [];
const backendUrl = "https://tomson601.pythonanywhere.com";
const localhostUrl = "http://kniupp.northeurope.cloudapp.azure.com:5000";

const questions = [
    { text: "Czy jest to oszustwo?", image: "sites/allegro-fake.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/binance_sms.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/ipko_legit.png", answer: false },
    { text: "Czy jest to oszustwo?", image: "sites/ipko1.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/ipko2.jpg", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/phishing-sms-doplata.jpeg", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/phishing-sms-pieniadze.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/PP.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/steam_scam.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/steam_scam.webp", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/xiaomi_scam.png", answer: true },
    { text: "Czy jest to oszustwo?", image: "sites/steam_legit.png", answer: false },
    { text: "Czy jest to oszustwo?", image: "sites/legit_PP.webp", answer: false }
];

function startQuiz() {
    if (!validateForm()) {
        return;
    }

    userData.name = document.getElementById("name").value;
    userData.age = document.getElementById("age").value;
    userData.school = document.getElementById("school").value;

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    loadQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchRanking();
});

function getRandomQuestion() {
    if (usedQuestions.length === questions.length) {
        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("end-screen").style.display = "block";
        document.getElementById("final-score").textContent = score;
        saveResults();
        return null;
    }
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (usedQuestions.includes(randomIndex));
    usedQuestions.push(randomIndex);
    return questions[randomIndex];
}

function loadQuestion() {
    const questionData = getRandomQuestion();
    if (!questionData) return;
    document.getElementById("question").textContent = questionData.text;
    document.getElementById("quiz-image").src = questionData.image;
    document.getElementById("quiz-image").dataset.answer = questionData.answer;
}

function answer(response) {
    const buttons = document.querySelectorAll(".buttons button");
    buttons.forEach((btn) => (btn.disabled = true)); // Blokada przycisków

    const correctAnswer = document.getElementById("quiz-image").dataset.answer === "true";
    const feedbackElement = document.getElementById("feedback");

    if (response === correctAnswer) {
        score++;
        feedbackElement.textContent = "✅ Dobra odpowiedź!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "❌ Zła odpowiedź!";
        feedbackElement.style.color = "red";
    }

    document.getElementById("score").textContent = score;

    // Po 1,5 sekundy ukrywa komunikat
    setTimeout(() => {
        feedbackElement.textContent = "";
        buttons.forEach((btn) => (btn.disabled = false)); // Odblokowanie przycisków
        loadQuestion();
    }, 1500);
}

function restartQuiz() {
    score = 0;
    usedQuestions = [];
    document.getElementById("score").textContent = score;
    document.getElementById("final-score").textContent = "0";

    document.getElementById("end-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    loadQuestion();
}

function saveResults() {
    userData.score = score;

    fetch(`${localhostUrl}/save_result`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Dane zapisane:", data);
            fetchRanking();
        })
        .catch((error) => console.error("Błąd zapisu:", error));
}

function returnToForm() {
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "block";

    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("school").value = "";

    score = 0;
    usedQuestions = [];
    document.getElementById("score").textContent = score;
    document.getElementById("final-score").textContent = "0";

    fetchRanking();
}

function fetchRanking() {
    fetch(`${localhostUrl}/get_top_players`)
        .then((response) => response.json())
        .then((data) => {
            const rankingList = document.getElementById("ranking-list");
            rankingList.innerHTML = "";

            if (data.length === 0) {
                rankingList.innerHTML = "<li>Brak danych</li>";
                return;
            }

            data.forEach((player) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${player.name} - ${player.score} pkt`;
                rankingList.appendChild(listItem);
            });
        })
        .catch((error) => console.error("Błąd pobierania rankingu:", error));
}

function validateForm() {
    const name = document.getElementById("name").value.trim();
    if (name === "") {
        alert("Proszę podać swoje imię (nick).");
        return false;
    }
    return true;
}
