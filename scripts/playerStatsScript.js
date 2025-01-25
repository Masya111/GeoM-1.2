document.addEventListener('DOMContentLoaded', () => {
    const statsButton = document.getElementById('statsButton');
    const closeButton = document.getElementsByClassName('close')[0];
    const statsModal = document.getElementById('statsModal');
    const table = document.getElementById('playerTable');

    async function showStats() {
        try {
            const response = await fetch('http://localhost:3000/api/player_stats');
            if (!response.ok) {
                throw new Error('Failed to fetch player stats');
            }
            const players = await response.json();

            // Сортування гравців за сумою балів
            players.sort((a, b) => (b.score_fast + b.score_flag + b.score_quiz) - (a.score_fast + a.score_flag + a.score_quiz));

            // Очищення таблиці перед виведенням нових даних
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            // Додавання рядків з даними гравців у таблицю
            players.forEach(player => {
                const row = table.insertRow(-1);
                row.insertCell(0).textContent = player.name;
                row.insertCell(1).textContent = player.score_fast;
                row.insertCell(2).textContent = player.score_flag;
                row.insertCell(3).textContent = player.score_quiz;
            });

            statsModal.style.display = 'block'; // Показати модальне вікно
        } catch (error) {
            console.error('Error fetching player stats:', error);
            alert('Failed to fetch player stats');
        }
    }

    function closeStats() {
        statsModal.style.display = 'none'; // Закрити модальне вікно
    }

    // Прив'язка обробників подій
    statsButton.addEventListener('click', showStats);
    closeButton.addEventListener('click', closeStats);
});