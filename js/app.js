var map;
function initMap() {
 map = new google.maps.Map(document.getElementById('map'),{
   center: {lat:25.1723919, lng:121.4464771},
   zoom: 16
 });
 var marker = new google.maps.Marker({
   position: {lat:25.038525, lng:121.498121},
   map: map,
   title: 'Stella'
 });
}
