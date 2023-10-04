"use strict";

document.addEventListener("DOMContentLoaded", function(){

    let lon = -79.42; 
    let lat = 43.67;
    let target = "Toronto";
    let map;
    let markerGroup = L.layerGroup(); // Create a layer group for markers

    const getCurrentLocation = document.getElementById('currentLocation')
    const loadingSpinner = document.getElementById('loading-spinner');

    const searchInput = document.querySelector('.search-input');
    const get_city = document.getElementById('city');
    const get_degrees= document.getElementById('degrees');
    const get_date = document.getElementById('date');
    const get_icon = document.getElementById('weather-icon');
    const get_country = document.getElementById('country-Name');
    const get_lat = document.getElementById('lat');
    const get_lon = document.getElementById('lon');
    const get_last_updated_time = document.getElementById('lastUpdated');
    const get_speed = document.getElementById('wind-speed');
    const get_dir = document.getElementById('wind-dir');
    const get_feels_like = document.getElementById('feels-like');
    const get_precip = document.getElementById('precip');
    const get_uv = document.getElementById('uv');
    const get_vis = document.getElementById('visibility');
    const get_condition = document.getElementById('condition-text');
    
    const fetchData = async(target)=>{
        try{

            const url = `https://api.weatherapi.com/v1/current.json?key=1ce93c39566b4c0491c103042230310&q=${target}`
            const response = await fetch(url)
        
            if (!response.ok) {
                handleFetchError(response.status);
                return;
            }
            const data = await response.json()
            storeData(data)
        }
        catch(error){
            console.error('Error fetching data:', error);
        }finally {
            // Hide the loading spinner when data is fetched (whether successful or not)
            loadingSpinner.style.display = 'none';
        }
        
    
    }

    const handleFetchError = (statusCode) => {
        if (statusCode === 400) {
            alert('Location not found. Please enter a valid city or country name.');
        } else {
            throw new Error('Failed to fetch data. Please try again later.');
        }
    };
    

    const storeData = (data) => {
        
        const { location, current } = data;

        updateDom(
            location.country,
            location.localtime,
            current.temp_c,
            current.condition.icon,
            current.condition.text,
            location.name,
            location.localtime,
            location.lon,
            location.lat,
            current.wind_kph,
            current.wind_dir,
            current.vis_km,
            current.feelslike_c,
            current.uv,
            current.precip_mm
        );
    };
    
     // Creating the map 
     map = L.map('map').setView([lat, lon], 13);
     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 9,
       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
     }).addTo(map);

    const updateDom = (
        country,
        last_update,
        temp,
        icon,
        currentCondition,
        city,
        localTime,
        lon,
        lat,
        windSpeed,
        windDir,
        visibility,
        feelsLike,
        uv,
        pre
    ) => {
        // Setting top weather container
        get_city.innerHTML = `${city}`;
        get_degrees.innerHTML = `${temp}°C`;
        get_date.innerHTML = `Date-Time: ${localTime}`;
        get_icon.setAttribute('src', icon);
        get_condition.innerText = `${currentCondition}`;

        // Setting left container -> Location Details
        get_country.innerText = `${country}`;
        get_lon.innerText = `${lon}`;
        get_lat.innerText = `${lat}`;

        // Setting right container - Weather Details
        get_last_updated_time.innerText = `Last Updated: ${last_update}`;
        get_speed.innerText = `${windSpeed} km/h`;
        get_dir.innerText = `${windDir}`;
        get_feels_like.innerText = `${feelsLike}°C`;
        get_precip.innerText = `${pre} mm`;
        get_uv.innerText = `${uv}`;
        get_vis.innerText = `${visibility} km`;

        // Clear previous markers from the layer group
        markerGroup.clearLayers();

        // Add the new marker to the layer group and then to the map
        const marker = L.marker([lat, lon]);
        markerGroup.addLayer(marker);
        map.addLayer(markerGroup);
 
        // Update the map view to the new marker's position
        map.setView([lat, lon]);
    };

    fetchData(target)

    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
        const inputValue = searchInput.value.trim().toLowerCase();
            if (inputValue !== '') {
                fetchData(inputValue); // Call the fetchData function with the entered city name
            }
        }
    });

    getCurrentLocation.addEventListener("click", function(){
        getUserLocation()
    })
   

    // Function to get user's current location
    function getUserLocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                target = `${lat},${lon}`;
                fetchData(target)
            },function (error) {
                console.error('Error getting user location:', error);
                target = "Canada"
                fetchData(target)
            });
            // Show the loading spinner while fetching the current location data
            loadingSpinner.style.display = 'block';
        } else {
            alert('Geolocation is not supported by your browser. Please enter a location manually.');
        }
    }
 
});


