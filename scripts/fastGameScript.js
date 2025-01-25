document.addEventListener("DOMContentLoaded", () => {
    const TIMER_DURATION = 60000;
    const CORRECT_COLOR = "green";
    const INCORRECT_COLOR = "red";
    const DEFAULT_COLOR = "#ececec";
    let score = 0;
    let timer = null;

    function getCountry() {
        const rand = Math.floor(Math.random() * 469);
        const country = document.querySelectorAll(".allPaths");
        document.getElementById("nation").textContent = country[rand].getAttribute("id");
    }

    function startTimer() {
        const startTime = Date.now();
        updateTimer(startTime);
        timer = setTimeout(() => {
            document.getElementById("Mes").style.display = "block";
            document.getElementById("score").textContent = score;
        }, TIMER_DURATION);
    }

    function handleMouseOver(event) {
        event.target.style.fill = "pink";
    }

    function handleMouseLeave(event) {
        event.target.style.fill = DEFAULT_COLOR;
    }

    async function updateScoreFast(newScore) {
        try {
            const currentUserID = localStorage.getItem('currentUserID');
            if (!currentUserID) {
                console.error('No current user ID found in localStorage');
                return;
            }

            const response = await fetch('http://localhost:3000/api/updateScoreFast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: currentUserID, newScore: newScore }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Score_fast updated successfully:', result);
            } else {
                const errorData = await response.json();
                console.error('Failed to update score_fast:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function updateTimer(startTime) {
        const timerElement = document.getElementById("timerValue");
        let timeLeft = TIMER_DURATION / 1000 - Math.floor((Date.now() - startTime) / 1000);
        if (timeLeft < 0) {
            timeLeft = 0;
            clearTimeout(timer);
            document.querySelector(".message").classList.add("show-message");
            document.getElementById("score").textContent = score;
            updateScoreFast(score);
        } else {
            timerElement.textContent = timeLeft;
            requestAnimationFrame(() => updateTimer(startTime));
        }
    }

    function restartGame() {
        score = 0;
        location.reload();
        document.getElementById("Mes").style.display = "none";
    }

    function handleClick(event) {
        clearTimeout(timer);
        const nation = document.getElementById("nation").textContent;
        if (event.target.id === nation) {
            score++;
            event.target.style.fill = CORRECT_COLOR;
        } else {
            event.target.style.fill = INCORRECT_COLOR;
        }
        getCountry();
    }

    function init() {
        const allPaths = document.querySelectorAll(".allPaths");
        allPaths.forEach((element) => {
            element.addEventListener("mouseover", handleMouseOver);
            element.addEventListener("mouseleave", handleMouseLeave);
            element.addEventListener("click", handleClick);
        });

        document.getElementById("restart").addEventListener("click", restartGame);

        getCountry();
        startTimer();
    }

    init();
});