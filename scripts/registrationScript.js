document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const requestData = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            score_fast: 0,
            score_quiz: 0,
            score_flag: 0
        };

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                console.log("Данные сохранены в MongoDB");
                alert('Успішна реєстрація');
                form.reset();
            } else {
                console.log("Ошибка сохранения данных в MongoDB");
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Failed to create user');
        }
    }

    form.addEventListener('submit', onSubmit);
});