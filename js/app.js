function Infomarker() {
}

function Model() {
  this.locations = [
    {
      lat: 25.038525,
      lng: 121.498121,
      title: '今風'
    },
    {
      lat: 25.0304996,
      lng: 121.5212562,
      title: '老王'
    }
  ];
}

function view(){

}

function Viewmodel() {
  var self = this;
  this.infomarkers =  ko.observableArray();

  this.initMap = function() {
    self.map = new google.maps.Map(document.getElementById('map'),{
      center: {lat:25.034597, lng:121.5126302},
      zoom: 16
    });
    var bounds = new google.maps.LatLngBounds();
    model.locations.forEach(function(element){
      var new_infomarker = new Infomarker();
      new_infomarker.gmarker = new google.maps.Marker({
        position: {lat:element.lat, lng:element.lng},
        map: self.map,
        animation: google.maps.Animation.DROP,
        title: element.title
      });
      new_infomarker.infowindow = new google.maps.InfoWindow({
        content: element.title
      });
      new_infomarker.gmarker.addListener('click', function() {
        new_infomarker.infowindow.open(self.map, new_infomarker.gmarker);//????????
      });
      bounds.extend(new_infomarker.gmarker.position);
      self.infomarkers.push(new_infomarker);
    });
    self.map.fitBounds(bounds);
  };

  this.show_clicked_marker = function(clicked_marker) {
    clicked_marker.infowindow.open(self.map, clicked_marker.gmarker);
    self.map.setCenter(clicked_marker.gmarker.position);
  };
}

var model = new Model();
var viewmodel =  new Viewmodel();
ko.applyBindings(viewmodel);
