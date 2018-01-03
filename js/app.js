function Infomarker() {
}

function Model() {
  this.locations = [
    {
      lat: 25.0321172,
      lng: 121.518624,
      title: '[Food] Kinfen Braised Pork Rice (金峰魯肉飯)',
      phone: ko.observable(),
      category: ko.observable()
    },
    {
      lat: 25.034067,
      lng: 121.523703,
      title: '[Food] Hangzhou Xiaolong Tangbao (杭州小籠湯包)',
      phone: ko.observable(),
      category: ko.observable()
    },
    {
      lat: 25.0261069,
      lng: 121.5212271,
      title: '[Coffee] Cafe Macho (早秋咖啡)',
      phone: ko.observable(),
      category: ko.observable()
    }
  ];
  this.locations.forEach(function(location){
    //Ajax here
    var client_id = 'HIIKQF305SCRIAJTB3YOG3WTAZNJY2KCY4K0GSOM2E03VYEM';
    var client_secret = '41XU11PQL2ACJNKLF41CDGCQR2JHZLYEIK4XPUYFHZXPZUP2';
    var versioning = '20180101';
    var venue_search_url = 'https://api.foursquare.com/v2/venues/search?client_id='
            +client_id
            +'&client_secret='
            +client_secret
            +'&v='
            +versioning
            +'&ll='
            +location.lat
            +','
            +location.lng;
    var venue_photo_url = 'https://api.foursquare.com/v2/venues/@@@@@@@VENUE_ID@@@@@@@/photos';

    fetch(venue_search_url).then(function(response) {
      return response.json();
    },function(response){
      console.log('Fetch Failed');
    }).then(function(body_json){
      location.phone = ko.observable(body_json.response.venues[0].contact.formattedPhone);
      location.category = ko.observable(body_json.response.venues[0].categories.name);
      //location.photo =
    });
  });
}

function View(){
  // Do I really need a View? In KO, HTML IS THE VIEW!that's official doc says
  /*
  this.clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  };*/

  this.toggleBounce = function(infomarker) {
    if (infomarker.getAnimation() !== null) {
      infomarker.setAnimation(null);
    } else {
      infomarker.setAnimation(google.maps.Animation.BOUNCE);
    };
  }
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
    model.locations.forEach(function(element,index){
      var new_infomarker = new Infomarker();
      new_infomarker.raw_info = element.;
      new_infomarker.gmarker = new google.maps.Marker({
        position: {lat:element.lat, lng:element.lng},
        map: self.map,
        animation: google.maps.Animation.DROP,
        title: element.title
      });
      new_infomarker.gmarker.addListener('click', function() {
        view.toggleBounce(this);
        new_infomarker.infowindow.open(self.map, new_infomarker.gmarker);//????????
      });
      new_infomarker.infowindow = new google.maps.InfoWindow({
        content: '<p data-bind="text: infomarkers().[' + index + '].raw_info.phone()"></p>'
      });
      bounds.extend(new_infomarker.gmarker.position);
      self.infomarkers.push(new_infomarker);


    });
    self.map.fitBounds(bounds);
  };

  this.show_clicked_li = function(clicked_infomarker) {
    clicked_infomarker.infowindow.open(self.map, clicked_infomarker.gmarker);
    self.map.setCenter(clicked_infomarker.gmarker.position);
  };

  /*
  this.drop() {
    clearMarkers();
    for (var i = 0; i < neighborhoods.length; i++) {
      addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
  }

  this.dropMarkerWithTimeout = function(position, timeout) {
    window.setTimeout(function() {
      markers.push(new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP
      }));
    }, timeout);
  };*/
}

var model = new Model();
var view = new View();
var viewmodel =  new Viewmodel();
ko.applyBindings(viewmodel);
