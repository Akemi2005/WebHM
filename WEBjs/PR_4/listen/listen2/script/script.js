document.addEventListener('DOMContentLoaded', getMyLocation)

let watchId = null;

let ourCoords = {
    latitude: 48.92289576884852,
    longitude: 24.694006206747247
}; 
let map;
let destinationMarker;

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, displayError);
        var watchButton = document.getElementById('watch');
        watchButton.onclick = watchLocation;
        var clearWatchButton = document.getElementById('clearWatch');
        clearWatchButton.onclick = clearWatch;
        var scrollButton = document.getElementById('scrollToDestination');
        scrollButton.onclick = scrollToDestination;
    } else {
        alert("Oops, no geolocation support");
    }
}

function displayLocation(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let div = document.getElementById("location");
    div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`;
    div.innerHTML += `(with ${position.coords.accuracy} meters accuracy)`
    let km = computeDistance(position.coords, ourCoords);
    let distance = document.getElementById("distance");
    distance.innerHTML = `You are ${km} km from the College`;

    if (!map) {
        map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    if (destinationMarker) {
        map.removeLayer(destinationMarker);
    }

    destinationMarker = L.marker([latitude, longitude])
        .bindPopup(`Your location<br>Coordinates: ${latitude}, ${longitude}<br>Time: ${new Date(position.timestamp).toLocaleString()}`)
        .openPopup();
    
    destinationMarker.addTo(map);
}

function watchLocation() {
    watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
}

function clearWatch() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function scrollToDestination() {
    let destLatitude = parseFloat(prompt("Enter destination latitude:"));
    let destLongitude = parseFloat(prompt("Enter destination longitude:"));

    if (!isNaN(destLatitude) && !isNaN(destLongitude)) {
        if (destinationMarker) {
            destinationMarker.removeFrom(map);
        }
        destinationMarker = L.marker([destLatitude, destLongitude])
            .bindPopup(`Destination<br>Coordinates: ${destLatitude}, ${destLongitude}`)
            .openPopup();

        map.panTo([destLatitude, destLongitude]);
    } else {
        alert("Invalid input. Please enter valid coordinates.");
    }
}

function displayError(error) {
    const errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position is not available",
        3: "Request timed out"
    };
    let errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.message;
    }
    let div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
    let startLatRads = degreesToRadians(startCoords.latitude);
    let startLongRads = degreesToRadians(startCoords.longitude);
    let destLatRads = degreesToRadians(destCoords.latitude);
    let destLongRads = degreesToRadians(destCoords.longitude);
    let Radius = 6371;
    let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) *
        Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians(degrees) {
    let radians = (degrees * Math.PI) / 180;
    return radians;
}

function setMarker() {
    let markerLatitude = parseFloat(prompt("Enter marker latitude:"));
    let markerLongitude = parseFloat(prompt("Enter marker longitude:"));

    if (!isNaN(markerLatitude) && !isNaN(markerLongitude)) {
        const customMarker = L.marker([markerLatitude, markerLongitude])
            .bindPopup(`Custom Marker<br>Coordinates: ${markerLatitude}, ${markerLongitude}`)
            .openPopup();

        customMarker.addTo(map);
    } else {
        alert("Invalid input. Please enter valid coordinates.");
    }
}

document.getElementById('setMarker').addEventListener('click', setMarker);