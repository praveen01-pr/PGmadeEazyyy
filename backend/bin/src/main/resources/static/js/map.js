// Initialize Leaflet.js map
function initializeMap(containerId, latitude, longitude, zoom) {
    // Create the map
    const map = L.map(containerId, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: true,
        attributionControl: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors',
        maxZoom: 18,
        subdomains: ['a', 'b', 'c'],
        detectRetina: true
    }).addTo(map);

    // Add marker for the property
    const marker = L.marker([latitude, longitude], {
        icon: L.icon({
            iconUrl: '/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        })
    }).addTo(map)
        .bindPopup('Property Location', {
            closeButton: true,
            autoClose: false,
            closeOnClick: false
        })
        .openPopup();

    // Add zoom controls
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add scale control
    L.control.scale().addTo(map);

    // Add full screen control
    L.control.fullscreen().addTo(map);

    // Add layer control (for different map styles)
    const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ' OpenStreetMap contributors'
        }),
        "OpenStreetMap (Black & White)": L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            attribution: ' OpenStreetMap contributors'
        })
    };

    L.control.layers(baseMaps).addTo(map);

    // Add mouse position control
    L.control.mousePosition().addTo(map);

    // Add search control
    const searchControl = L.control.search({
        position: 'topleft',
        layer: marker,
        propertyName: 'title',
        marker: false
    }).addTo(map);

    // Add custom controls
    const customControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'custom-control');
            container.innerHTML = '<button class="btn btn-sm btn-primary" onclick="findMyLocation()">Find My Location</button>';
            return container;
        }
    });
    customControl.addTo(map);

    // Add geolocation functionality
    function findMyLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                map.setView([lat, lon], 15);
                L.marker([lat, lon], {
                    icon: L.icon({
                        iconUrl: '/images/current-location.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34]
                    })
                }).addTo(map)
                    .bindPopup('Your Location')
                    .openPopup();
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    return map;
}

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('property-map');
    if (mapContainer) {
        const latitude = parseFloat(mapContainer.dataset.latitude);
        const longitude = parseFloat(mapContainer.dataset.longitude);
        const zoom = parseInt(mapContainer.dataset.zoom);
        
        if (!isNaN(latitude) && !isNaN(longitude)) {
            initializeMap('property-map', latitude, longitude, zoom);
        }
    }
});
