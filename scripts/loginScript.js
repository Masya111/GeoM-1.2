document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('message');

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const requestData = {
            username: formData.get("username"),
            password: formData.get("password")
        };

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Успшний вхід:", data);
                successfulLogin(data.userId);
            } else {
                const errorData = await response.json();
                console.log("Помилка входу:", errorData);
                message.innerText = errorData.message;
            }
        } catch (error) {
            console.error('Помилка:', error);
            message.innerText = 'Помилка при вході';
        }
    }

    function successfulLogin(userId) {
        message.innerText = 'Успішний вхід';
        localStorage.setItem('currentUserID', userId);
        window.location = "Menu.html";
    }

    form.addEventListener('submit', onSubmit);
});