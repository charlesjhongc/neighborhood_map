function Model() {
  this.locations = [
    {
      lat: 25.0321172,
      lng: 121.518624,
      title: 'Kinfen Braised Pork Rice (金峰魯肉飯)',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    },
    {
      lat: 25.034066,
      lng: 121.523722,
      title: 'Hangzhou Xiaolong Tangbao (杭州小籠湯包)',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    },
    {
      lat: 25.0469202,
      lng: 121.5413122,
      title: 'Lin Dong Fang Beef Noodle (林東芳牛肉麵)',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    },
    {
      lat: 25.0665239,
      lng: 121.537716,
      title: 'Addiction Aquatic Development (上引水產)',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    },
    {
      lat: 25.0648892,
      lng: 121.5267065,
      title: 'Mitsui Cuisine (三井日本料理)',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    },
    {
      lat: 25.043302,
      lng: 121.549506,
      title: 'Toasteria Cafe',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    },
    {
      lat: 25.043373,
      lng: 121.507630,
      title: 'Ay-Chung Flour-Rice Noodle (阿宗麵線)',
      foursquare_api_loaded: ko.observable(false),
      address: ko.observableArray(),
      phone: ko.observable(),
      category: ko.observable(),
      img: ko.observableArray()
    }
  ];
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
    var listening_function = function() {
      var index = self.gmarkers.indexOf(this);
      self.get_location_data(model.locations[index]);
      self.toggleBounce(this);
      self.populateInfo(this, index);
    };
    var bounds = new google.maps.LatLngBounds();
    for(var i = 0; i<model.locations.length; i++) {
      var new_marker = new google.maps.Marker({
        position: {lat:model.locations[i].lat, lng:model.locations[i].lng},
        map: self.map,
        animation: google.maps.Animation.DROP,
        title: model.locations[i].title
      });
      new_marker.is_active = ko.observable(true);
      // Is this a good idea to add property to a definded object prototype?
      new_marker.addListener('click', listening_function);
      self.gmarkers.push(new_marker);
      bounds.extend(new_marker.position);
    }
    self.map.fitBounds(bounds);
  };

  this.get_location_data = function(location) {
    //Ajax here
    var client_id = 'HIIKQF305SCRIAJTB3YOG3WTAZNJY2KCY4K0GSOM2E03VYEM';
    var client_secret = '41XU11PQL2ACJNKLF41CDGCQR2JHZLYEIK4XPUYFHZXPZUP2';
    var versioning = '20180101';
    var foursquare_auth = 'client_id='+
                            client_id+
                            '&client_secret='+
                            client_secret+
                            '&v='+
                            versioning;
    var venue_search_url = 'https://api.foursquare.com/v2/venues/search?'+
                            foursquare_auth+
                            '&ll='+
                            location.lat+
                            ','+
                            location.lng;

    function fetch_success(response) {
      if(response.ok) {
        location.foursquare_api_loaded(true);
        return response.json();//@@@@@@@ return?
      }else {
        // response with error
        alert("Foursquare API error");
        return false;
      }
    }

    function fetch_fail(response) {
      // network problem
      alert("Networking error");
      return false;
    }

    fetch(venue_search_url).then(fetch_success,fetch_fail).then(function(body_json){
      location.phone(body_json.response.venues[0].contact.formattedPhone);
      location.category(body_json.response.venues[0].categories[0].name);
      location.address(body_json.response.venues[0].location.formattedAddress);
      var venue_photo_url = 'https://api.foursquare.com/v2/venues/'+
                              body_json.response.venues[0].id+
                              '/photos?'+
                              foursquare_auth;
      fetch(venue_photo_url).then(fetch_success,fetch_fail).then(function(body_json){
        for(var i = 0; i<3; i++) {
          var final_img_url = body_json.response.photos.items[i].prefix+
                                'width300'+
                                body_json.response.photos.items[i].suffix;
          location.img.push(final_img_url);
        }
      });
    });
  };

  this.populateInfo = function(marker, index) {
    self.current_location(model.locations[index]);
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
    var index = self.gmarkers.indexOf(clicked_gmarker);
    self.get_location_data(model.locations[index]);
    self.toggleBounce(clicked_gmarker);
    self.populateInfo(clicked_gmarker, index);
    self.map.setCenter(clicked_gmarker.position);
  };

  this.filter_submit = function(formelement) {
    var key = $(formelement).children('input').first().val();
    self.clearMarkers();
    for(var i = 0; i<self.gmarkers().length; i++) {
      if(self.gmarkers()[i].title.toLowerCase().indexOf(key.toLowerCase()) != -1)
        self.gmarkers()[i].is_active(true);
      else
        self.gmarkers()[i].is_active(false);
    }
    self.drop();
  };

  this.toggleBounce = function(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  this.drop = function() {
    for(var i = 0; i<self.gmarkers().length; i++) {
      if(self.gmarkers()[i].is_active()) {
        self.gmarkers()[i].setAnimation(google.maps.Animation.DROP);
        self.gmarkers()[i].setMap(self.map);
      }
    }
  };

  this.clearMarkers = function() {
    for(var i = 0; i<self.gmarkers().length; i++) {
      self.gmarkers()[i].setMap(null);
      self.gmarkers()[i].is_active(false);
    }
  };
}

var model = new Model();
var viewmodel =  new Viewmodel();
ko.applyBindings(viewmodel);
