document.addEventListener('DOMContentLoaded', function() {
    let long = -33.86875308441044;
    let lat = 151.196779661934;
    var map = L.map('map').setView([long, lat], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);    

    var marker = L.marker([long, lat]).addTo(map);
});

// does not work, a separate method is needed