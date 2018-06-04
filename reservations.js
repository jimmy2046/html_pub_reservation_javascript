      function initMap() {
 	    var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: {lat: 47.608013, lng: -122.335167}
        });
        directionsDisplay.setMap(map);
          
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
          
        document.getElementById('submit').addEventListener('click', function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);

		  location.hash = "#" + "charge";
		  
        });
		
		// Adding Autocomplete
		var pickup = document.getElementById('pickup');
		var options = {componentRestrictions: {country: 'US'}};
		autocomplete = new google.maps.places.Autocomplete(pickup, options);
		
		var dropoff = document.getElementById('dropoff');
		var options = {componentRestrictions: {country: 'US'}};
		autocomplete = new google.maps.places.Autocomplete(dropoff, options);		
		
		// End of Adding Autocomplete		
	  }

      // Booking using Appointlet
      function BookNow(mins, fare, urlLink) {
                  
        var paymentMessage = "";
        paymentMessage = "Service: " + mins + " minutes ride. <br />";
        paymentMessage += "Please pay US$" + fare.toFixed(2) + " to PayPal."
        
        document.getElementById("bookNowButton").style.visibility = 'hidden';
        document.getElementById("bookNowMessage").innerHTML = paymentMessage;
           
        var completeUrl = "";          
        var pickupTxt = document.getElementById("pickup").value;
        var dropoffTxt = document.getElementById("dropoff").value;
        var e = document.getElementById("passengers");
        var passNo = e.options[e.selectedIndex].value;

        completeUrl = urlLink + "?field__pick-up-location=" + pickupTxt
                        + "&field__drop-off-location=" + dropoffTxt
                        + "&field__number-of-passengers=" + passNo;
                        
        document.getElementById("bookNowLink").href = completeUrl;
        document.getElementById("bookNowButton").style.visibility = 'visible'; 
      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: document.getElementById('pickup').value,
          destination: document.getElementById('dropoff').value,
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: 'bestguess'
          }            
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
//              var routeSegment = i + 1;
//              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
//                  '</b><br>';
                
              var rate = 40;
                
              var mins = parseFloat(route.legs[i].duration_in_traffic.value) / 60 ;                
              // summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + '<br />';
                                
              if (mins <= 15) {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + ' (within 15-minute ride)<br />';
                summaryPanel.innerHTML += 'Please pay US$' + rate * 0.25 + ' to PayPal.<br /><br />';
                BookNow(15, rate * 0.25, "https://mycartravel.appointlet.com/s/15-minute-ride");
              }
              else if (mins > 15 && mins <= 30) {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + ' (within 30-minute ride)<br />';
                summaryPanel.innerHTML += 'Please pay US$' + rate * 0.5 + ' to PayPal.<br /><br />';
                BookNow(30, rate * 0.5, "https://mycartravel.appointlet.com/s/30-minute-ride");
              }
              else if (mins > 30 && mins <= 45) {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + ' (within 45-minute ride)<br />';
                summaryPanel.innerHTML += 'Please pay US$' + rate * 0.75 + ' to PayPal.<br /><br />';
                BookNow(45, rate * 0.75, "https://mycartravel.appointlet.com/s/45-minute-ride");
              }
              else if (mins > 45 && mins <= 60) {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + ' (within 60-minute ride)<br />';
                summaryPanel.innerHTML += 'Please pay US$' + rate + ' to PayPal.<br /><br />';
                BookNow(60, rate, "https://mycartravel.appointlet.com/s/60-minute-ride");
              }
              else if (mins > 60 && mins <= 75) {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + ' (within 75-minute ride)<br />';
                summaryPanel.innerHTML += 'Please pay US$' + rate * 1.25 + ' to PayPal.<br /><br />';
                BookNow(75, rate * 1.25, "https://mycartravel.appointlet.com/s/75-minute-ride");
              }
              else if (mins > 75 && mins <= 90) {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + ' (within 90-minute ride)<br />';
                summaryPanel.innerHTML += 'Please pay US$' + rate * 1.5 + ' to PayPal.<br /><br />';
                BookNow(90, rate * 1.5, "https://mycartravel.appointlet.com/s/90-minute-ride");
              }
              else {
                summaryPanel.innerHTML += 'Duration in Traffic: ' + route.legs[i].duration_in_traffic.text + '<br />';
                summaryPanel.innerHTML += 'Duration in Traffic is too long.<br /><br />';
                document.getElementById("bookNowMessage").innerHTML = "Travel time is too long.";
                document.getElementById("bookNowButton").style.visibility = 'hidden';
              }
                  			  			  			  
              summaryPanel.innerHTML += 'Pick-Up: ' + route.legs[i].start_address + '<br />';
              summaryPanel.innerHTML += 'Drop-Off: ' + route.legs[i].end_address + '<br />';
			  summaryPanel.innerHTML += 'Distance: ' + route.legs[i].distance.text;

            }
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
	  