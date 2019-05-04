// 'use strict';

//all methods s here

//one - set up map and ask for location permission
//two - user clicks on restaurant on map and intializes a call to grab info about the location.
var map, infoWindow;
var luckys = { lat: 42.3502, lng: -71.0484 };
// var position;



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: luckys,
    zoom: 12,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi.attraction",
        "elementType": "labels.text",
        "stylers": [
          {
            "color": "#ffeb3b"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#263c3f"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6b9a76"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#212a37"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9ca5b3"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#1f2835"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#f3d19c"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#2f3948"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#515c6d"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      }
    ]
  });


  infoWindow = new google.maps.InfoWindow;
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(position);
      infoWindow.setContent('You are here.');
      infoWindow.open(map);
      map.setCenter(position);
      map.setZoom(15);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


  //end of init map function

  //error handling
  function handleLocationError(browserHasGeolocation, infoWindow, position) {
    infoWindow.setPosition(position);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  console.log(luckys);
  var clickHandler = new ClickEventHandler(map, luckys);
}

var ClickEventHandler = function (map, origin) {
  this.origin = origin;
  this.map = map;
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);
  this.placesService = new google.maps.places.PlacesService(map);
  this.infowindow = new google.maps.InfoWindow;
  this.infowindowContent = document.getElementById('infowindow-content');
  this.infowindow.setContent(this.infowindowContent);

  // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));
};

ClickEventHandler.prototype.handleClick = function (event) {
  console.log('You clicked on: ' + event.latLng);
  // If the event has a placeId, use it.
  if (event.placeId) {
    console.log('You clicked on place:' + event.placeId);

    // Calling e.stop() on the event prevents the default info window from
    // showing.
    // If you call stop here when there is no placeId you will prevent some
    // other map click event handlers from receiving the event.
    event.stop();
    this.calculateAndDisplayRoute(event.placeId);
    this.getPlaceInformation(event.placeId);
  }
};

ClickEventHandler.prototype.calculateAndDisplayRoute = function (placeId) {
  var me = this;
  this.directionsService.route({
    origin: this.origin,
    destination: { placeId: placeId },
    travelMode: 'WALKING'
  }, function (response, status) {
    if (status === 'OK') {
      me.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

ClickEventHandler.prototype.getPlaceInformation = function (placeId) {
  var me = this;
  this.placesService.getDetails({ placeId: placeId }, function (place, status) {
    if (status === 'OK') {
      me.infowindow.close();
      me.infowindow.setPosition(place.geometry.location);
      me.infowindowContent.children['place-icon'].src = place.icon;
      me.infowindowContent.children['place-name'].textContent = place.name;
      me.infowindowContent.children['place-id'].textContent = place.place_id;
      me.infowindowContent.children['place-address'].textContent =
        place.formatted_address;
      me.infowindow.open(me.map);
    }
  });
};






// function go() {
//   initMap();
//   // setupMap();
// }

// $(go);




        //   <!-- do something when a marker is clicked

        //     google.maps.event.addListener(marker,'click',function() {
        //      map.setZoom(9);
        //      map.setCenter(marker.getPosition());
        //     });

        //     -->

        // <!-- 
        //     <script>
        //     function myMap() {
        //     var mapProp= {
        //       center:new google.maps.LatLng(42.3601,-71.0589),
        //       zoom:12,
        //     };
        //     var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
        //     var luckys = {lat: 42.3502, lng:-71.0484}
        //     var marker = new google.maps.Marker({position: luckys, title: "Lucky's Lounge"});

        //     marker.setMap(map);
        //     }
        // </script> -->

































// // put your own value below!
// const apiKey = 'JhJzQ7WzjruZB54ywmiqPa3Ps5K14RKYt6CgdDck'; 
// const searchURL = 'https://developer.nps.gov/api/v1/parks?parkCode=&stateCode=&';

// // ex curl -X GET "https://developer.nps.gov/api/v1/parks?parkCode=&stateCode=&limit=10&q=adf"


// function formatQueryParams(params) {
//   const queryItems = Object.keys(params)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)

//   return queryItems.join('&');
// }

// function displayResults(responseJson) {
//   // if there are previous results, remove them
//   console.log(responseJson);
//   $('#results-list').empty();
//   // iterate through the items array
//   for (let i = 0; i < responseJson.data.length; i++){
//     // for each video object in the items 
//     //array, add a list item to the results 
//     //list with the video title, description,
//     //and thumbnail
//     $('#results-list').append(
//       `<li><h3>${responseJson.data[i].fullName}</h3>
//       <p>${responseJson.data[i].description}</p>
//       <a href='${responseJson.data[i].url}'> ${responseJson.data[i].url}</a>
//       </li>`
//     )};
//   //display the results section  
//   $('#results').removeClass('hidden');
// };

// function getYouTubeVideos(query, limit=10) {
//   const params = {
//     api_key: apiKey,
//     q: query,
//     limit,
//   };
//   const url = formatQueryParams(params)
//   const final_url = searchURL + url;

//   console.log(final_url);

//   fetch(final_url)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then(responseJson => displayResults(responseJson))
//     .catch(err => {
//       $('#js-error-message').text(`Something went wrong: ${err.message}`);
//     });
// }



// $(watchForm);