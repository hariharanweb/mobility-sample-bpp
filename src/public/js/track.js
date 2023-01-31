function displayRoute(origin, destination, service, display) {
  service
    .route({
      origin,
      destination,
      /* eslint-disable no-undef */
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
    })
    .then((result) => {
      display.setDirections(result);
    })
    .catch((e) => {
    /* eslint-disable no-console */
      console.log(`Could not display directions due to: ${e}`);
    });
}

function initMap() {
  const myLatLng = { lat: 28.58075095435382, lng: 77.27438995055431 };
  const startPoint = '28.572886028444636, 77.32493318610665';
  const endPoint = '28.553696510813637, 77.21231247943025';
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myLatLng,
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: document.getElementById('panel'),
  });
  const image = 'https://img.icons8.com/emoji/30/automobile.png';
  /* eslint-disable no-new */
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: 'Your Ride is here',
    icon: image,
  });

  displayRoute(startPoint, endPoint, directionsService, directionsRenderer);
}

window.initMap = initMap;
