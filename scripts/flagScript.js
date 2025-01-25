let countriesData = {};
let scoreFlag = 0;
let remainingFlags = 10;

async function loadCountries() {
    try {
        const response = await fetch('/GeoM-1.2/databaseRecover/countries.json');
        if (!response.ok) {
            throw new Error(`Ошибка загрузки JSON: ${response.status}`);
        }
        countriesData = await response.json();
        generateGame();
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Генерация игры
function generateGame() {
    if (remainingFlags === 0) {
        endGame();
        return;
    }

    const keys = Object.keys(countriesData);
    const randomKey = getRandomElement(keys);
    const correctCountry = countriesData[randomKey];
    const flagPath = `/GeoM-1.2/flagssvg/${randomKey}.svg`;

    // Добавление флага
    const flagContainer = document.querySelector(".flag-container");
    flagContainer.innerHTML = `<img src="${flagPath}" alt="Flag of ${correctCountry.name[0]}" />`;

    // Генерация вариантов ответа
    const buttonContainer = document.querySelector(".button-container");
    buttonContainer.innerHTML = "";

    const options = new Set([correctCountry.name[0]]);
    while (options.size < 3) {
        const randomOption = getRandomElement(keys);
        options.add(countriesData[randomOption].name[0]);
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    // Создание кнопок
    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => handleAnswer(option, correctCountry.name[0]));
        buttonContainer.appendChild(button);
    });
}

// Проверка ответа
function handleAnswer(selectedOption, correctOption) {
    const resultContainer = document.querySelector(".result");
    if (selectedOption === correctOption) {
        resultContainer.textContent = "Правильно! 🎉";
        scoreFlag++;
        
    } else {
        resultContainer.textContent = `Неправильно. Правильна відповідь: ${correctOption}`;
    }

    remainingFlags--;
    setTimeout(() => {
        resultContainer.textContent = "";
        generateGame();
    }, 2000);
}

function endGame() {
    const flagContainer = document.querySelector(".flag-container");
    const buttonContainer = document.querySelector(".button-container");
    const resultContainer = document.querySelector(".result");
    updateScoreFlag(scoreFlag);
    flagContainer.innerHTML = "";
    buttonContainer.innerHTML = "";
    resultContainer.textContent = `Гру закінчено ваш рахунок: ${scoreFlag}!`;
}

async function updateScoreFlag(newScore) {
    try {
        const currentUserID = localStorage.getItem('currentUserID');
        if (!currentUserID) {
            console.error('No current user ID found in localStorage');
            return;
        }

        const response = await fetch('http://localhost:3000/api/updateScoreFlag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: currentUserID, newScore })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Score_flag updated successfully:', result);
        } else {
            const errorData = await response.json();
            console.error('Failed to update score_flag:', errorData);
        }
    } catch (error) {
        console.error('Error updating score_flag:', error);
    }
}

document.addEventListener("DOMContentLoaded", loadCountries);