document.addEventListener('DOMContentLoaded', async () => {
    let quizData = [];
    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultElement = document.getElementById('result');

    async function fetchQuizData() {
        try {
            const response = await fetch('http://localhost:3000/api/quiz_questions');
            if (!response.ok) {
                throw new Error('Failed to fetch quiz data');
            }
            quizData = await response.json();
            shuffledQuestions = shuffleArray(quizData);
            showQuestion();
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    }

    function shuffleArray(array) {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function showQuestion() {
        if (currentQuestionIndex < shuffledQuestions.length && currentQuestionIndex < 15) {
            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            answersElement.innerHTML = '';
            const answers = [currentQuestion.answer1, currentQuestion.answer2, currentQuestion.answer3, currentQuestion.answer4];
            answers.forEach(answer => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.addEventListener('click', () => checkAnswer(answer, currentQuestion.correctAnswer));
                answersElement.appendChild(button);
            });
        } else {
            showResult();
        }
    }

    function checkAnswer(userAnswer, correctAnswer) {
        if (userAnswer === correctAnswer) {
            score++;
            resultElement.textContent = 'Правильно!';
            resultElement.style.color = 'green';
        } else {
            resultElement.textContent = `Не правильно. Правильна відповідь: ${correctAnswer}`;
            resultElement.style.color = 'red';
        }
        currentQuestionIndex++;
        showQuestion();
    }

    async function updateScoreQuiz(newScore) {
        try {
            const currentUserID = localStorage.getItem('currentUserID');
            if (!currentUserID) {
                console.error('No current user ID found in localStorage');
                return;
            }

            const response = await fetch('http://localhost:3000/api/updateScoreQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUserID, newScore: newScore })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Score_quiz updated successfully:', result);
            } else {
                const errorData = await response.json();
                console.error('Failed to update score_quiz:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function showResult() {
        questionElement.textContent = `Вікторину завершено! Ваш рахунок ${score} з 15.`;
        updateScoreQuiz(score);
        answersElement.innerHTML = '';
        resultElement.textContent = '';

        const mainMenuButton = document.createElement('button');
        mainMenuButton.textContent = 'Main Menu';
        mainMenuButton.addEventListener('click', () => {
            location.href = 'Menu.html';
        });
        answersElement.appendChild(mainMenuButton);

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            shuffledQuestions = shuffleArray(quizData);
            showQuestion();
        });
        answersElement.appendChild(restartButton);
    }

    // Ініціалізація
    await fetchQuizData();
});