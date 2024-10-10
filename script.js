// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Centered on the world
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Load the data
let eventsData = [];
fetch('events.json')
    .then(response => response.json())
    .then(data => {
        eventsData = data;
        updateMap(250); // Initialize with the first date
    })
    .catch(error => console.error('Error loading events data:', error));

// Create a slider
const slider = document.getElementById('slider');
noUiSlider.create(slider, {
    start: [250],
    step: 1,
    range: {
        'min': 224,
        'max': 1945
    },
    format: {
        to: value => Math.round(value),
        from: value => Number(value)
    }
});

slider.noUiSlider.on('update', function (values) {
    const selectedYear = values[0];
    updateMap(selectedYear);
});

// Filter function
const filterSelect = document.getElementById('filter');
filterSelect.addEventListener('change', () => {
    const selectedYear = slider.noUiSlider.get();
    updateMap(selectedYear);
});

// Function to update map markers based on selected year and filter
function updateMap(year) {
    const selectedType = filterSelect.value;
    const filteredEvents = eventsData.filter(event =>
        event.date <= year && (selectedType === 'all' || event.type === selectedType)
    );

    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add new markers
    filteredEvents.forEach(event => {
        const marker = L.marker(getCoordinates(event.place)).addTo(map);
        marker.bindPopup(`<strong>${event.place}</strong><br>${event.event} (${event.date} C.E.)`);
    });
}

// A function to convert place names to coordinates
function getCoordinates(place) {
    const coordinates = {
        "Carthage": [36.85, 10.33],
        "Italy": [41.87, 12.56],
        "Jerusalem": [31.77, 35.23],
        "Persia": [32.4279, 53.6880],
        "Milan": [45.4642, 9.1900],
        "Alexandria": [31.2156, 29.9553],
        "Minorca": [39.9578, 4.0892],
        "Ipahan": [32.6525, 51.6692],
        "Antioch": [36.2021, 37.1343],
        "Daphne": [33.5041, 36.2431],
        "Ravenna": [44.4184, 12.2035],
        "France": [46.6034, 1.8883],
        "Spain": [40.4168, -3.7038],
        "Byzantium": [41.0082, 28.9784],
        "Hungary": [47.1625, 19.5033],
        "Germany": [51.1657, 10.4515],
        "England": [52.3555, -1.1743],
        "Ukraine": [48.3794, 31.1656],
        "Lithuania": [55.1694, 23.8813],
        "Poland": [51.9194, 19.1451],
        "Russia": [61.5240, 105.3188],
        "Bohemia": [50.0755, 14.4378],
        "Vienna": [48.2082, 16.3738],
        "Portugal": [39.3999, -8.2245],
        "Lisbon": [38.7169, -9.1399],
        "Strasbourg": [48.5734, 7.7521],
        "Prague": [50.0755, 14.4378],
        "Munich": [48.1351, 11.5820],
        "Bucharest": [44.4268, 26.1025]
        // Add more locations as needed
    };
    return coordinates[place] || [0, 0]; // Default to (0, 0) if not found
}
