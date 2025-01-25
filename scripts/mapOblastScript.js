document.addEventListener('DOMContentLoaded', async () => {
    const map = L.map('map', {
        zoomControl: false
    });
    const regionNameElement = document.getElementById('regionName');
    let currentQuestion = null;
    let questions = [];
    let score = 0;

    async function fetchQuestions() {
        try {
            const response = await fetch('http://localhost:3000/api/ukraine_questions');
            if (!response.ok) {
                throw new Error('Failed to fetch questions data');
            }
            questions = await response.json();
            currentQuestion = questions[0];
            regionNameElement.textContent = currentQuestion.question;
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    async function loadGeoJson() {
        try {
            const response = await fetch('ukraine_regions.geojson');
            if (!response.ok) {
                throw new Error('Failed to fetch GeoJSON data');
            }
            const geoJsonData = await response.json();

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const geoJsonLayer = L.geoJSON(geoJsonData, {
                style: function (feature) {
                    return {
                        color: 'blue',
                        weight: 2,
                        fillOpacity: 0
                    };
                },
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        answerQuestion(layer, currentQuestion.correctAnswer);
                        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
                        regionNameElement.textContent = currentQuestion.question;
                    });
                }
            }).addTo(map);

            map.fitBounds(geoJsonLayer.getBounds());
        } catch (error) {
            console.error('Error loading GeoJSON:', error);
        }
    }

    function highlightRegion(layer, color) {
        layer.setStyle({
            fillColor: color,
            fillOpacity: 0.5
        });
    }

    function unhighlightRegion(layer) {
        layer.setStyle({
            fillColor: 'transparent',
            fillOpacity: 0
        });
    }

    function answerQuestion(layer, correctAnswer) {
        if (layer.feature.properties.name === correctAnswer) {
            highlightRegion(layer, 'green');
            score++;
        } else {
            highlightRegion(layer, 'red');
        }

        setTimeout(() => {
            unhighlightRegion(layer);
        }, 1000);
    }

    // Ініціалізація
    await fetchQuestions();
    await loadGeoJson();
});