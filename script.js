document.getElementById('location-form').addEventListener('submit', getWeather);

function getWeather(e) 
{
    e.preventDefault();
    
    const location = document.getElementById('location-input').value;
    const apiKey = '4f67b045924dee17aa810e460224e313';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const mapurl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    //console.log(mapurl);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherResult = `
                    <h2>${data.name}</h2>
                    <p>Temperature: ${data.main.temp} °C</p>
                    <p>Humidity: ${data.main.humidity} %</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                document.getElementById('weather-result').innerHTML = weatherResult;

                //Map script =>
                fetch(mapurl)
                .then(responce => responce.json())
                .then(mapdata => {
                    if(mapdata.length > 0)
                    {
                        const{ lat, lon} = mapdata[0];
                        // console.log(lat);
                        // console.log(lon);
                        const map = L.map('map').setView([lat, lon], 13);
                        //console.log(map);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'                            
                        }).addTo(map);

                        L.Marker([lat, lon]).addTo(map)
                            .bindpopup(`<b>${data.name}</b><br>${data.main.temp} °C`).openPopup();
                    }
                    else
                    {
                        console.error('This'.location-input,'is Not Found',error);
                    }
                })
                .catch(error => console.error('Not Get Map DATA',error));
            } else {
                document.getElementById('weather-result').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => console.error('Error fetching the weather data:', error));
}
