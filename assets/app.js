//Data retrieved from API call and used to transfer to and from B
var yelpAPIDBData = {
	restaurantYelpIDDB: "",
	restaurantNameDB: "",
	restaurantRatingDB: "",
	restaurantReviewCountDB: "",
	restaurantPriceDB: "",
	restaurantPhoneNumberDB: "",
	restaurantDisplayAddress: []
};


$(document).ready(function () {
			var config = {
				// Database to store API info retrieved
				apiKey: "AIzaSyDkb8sRAOvLBKigFGElko7UIT5hirbLo44",
				authDomain: "foodapp-a6b68.firebaseapp.com",
				databaseURL: "https://foodapp-a6b68.firebaseio.com",
				projectId: "foodapp-a6b68",
				storageBucket: "",
				messagingSenderId: "667672246134"
			};
			firebase.initializeApp(config);

			// Create a variable to reference the database
			var database = firebase.database();


			var myurl =
				"https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-chloe&location=";
			var AuthorizationKey =
				"Bearer hMCpjFUoT7ODiFsjTHANudhiTR_64AdWbQLNNwwZjuEcEiaHIROcy2OXbpXEKsuCRd3KDmiflByIdZWJQY4klSRMwR7nkcuD82do3vhdTl5DZME2meZ37I16VtvkW3Yx";


			function makeAPICall(city) {
				myurl = myurl + city;

				$.ajax({
					url: myurl,
					headers: {
						Authorization: AuthorizationKey
					},
					method: "GET",
					dataType: "json",
					success: function (data) {
						// console.log(data.businesses);

						var CitytoUse = database.ref().child("LastCity/")
						// New Directory made whenever call is made for a city
						CitytoUse.set({
							lastCitySearched: city.toUpperCase()
						})

						var API = database.ref().child("YelpAPICall-" + city.toUpperCase() + "-Restaurants");

						// resturant ID
						var restaurantNum = 1;
						data.businesses.forEach(function (element) {
							// Add values to yelpAPIDBData object | Set undefined API properties to 
							yelpAPIDBData.restaurantYelpIDDB = element.id;
							if (typeof element.id === 'undefined') {
								yelpAPIDBData.restaurantYelpIDDB = 'n/a'
							};
							yelpAPIDBData.restaurantNameDB = element.name;
							if (typeof element.name === 'undefined') {
								yelpAPIDBData.restaurantNameDB = 'n/a'
							};
							yelpAPIDBData.restaurantRatingDB = element.rating;
							if (typeof element.rating === 'undefined') {
								yelpAPIDBData.restaurantRatingDB = 'n/a'
							};
							yelpAPIDBData.restaurantReviewCountDB = element.review_count;
							if (typeof element.review_count === 'undefined') {
								yelpAPIDBData.restaurantReviewCountDB = 'n/a'
							};
							yelpAPIDBData.restaurantPriceDB = element.price;
							if (typeof element.price === 'undefined') {
								yelpAPIDBData.restaurantPriceDB = 'n/a'
							};
							yelpAPIDBData.restaurantPhoneNumberDB = element.display_phone;
							if (typeof element.display_phone === 'undefined') {
								yelpAPIDBData.restaurantPhoneNumberDB = 'n/a'
							};

							element.location.display_address.forEach(displayAddressLine => {
								console.log(displayAddressLine);
							});

							for (let index = 0; index < element.location.display_address.length; index++) {
								yelpAPIDBData.restaurantDisplayAddress[index] = element.location.display_address[index];
								if (typeof element.location.display_address[index] === 'undefined') {
									restaurantDisplayAddress[index] = 'n/a'
								};
							}

							// Add another record to the Restuarants list in firebase underneath YelpAPICall-CityOfInterest-Restaurants Directory
							API.child("/Restaurant-" + restaurantNum).set(yelpAPIDBData);
							restaurantNum++;
						});

					}
				});
			}

			// Open List of Restaurants page
			function openListofRestaurantsWindow() {
				window.open("listOfRestaurants.html");
			}

			// Open Specific Restaurant page selected by user
			function openSpecificRestaurantWindo() {
				window.open("resturantPage.html");
			}

			// Find restaurants from Splash page
			$("#submit-btn").click(function (event) {
				event.preventDefault();
				var location = $("#search-input")
					.val()
					.trim();

				if (location == "") {
					alert("Please insert valid city!");
				}
				// Make Yelp API call and populate firebase with results
				makeAPICall(location);
				// Open List of Restaurants Page (Window)
				// var delayedWindow = window.open("listOfRestaurants.html");

				// setTimeout(openListofRestaurantsWindow, 3000);
				openListofRestaurantsWindow();
				// Will check to see if List of Restaurants Page is current open
				// If so load latest info from firebase
			});

			// Find restaurants from List of Restaurants Page
			$("#search").click(function (event) {
				$("#submit-btn").off("click");
				event.preventDefault();
				var location = $("#search")
					.val()
					.trim();

				// Make Yelp API call and populate firebase with results
				makeAPICall(location);

				console.log(
					$("#search")
					.val()
					.trim()
				);
			});

			// Responsible for updating "#resturant-results" div in List of Restaurants Page
			firebase.database().ref("LastCity/lastCitySearched").on("value", function (dbvalue) {
				// console.log(document.URL);
				// console.log(dbvalue.val());
				cityofInterest = dbvalue.val();
				// Clear previous search results
				$("#resturant-results").html("")

				firebase.database().ref("YelpAPICall-" + cityofInterest + "-Restaurants").on("value", function (dbvalue) {

					for (let index = 1; index < dbvalue.numChildren() + 1; index++) {
						firebase.database().ref("YelpAPICall-" + cityofInterest + "-Restaurants").child("Restaurant-" + index).on("value", function (dbvalue) {
							// console.log(dbvalue.val().restaurantNameDB);

							// Create necessary layout show individual resturant data
							var divDivider = $("<div class='divider'>");
							var divSection = $("<div class='section'>");
							var divRow = $("<div class='row'>");
							var divSectionLeftCol = $("<div class='col s8'>");
							var divSectionRightCol = $("<div class='col s4 mt-4 text-right'>");
							// Column 1 items
							var resturantName = $("<h5 class='resturantName'>");
							var resturantRating = $("<p>");
							var resturantPrice = $("<p>");

							divSection.attr("data-id", dbvalue.val().restaurantYelpIDDB);
							resturantName.text(dbvalue.val().restaurantNameDB);
							resturantRating.text(
								dbvalue.val().restaurantRatingDB + "/5 " + dbvalue.val().restaurantReviewCountDB + " reviews"
							);
							resturantPrice.text(dbvalue.val().restaurantPriceDB);
							// Column 2 items
							var resturantNumber = $("<p>");
							resturantNumber.text(dbvalue.val().restaurantPhoneNumberDB);

							$("#resturant-results").append(divDivider);
							$("#resturant-results").append(divSection);
							// Append to column1 in resturant section (resturant name, resturant rating, resturant price)
							divSection.append(divRow);
							divRow.append(divSectionLeftCol);
							divRow.append(divSectionRightCol);
							divSectionLeftCol.append(resturantName);
							divSectionLeftCol.append(resturantRating);
							divSectionLeftCol.append(resturantPrice);
							// Append to column2 in resturant section
							divSectionRightCol.append(resturantNumber);
							// apiCall.push(element.id);

							firebase.database().ref("YelpAPICall-" + cityofInterest + "-Restaurants/Restaurant-" + index + "/restaurantDisplayAddress").on("value", function (dbvalue) {
								// console.log(dbvalue.numChildren());
								for (let i = 0; i < dbvalue.numChildren(); i++) {
									firebase.database().ref("YelpAPICall-" + cityofInterest + "-Restaurants/Restaurant-" + index + "/restaurantDisplayAddress").child(i).on("value", function (dbvalue) {
										// console.log(dbvalue.val()+" address line");
										var resturantAddressline = $("<p>");
										resturantAddressline.text(dbvalue.val());
										divSectionRightCol.append(resturantAddressline);
									})
								}
							})
						})
					}

				})

				console.log(cityofInterest);
				var queryURL =
					"https://api.openweathermap.org/data/2.5/weather?" +
					"q=" +
					cityofInterest +
					",Burundi&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
				$.ajax({
					url: queryURL,
					method: "GET"
				}).then(function (response) {
					console.log(response);

					// Get city name
					var cityName = $("#city");
					cityName.text(response.name);

					// Get icon code
					var iconCode = response.weather[0].icon;
					var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

					// Pull in weather icon based on iconCode received
					var icon = $("#weather-icon-img-tag");
					icon.attr("src", iconURL);
					$("#city-weather-results").append(icon);

					// Get weather description
					var weatherDescription = $("#weather-description");
					weatherDescription.text(response.weather[0].description);

					// Get current temperature, high temp, low temp
					var currentTemp = $("#weather-temp-current");
					console.log(response.main.temp);
					currentTemp.html(response.main.temp + "℉");
					var highTemp = $("#weather-temp-high");
					console.log(response.main.temp_max);
					highTemp.html(response.main.temp_max + "℉");
					var lowTemp = $("#weather-temp-low");
					console.log(response.main.temp_min);
					lowTemp.html(response.main.temp_min + "℉");
				});
			})

			$("#resturant-results").on("click", ".section", function () {
				var yelpUniqueBusinessID = $(this).attr("data-id");
				console.log(yelpUniqueBusinessID);

				// var queryurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + yelpUniqueBusinessID
				// var queryurlreview = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + yelpUniqueBusinessID + "/reviews";
				// //First AJAX Call for Restaurents
				// $.ajax({
				// 		url: queryurl,
				// 		headers: {
				// 			Authorization: "Bearer hMCpjFUoT7ODiFsjTHANudhiTR_64AdWbQLNNwwZjuEcEiaHIROcy2OXbpXEKsuCRd3KDmiflByIdZWJQY4klSRMwR7nkcuD82do3vhdTl5DZME2meZ37I16VtvkW3Yx"
				// 		},
				// 		method: "GET",
				// 		dataType: "json",
				// 		success: function (data) {

				// 		});

				// 	//Second AJAX Call for Reviews
				// 	$.ajax({
				// 			url: queryurlreview,
				// 			headers: {
				// 				Authorization: "Bearer hMCpjFUoT7ODiFsjTHANudhiTR_64AdWbQLNNwwZjuEcEiaHIROcy2OXbpXEKsuCRd3KDmiflByIdZWJQY4klSRMwR7nkcuD82do3vhdTl5DZME2meZ37I16VtvkW3Yx"
				// 			},
				// 			method: "GET",
				// 			dataType: "json",
				// 			success: function (data) {

				// 			}

				// 	});

			});

		});
			