angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {})

.controller('MapSearchCntr', function($scope, $ionicModal,$ionicActionSheet, $timeout, $http, $log,$state, $location, $ionicPopup, $compile,geolocationService,geofenceService,$ionicLoading, baseURL) {


	$scope.init = function() {

		// $http.defaults.headers.common.Authorization = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE0NTc0MTQ0NzcsImlzcyI6Imh0dHA6XC9cL3Nwb2x5LmNvbSIsImF1ZCI6Imh0dHA6XC9cL2FwaS5zcG9seS5jb20iLCJleHAiOjE0NjI1OTg0NzcsIm5iZiI6MTQ1NzQxNDQ3NywiZGF0YSI6eyJ1c2VySWQiOiIxIn19.tAEuB8BbnhmPoM0bsjllcWioJXtoHvAYeEfswo2rR-8yidtBarYAXppPYXFgQDXYRpHkHr0xKMA0ZXEB-QucpQ";

	    $http.get(baseURL + '/activities/search?sport_id=1&country=Thailand&city=Bangkok', {headers: {'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE0NTc0MTQ0NzcsImlzcyI6Imh0dHA6XC9cL3Nwb2x5LmNvbSIsImF1ZCI6Imh0dHA6XC9cL2FwaS5zcG9seS5jb20iLCJleHAiOjE0NjI1OTg0NzcsIm5iZiI6MTQ1NzQxNDQ3NywiZGF0YSI6eyJ1c2VySWQiOiIxIn19.tAEuB8BbnhmPoM0bsjllcWioJXtoHvAYeEfswo2rR-8yidtBarYAXppPYXFgQDXYRpHkHr0xKMA0ZXEB-QucpQ"}}).then(function (data) {
		    //cache the data
		    // localStorage.setItem("cache-" + endpoint, JSON.stringify(data));
		    // $ionicLoading.hide();
		    // success(data);
		    console.log("This is the data", data);
		    // $scope.findNearbyEvents(data.data.data, bounds);
		    $scope.events = data.data.data;
	    }, function (err) {
	        // $ionicLoading.hide();
	        // if (error)
	        //     error(err);
	        // else if (localStorage[endpoint]) //if no error supplied and there's data in the cache
	        //     success(JSON.parse(localStorage.getItem("cache-" + endpoint)));
	        if(err) {
	        	console.log(err);
	        }
	    });


	}

	$scope.init();

	$scope.latLang={
		lat:'',
		lang:'',
		location:''
	};
	
		 $ionicLoading.show({
            template: 'Getting geofences from device...',
            duration: 5000
        });

        $scope.geofences = [];

        geofenceService.getAll().then(function (geofences) {
            $ionicLoading.hide();
            $scope.geofences = geofences;
        }, function (reason) {
            $ionicLoading.hide();
            $log.log('An Error has occured', reason);
        });
		
		
        $scope.GetGeoLocation = function () {
			
            $log.log('Tracing current location...');
            $ionicLoading.show({
                template: 'Tracing current location...'
            });
            geolocationService.getCurrentPosition()
                .then(function (position) {
                    $log.log('Current location found');
                    $log.log('Current location Latitude'+position.coords.latitude);
                    $log.log('Current location Longitude'+position.coords.longitude);
					
                    $ionicLoading.hide();
					$scope.latLang.lat=parseFloat(position.coords.latitude);
					$scope.latLang.lang=parseFloat(position.coords.longitude);
					var lat =$scope.latLang.lat;
					var lang =$scope.latLang.lang; 
					//You can hit request upto 2500 per day on free of cost. 
					var mrgdata='http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lang+'&sensor=true'
					$http.get(mrgdata)
							.success(function (response) { 
							/* console.log(response.results[0].formatted_address); */
							$scope.latLang.location=response.results[0].formatted_address;
							console.log("Your Current Location is : " +$scope.latLang.location)
							
							var myLatlng = new google.maps.LatLng(lat,lang);
        
						var mapOptions = {
						  center: myLatlng,
						  zoom: 16,
						  mapTypeId: google.maps.MapTypeId.ROADMAP
						};
						var map = new google.maps.Map(document.getElementById("map"),
							mapOptions);

						
					   
						var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
						var compiled = $compile(contentString)($scope);

						// var infowindow = new google.maps.InfoWindow({
						 
						// });
						// infowindow.setContent($scope.latLang.location);
						// infowindow.open(map, marker);

						var marker = new google.maps.Marker({
						  position: myLatlng,
						  map: map,
						  title: 'Current Location'
						});

						console.log(marker);


					    var cityCircle = new google.maps.Circle({
					      strokeColor: '#FF0000',
					      strokeOpacity: 0.8,
					      strokeWeight: 0,
					      fillColor: '#0c60ee',
					      fillOpacity: 0.2,
					      map: map,
					      center: map.center,
					      radius: 10000
					    });


						google.maps.event.addListener(marker, 'click', function() {
						  // infowindow.open(map, marker);	
						  console.log('clicked');					 
						});

					   	google.maps.event.addListener(map, 'zoom_changed', function () {
					    	console.log('adrenaline');
					    	$scope.onClickCallback(map, marker);
					    });


						google.maps.event.addListener(map, "dragend", function() {
					    	$scope.onClickCallback(map, marker);													    					    	
						});


						$scope.map = map;
									
							   
				}).error(function (data, status, headers, config) {
					console.log("error");
					
					 if (status == 0)
						showalert("Error", "Errro Occured from Server site!");
					else
						showalert("Error", data); 
				  
				});

		}, function (reason) {
			$log.log('Cannot obtain current location', reason);
		   
			$ionicLoading.show({
				template: 'Cannot obtain current location',
				duration: 1500
			});
		});
     };

	 
	 //This is default set location before fetching current location///
	 //***************Start********************************//
	 if($scope.latLang.lat==''){
			var myLatlng = new google.maps.LatLng(18.9750,72.8258);
        
						var mapOptions = {
						  center: myLatlng,
						  zoom: 16,
						  mapTypeId: google.maps.MapTypeId.ROADMAP
						};
						var map = new google.maps.Map(document.getElementById("map"),
							mapOptions);			
					   
						var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
						var compiled = $compile(contentString)($scope);

						// var infowindow = new google.maps.InfoWindow({
						 
						// });
						// infowindow.setContent($scope.latLang.location);
						// infowindow.open(map, marker);

						var marker = new google.maps.Marker({
						  position: myLatlng,
						  map: map,
						  title: 'Current Location'
						});

						google.maps.event.addListener(marker, 'click', function() {
						  infowindow.open(map,marker);
						 
						});

						$scope.map = map;
	 }
	 //***********************End**********************************///



	$scope.onClickCallback = function(map, marker) {


		// console.log(map.getBounds().contains(marker.getPosition()));


		// var bounds = map.getBounds();
		// var topLeftLatLng = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getSouthWest().lng());

		// console.log('I moved, here are the bounds', bounds);
		// console.log('I moved, here are the top left bounds', topLeftLatLng);

		// GET /activities/search?sport_id=1&country=Finland&city=Oulu


		$.each($scope.events, function(i, item) {

			console.log(item);

			var itemLatlng = new google.maps.LatLng(item.lat, item.long);

			console.log(map.getBounds().contains(itemLatlng));

			var itemIsVisible = map.getBounds().contains(itemLatlng);

			if(itemIsVisible) {
				if(!item.hasMarker) {
					var itemMarker = new google.maps.Marker({
					  position: itemLatlng,
					  map: map,
					  title: item.title,
					  animation: google.maps.Animation.DROP
					});		

					$scope.events[i].hasMarker = true;
				} else {
					console.log('Already got a marker');
				}
			}

			// var itemMarker = new google.maps.Marker({
			//   position: itemLatlng,
			//   map: map,
			//   title: item.title
			// });


		});



	}



	$scope.findNearbyEvents = function(localEvents, area) {

		$.each(localEvents, function(i, activity) {

			console.log(activity);

 			var myLatLng = new google.maps.LatLng({lat: 13.7563309, lng: 100.61712154531}); 





 			console.log(activity.lat);
 			console.log(activity.long);
 			console.log(myLatlng.lat());
 			console.log(myLatlng.lng());

 			console.log(area.contains(myLatlng));
 			console.log(activity);


 			// console.log(map.getBounds().contains(marker.getPosition()));


	// // Define Marker properties
	// var image = new google.maps.MarkerImage(marker.smallimg,
	// // This marker is 129 pixels wide by 42 pixels tall.
	//     new google.maps.Size(42, 42),
	// // The origin for this image is 0,0.
	//     new google.maps.Point(0,0),
	// // The anchor for this image is the base of the flagpole at 18,42.
	//     new google.maps.Point(18, 42)
	// );


	//     $('#map').gmap('addMarker', { 'id' : marker.id,
	//         'position': new google.maps.LatLng(marker.latitude, marker.longitude),
	//         'icon' : image,             
	//         'bounds': true 
	//     }).click(function() {
	//         $('#map').gmap('openInfoWindow', { 'content': '<h2>' + marker.loc + '</h2><img src="' + marker.smallimg + '" class="my-map-marker" />'
	//          }, this);
	//     });




	});


}






});






// function onClickCallback(map) {

// var bounds = map.getBounds();

//     // clearOverlays();

//     $.getJSON( 'http://skiweather.eu/gmap4/markers/index.php', {
//         swLat: bounds.getSouthWest().lat(), swLon: bounds.getSouthWest().lng(), 
//         neLat: bounds.getNorthEast().lat(), neLon: bounds.getNorthEast().lng()}, function(data) { 
//         $.each( data.markers, function(i, marker) {


//         // Define Marker properties
//         var image = new google.maps.MarkerImage(marker.smallimg,
//         // This marker is 129 pixels wide by 42 pixels tall.
//             new google.maps.Size(42, 42),
//         // The origin for this image is 0,0.
//             new google.maps.Point(0,0),
//         // The anchor for this image is the base of the flagpole at 18,42.
//             new google.maps.Point(18, 42)
//         );


//             $('#map').gmap('addMarker', { 'id' : marker.id,
//                 'position': new google.maps.LatLng(marker.latitude, marker.longitude),
//                 'icon' : image,             
//                 'bounds': true 
//             }).click(function() {
//                 $('#map').gmap('openInfoWindow', { 'content': '<h2>' + marker.loc + '</h2><img src="' + marker.smallimg + '" class="my-map-marker" />'
//                  }, this);
//             });
//         });
//     });
// }   
