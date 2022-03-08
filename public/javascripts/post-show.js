const post = require("../../models/post");
// mapboxgl.accessToken = 'pk.eyJ1IjoiYXdzZGV2IiwiYSI6ImNreXhiNWZiazA5cGYyb3BneXYzdDl2YnEifQ.4G0r37NQk5YfzNCIfEdM7w';
mapboxgl.accessToken = mapBoxToken;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    // center: post.coordinates,
    center: post.geometry.coordinates, // updated after cities.js creation 
    zoom: 5
});
// create a HTML element for post  location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and to the map 
new mapboxgl.Marker(el)
//.setLngLat(post.coordinates)//feature.geometry.coordinates)
.setLingLat(post.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location  + '</p>'))
.addTo(map);

// Toggle edit review form

// $(document).on('click', 'toggle-edit-form', function() { alert ("Hi...")});
  $(".toggle-edit-form").on('click', function() { 
  // toggle the edit button text on click
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
  // toggle visibility of the edit review form
    $(this).siblings('.edit-review-form').toggle();
    });

    
    
    // Add click listener for clearing of rating form edit/new form
    $('.clear-rating').click(function() {
      $(this).siblings('.input-no-rate').click();
    });