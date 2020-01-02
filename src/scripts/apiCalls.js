import axios from 'axios';

function getUnsplashPhoto() {
  const unsplashBaseUrl = 'https://api.unsplash.com/photos/random?';
  const myClientId =
    'client_id=4469e676a2a92f3481a1546533824178cbf5eed9d773394924d93a70e77c6ab8';
  const collectionNumber = 'collections=1065861';
  const urlString = [unsplashBaseUrl, myClientId, collectionNumber].join('&');

  return axios.get(urlString);
}

function getWeather(userLat, userLon, tempScale) {
  const api = 'https://hickory-office.glitch.me/api.weather?';
  const lat = `lat=${userLat}`;
  const lon = `lon=${userLon}`;
  const units = `units=${tempScale === 'C' ? 'metric' : 'imperial'}`;
  const urlString = [api, lat, '&', lon, '&', units].join('');
  return axios.get(urlString);
}

function getIpInfoLocation() {
  return axios.get('https://ipinfo.io/geo').then((response) => {
    const latlon = response.data.loc.split(',');
    const userLocation = response.data;
    userLocation.lat = latlon[0];
    userLocation.lon = latlon[1];
    localStorage.setItem('userLocation', userLocation);
    localStorage.setItem('userLocationTimestamp', new Date().getTime());
    return userLocation;
  });
}

/*
Need to add/fix fallback HTML5 geolocation if ipinfo fails
*/

function getHtml5Location() {
  const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log({ position });
      if (!position) {
        return;
      }
      const userLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      localStorage.setItem('userLocation', userLocation);
      localStorage.setItem('userLocationTimestamp', new Date().getTime());
      resolve(userLocation);
    });
  });

  return promise;
}

function getLocation() {
  return getHtml5Location();
}

export { getUnsplashPhoto, getWeather, getLocation };
