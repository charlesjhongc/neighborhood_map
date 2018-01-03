function Model() {
  this.locations = [
    {
      lat: 25.0321172,
      lng: 121.518624,
      title: '[Food] Kinfen Braised Pork Rice (金峰魯肉飯)',
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observable()
    },
    {
      lat: 25.034067,
      lng: 121.523703,
      title: '[Food] Hangzhou Xiaolong Tangbao (杭州小籠湯包)',
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observable()
    },
    {
      lat: 25.0261069,
      lng: 121.5212271,
      title: '[Coffee] Cafe Macho (早秋咖啡)',
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observable()
    }
  ];
  this.locations.forEach(function(location)
  {
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
    fetch(venue_search_url).then(function(response) {
      return response.json();
    },function(response){
      console.log('Fetch Failed');
    }).then(function(body_json){
      location.phone(body_json.response.venues[0].contact.formattedPhone);
      location.category(body_json.response.venues[0].categories[0].name);
      var venue_photo_url = 'https://api.foursquare.com/v2/venues/'
              +body_json.response.venues[0].id
              +'/photos?client_id='
              +client_id
              +'&client_secret='
              +client_secret
              +'&v='
              +versioning;
      fetch(venue_photo_url).then(function(response) {
        return response.json();
      },function(response){
        console.log('Fetch Failed');
      }).then(function(body_json){
        var final_img_url = body_json.response.photos.items[0].prefix
                      +'width300'
                      +body_json.response.photos.items[0].suffix;
        location.img(final_img_url);
      });
    });
  });
}

function Viewmodel() {
  var self = this;
  this.gmarkers =  ko.observableArray();
  this.current_location = ko.observable(model.locations[0]);

  this.initMap = function() {
    self.infowindow = new google.maps.InfoWindow({
    });
    self.map = new google.maps.Map(document.getElementById('map'),{
      center: {lat:25.034597, lng:121.5126302},
      zoom: 16
    });
    var bounds = new google.maps.LatLngBounds();
    for(var i = 0; i<model.locations.length; i++)
    {
      var new_marker = new google.maps.Marker({
        position: {lat:model.locations[i].lat, lng:model.locations[i].lng},
        map: self.map,
        animation: google.maps.Animation.DROP,
        title: model.locations[i].title
      });
      new_marker.index = i;
      // Is this a good idea to add property to a definded object prototype?
      new_marker.addListener('click', function() {
        self.toggleBounce(this);
        self.populateInfo(this)
      });
      self.gmarkers.push(new_marker);
      bounds.extend(new_marker.position);
    }
    self.map.fitBounds(bounds);
  };

  this.populateInfo = function(marker) {
    var self = this;
    self.current_location(model.locations[marker.index]);
    // Check to make sure the infowindow is not already opened on this marker.
    if (self.infowindow.marker != marker) {
      self.infowindow.marker = marker;
      self.infowindow.setContent('<div>' + marker.title + '</div>');
      self.infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      self.infowindow.addListener('closeclick',function(){
        self.infowindow.setMarker = null;
      });
    }
  };

  this.show_clicked_li = function(clicked_gmarker) {
    self.toggleBounce(clicked_gmarker);
    self.populateInfo(clicked_gmarker);
    self.map.setCenter(clicked_gmarker.position);
  };

  this.toggleBounce = function(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    };
  };

  this.clearMarkers = function() {
    for(var i = 0; i<gmarkers().length; i++)
    {
      gmarkers()[i].setMap(null);
    }
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
  };
  */
}

var model = new Model();
var viewmodel =  new Viewmodel();
ko.applyBindings(viewmodel);
