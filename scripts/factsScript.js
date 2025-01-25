document.addEventListener("DOMContentLoaded", () => {
    const countryFactsElement = document.getElementById("countryFacts");
    const nameElement = document.getElementById("name");
    const allPaths = document.querySelectorAll(".allPaths");

    async function getUser(place) {
        try {
            const response = await fetch(`http://localhost:3000/api/facts?place=${encodeURIComponent(place)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const country = await response.json();
            if (country) {
                const countryFacts = country.facts.join('<br>');
                countryFactsElement.innerHTML = `<strong>${place}</strong>:<br>${countryFacts}`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleMouseOver(event) {
        window.onmousemove = (j) => {
            let x = j.clientX;
            let y = j.clientY;
            nameElement.style.top = y - 60 + 'px';
            nameElement.style.left = x + 10 + 'px';
        };

        const classes = event.target.className.baseVal.replace(/ /g, '.');
        document.querySelectorAll(`.${classes}`).forEach(country => {
            country.style.fill = "pink";
        });
        nameElement.style.opacity = 1;
        nameElement.innerText = event.target.id;
    }

    function handleMouseLeave(event) {
        const classes = event.target.className.baseVal.replace(/ /g, '.');
        document.querySelectorAll(`.${classes}`).forEach(country => {
            country.style.fill = "#ececec";
        });
        nameElement.style.opacity = 0;
    }

    function handleClick(event) {
        getUser(event.target.id);
    }

    function setupEventListeners() {
        allPaths.forEach(path => {
            path.setAttribute('class', `allPaths ${path.id}`);
            path.addEventListener("mouseover", handleMouseOver);
            path.addEventListener("mouseleave", handleMouseLeave);
            path.addEventListener("click", handleClick);
        });
    }

    setupEventListeners();
});