var map;
var marker_data = [
  {
    lat: 25.038525,
    lng: 121.498121,
    title: 'Stella'
  },
  {
    lat: 25.0304996,
    lng: 121.5212562,
    title: '老王'
  }
];

function initMap() {
 map = new google.maps.Map(document.getElementById('map'),{
   center: {lat:25.034597, lng:121.5126302},
   zoom: 16
 });
 marker_data.forEach(function(element){
   new google.maps.Marker({
     position: {lat:element.lat, lng:element.lng},
     map: map,
     title: element.title
   });
 });
}

function model(){

}

function view(){

}

function Viewmodel(){
  this.markers = marker_data;// use observable array??
  this.setactive_marker = function(){
  };
}

ko.applyBindings(new Viewmodel());
