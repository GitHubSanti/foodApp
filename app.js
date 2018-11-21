$(document).ready(function(){ 
    $("#websearch").show();
    $("#fmega").hide()
    $("#list").hide()
    
    var apiCall = []
    
    $("#submit-btn-2").click(function(){
        $("#firstrow").empty()
        $("#secondrow").empty()
        $("#thirdrow").empty()
    
        $("#fmega").hide(50)
        $("#list").show(50)
    })
    
    $("#submit-btn").click(function(e){
        e.preventDefault()
        var location = $("#search-input").val().trim()
        var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=food&by-chloe&location="+location;
        
    $.ajax({
        url: myurl,
        headers: {
            'Authorization':'Bearer hMCpjFUoT7ODiFsjTHANudhiTR_64AdWbQLNNwwZjuEcEiaHIROcy2OXbpXEKsuCRd3KDmiflByIdZWJQY4klSRMwR7nkcuD82do3vhdTl5DZME2meZ37I16VtvkW3Yx',
        },
        method: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data.businesses);
            $("#resturant-results").empty()
            data.businesses.forEach(element => {
                // Create necessary layout show individual resturant data
              var divDivider = $("<div class='divider'>");
              var divSection = $("<div class='section'>")
              var divRow = $("<div class='row'>");
              var divSectionLeftCol = $("<div class='col s8'>");
              var divSectionRightCol = $("<div class='col s4 mt-4'>");
              // Column 1 items
              var resturantName = $("<h5 class='resturantName'>");
              var resturantRating = $("<p class ='rasturarntRating'>");
              var resturantPrice = $("<p class ='resturantPrice'>");
    
                divSection.attr("data-id", element.id)
    
              resturantName.text(element.name);
              
              resturantRating.text(
                element.rating + "/5 " + element.review_count + " reviews"
              );
              resturantPrice.text(element.price);
              // Column 2 items
              var resturantNumber = $("<p class ='resturantNumber'>");
              resturantNumber.text(element.display_phone);
    
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
              apiCall.push(element.id);
              
              element.location.display_address.forEach(displayAddressLine => {
                var resturantAddressline = $("<p>");
                resturantAddressline.text(displayAddressLine);
                divSectionRightCol.append(resturantAddressline);
                
              });
    
            });
            console.log(apiCall)
            $("#websearch").hide(50)
            $("#list").show(50)
            }
        })
    })
    
    $(document).on("click",".section",function(){
        var that = $(this).attr("data-id");
        console.log(that);
        var queryurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/"+that;
        var queryurlreview ="https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/"+that+"/reviews";
        //First AJAX Call for Restaurents
        $.ajax({
            url: queryurl,
            headers: {
                'Authorization':'Bearer hMCpjFUoT7ODiFsjTHANudhiTR_64AdWbQLNNwwZjuEcEiaHIROcy2OXbpXEKsuCRd3KDmiflByIdZWJQY4klSRMwR7nkcuD82do3vhdTl5DZME2meZ37I16VtvkW3Yx',
            },
            method: 'GET',
            dataType: 'json',
            success: function(data){
                // console.log(data)
                $("#fmega").show(50)
                $("#list").hide(50)
                 
                    // Create necessary layout show individual resturant data
                    
                    var divRow = $("<div class='row'>");
                    var divSectionLeftCol = $("<div class='col s8'>");
                    var divSectionRightCol = $("<div class='col s4 mt-4'>");
                    // Column items
                    var resturantName = $("<h5 class='resturantName'>");
                    var resturantRating = $("<p class ='resturantRating'>");
                    var resturantPrice = $("<p class ='resurantPrice'>");
                    var resturantImageDiv = $("<div class ='resturantImageDiv'>")
                    var resturantNumber = $("<p class ='resturantNumber'>");
    
                    resturantName.text(data.name);
                    resturantRating.text(data.rating + "/5 " + data.review_count + " reviews");
                    resturantPrice.text(data.price);
                    resturantNumber.text(data.phone);
                    data.photos.forEach(element => {
                        var resturantImage = $("<img class ='resturantImage responsive-img'>");
                        resturantImage.attr("src", element).attr("width","150px").attr("height","166px")
                        resturantImageDiv.append(resturantImage)
                    });
    
                    //Placement
                    $("#firstrow").append(divRow);
                    divRow.append(divSectionLeftCol);
                    divRow.append(divSectionRightCol);
                    divSectionLeftCol.append(resturantName);
                    divSectionLeftCol.append(resturantRating);
                    divSectionRightCol.append(resturantNumber);
                    divSectionRightCol.append(resturantPrice);
                    data.location.display_address.forEach(displayAddressLine => {
                        var resturantAddressline = $("<p>");
                        resturantAddressline.text(displayAddressLine);
                        divSectionRightCol.append(resturantAddressline)
                    });
    
                    $("#secondrow").append(resturantImageDiv)
                
            }
            
        })
        //Second AJAX Call for Reviews
        $.ajax({
            url: queryurlreview,
            headers: {
                'Authorization':'Bearer hMCpjFUoT7ODiFsjTHANudhiTR_64AdWbQLNNwwZjuEcEiaHIROcy2OXbpXEKsuCRd3KDmiflByIdZWJQY4klSRMwR7nkcuD82do3vhdTl5DZME2meZ37I16VtvkW3Yx',
            },
            method: 'GET',
            dataType: 'json',
            success: function(data){
                console.log(data)
                console.log(data.total);
                console.log(data.reviews);
                var resturantreviewsDiv = $("<div>")
                data.reviews.forEach(element => {
                    var reviewname = $("<p class = 'reviewname'>")
                    var reviewrating = $("<p class ='reviewrating'>")
                    var reviewtext = $("<p class = 'reviewtext'>")
                    var reviewimage = $("<img class='circle'>")
    
                    reviewname.text(element.user.name);
                    reviewrating.text(element.rating);
                    reviewtext.text(element.text);
                    reviewimage.attr("src", element.user.image_url).attr("width", "50px").attr("height", "50px")
    
                    
                    resturantreviewsDiv.append(reviewname)
                    .append(reviewimage)
                    .append(reviewtext)
                    .append(reviewrating)
                    
                });
                
                $("#thirdrow").append(resturantreviewsDiv);
    
                
    
            }
            
        });
    
    });
        
    });

    $("#submit-btn").click(function(event) {
        event.preventDefault();
        var location = $("#search-input")
          .val()
          .trim();
        var queryURL =
          "https://api.openweathermap.org/data/2.5/weather?" +
          "q=" +
          location +
          ",Burundi&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          console.log("Weather API Content:");
          console.log(response);
          console.log(response.weather[0].icon);
    
          // Get city name
          var cityName = $("#city");
          cityName.text(response.name);
    
          // Get icon code
          var iconCode = response.weather[0].icon;
          var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
          console.log(iconURL);
    
          // Pull in weather icon based on iconCode received
          var icon = $("#weather-icon-img-tag");
          icon.attr("src", iconURL);
          $("#city-weather-results").append(icon);
          console.log(icon);
    
          // Get weather description
          var weatherDescription = $("#weather-description");
          weatherDescription.text(response.weather[0].description);
    
          // Get current temperature, high temp, low temp
          var currentTemp = $("#weather-temp-current");
          console.log(response.main.temp);
          currentTemp.html(response.main.temp + "&#8457;");
          var highTemp = $("#weather-temp-high");
          console.log(response.main.temp_max);
          highTemp.html(response.main.temp_max + "&#8457;");
          var lowTemp = $("#weather-temp-low");
          console.log(response.main.temp_min);
          lowTemp.html(response.main.temp_min + "&#8457;");
        });
      });
