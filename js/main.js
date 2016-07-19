/**
 * 	=================================================================================
 *  Geolocation Data Class
 *  =================================================================================
 */
var GeolocationData = function() {
	this.lon = 0;
	this.lan = 0;
};

GeolocationData.prototype = {
	constructor: GeolocationData,
	setGeolocationData: function(lon, lat) {
		this.lon = lon;
		this.lat = lat;
	},
};

/**
 *  =================================================================================
 * 	Geolocation API Class
 *  =================================================================================
 */
var GeolocationAPI = function() {
};

GeolocationAPI.prototype = {
	constructor: GeolocationAPI,
	getGeolocationInfo: function(onSuccessCb, 
								 onFailedCb) {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				onSuccessCb,
				onFailedCb
			);
		}
	},
};



/** 
 *  =================================================================================
 * 	Weather Data Class
 *  =================================================================================
 */
var WeatherData = function() {
	this.WEATHER_IMAGE_URL		= "http://openweathermap.org/img/w/";
	
	this.location 		= "";
	this.dt		 		= 0;
	
	this.weather = {
		info: "",
		detail: "",
		icon: ""
	};
	
	this.main = {
		temp: 0,
		humidity: 0,
		temp_min: 0,
		temp_max: 0
	};
	
	this.wind = {
		speed: 0,
		deg: 0
	};
	
	this.clouds = {
		all: 0
	};
};

WeatherData.prototype = {
	constructor: WeatherData,
	setData: function(name, dt, weather, main, wind, clouds) {
		this.location 		= name;
		this.dt		 		= dt;
		
		if (weather.length > 0) {
			this.weather.info	= weather[0].main;
			this.weather.detail	= weather[0].description;
			this.weather.icon	= this.WEATHER_IMAGE_URL + 
								  weather[0].icon + 
								  ".png";
		}
		
		this.main.temp		= main.temp;
		this.main.humidity	= main.humidity;
		this.main.temp_min	= main.temp_min;
		this.main.temp_max	= main.temp_max;
		
		this.wind.speed		= wind.speed;
		this.wind.deg		= wind.deg;
		
		this.clouds.all		= clouds.all;
	}
};

/**
 *  =================================================================================
 * 	Weather API Class
 *  =================================================================================
 */
var WeatherAPI = function() {
	/* predefined value */
	this.WEATHER_API_KEY 			= "e0d821c3acf33bcf60879fb9429bd968";
	this.WEATHER_API_CURRENT_URL 	= "http://api.openweathermap.org/data/2.5/weather";
	this.WEATHER_API_FORECAST_URL 	= "http://api.openweathermap.org/data/2.5/forecast";
};

WeatherAPI.prototype = {
	constructor: WeatherAPI,
	getCurrentWeather: function(geolocation_data, onSuccessCb, onErrorCb) {
		$.get(this.WEATHER_API_CURRENT_URL, {
			lon: geolocation_data.lon,
			lat: geolocation_data.lat,
			APPID: this.WEATHER_API_KEY
		})
		.done(onSuccessCb)
		.fail(onErrorCb);
	},
	getForecastWeather: function(geolocation_data, onSuccessCb, onErrorCb) {
		$.get(this.WEATHER_API_FORECAST_URL, {
			lon: geolocation_data.lon,
			lat: geolocation_data.lat,
			APPID: this.WEATHER_API_KEY
		})
		.done(onSuccessCb)
		.fail(onErrorCb);
	}
};



/** 
 *  =================================================================================
 * 	Utilities Class
 *  =================================================================================
 */
var Utilities = function() {
	
	this.GOOGLE_MAP_API_KEY	= "AIzaSyAgkFlWQ2lUaLQPQX95dKa1VyWqfTIkZQg";
	this.GOOGLE_MAP_API_STATIC_URL = "https://maps.googleapis.com/maps/api/staticmap";
	
	this.convKelvinToCelciusStr = function(kelvin) {
		return Math.round(kelvin - 273.15) + "&deg; C"; 
	};
	
	this.convUTSToDateTimeStr = function (timestamp) {
		var date = new Date(timestamp * 1000); // from second to millisecond
		return 	date.toLocaleDateString() + 
				" " +
				(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + 
				":" + 
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	};
	
	this.getGoogleMapStaticURL = function (gps, h, w) {
		var temp = this.GOOGLE_MAP_API_STATIC_URL + "?";
		temp += "center=" + gps.lat + "," + gps.lon;
		temp += "&";
		temp += "zoom=15";
		temp += "&";
		temp += "size=" + h + "x" + w;
		temp += "&";
		temp += "markers=color:red%7C" + gps.lat + "," + gps.lon;
		temp += "&";
		temp += "key=" + this.GOOGLE_MAP_API_KEY;
		
		return temp;
	};
	
	this.listItemBuilder = function(icon, title, sub_bottom, sub_beside, only_content) {
		/* start implementation here */
		var li = "";
    	
    	if (only_content !== false) {
    		li += "<li class='ui-li-static";
        	
        	if (icon !== null) {
        		li += " li-has-thumb";
        	}
        	
        	if (sub_bottom !== null) {
        		li += " li-has-multiline";
        	}
        	
        	li += "'>";
    	}
    	
    	if (icon !== null) {
    		li += "<img src='" + icon + "' alt='icon' class='li-thumb'>";
    	}
    	
    	li += title;
    	
    	if (sub_bottom !== null) {
    		li += "<span class='li-text-sub'>" + sub_bottom + "</span>";
    	}
    	
    	if (sub_beside !== null) {
    		li += "<span class='li-text-sub2'>" + sub_beside + "</span>";
    	}
    	
    	if (only_content !== false) {
    		li += "</li>";
    	}
    	
    	return li;
	};
	
};

var utilities 					= null;
var weatherAPI					= null;
var geolocationAPI				= null;

var gps 	= null;
var tab_id	= 0;
var popup	= null;
var toast   = null;

var onGetCurrentWeatherSuccess 	= null;
var onGetCurrentWeatherFail		= null;
var onGetForecastWeatherSuccess	= null;
var onGetForecastWeatherFail	= null;
var onGetGPSInfoSuccess			= null;
var onGetGPSInfoFail			= null;

/**
 * 	Make sure all HTML documents ready to load.
 *  Please implements all DOM manipulation function inside this scope.
 */
$(document).ready(function() {
	utilities   	= new Utilities();
	gps 			= new GeolocationData();
	geolocationAPI 	= new GeolocationAPI();
	weatherAPI 	 	= new WeatherAPI();
	
	onGetCurrentWeatherSuccess 	= function(result) {
		var weather = new WeatherData();
		
		weather.setData(result.name, result.dt, 
				  result.weather, result.main, 
				  result.wind, result.clouds);
		
		var temp = "";
		
		$("#current_map").attr("src", utilities.getGoogleMapStaticURL(gps, 300, 150));

		$("#current_loc").empty();
		temp = "Lon: " + gps.lon + " | Lat: " + gps.lat;
		$("#current_loc").append(
			utilities.listItemBuilder(null, weather.location, 
					temp, null, false)
		);
		
		$("#current_date").empty();
		$("#current_date").append(
			utilities.listItemBuilder(null, "Weather Data Time", 
					utilities.convUTSToDateTimeStr(weather.dt), null, false)
		);
		
		$("#current_weather").empty();
		$("#current_weather").append(
			utilities.listItemBuilder(weather.weather.icon, weather.weather.info, 
					weather.weather.detail, "Weather", false)
		);

		$("#current_temp").empty();
		
		temp = "Min/Max: " + 
				utilities.convKelvinToCelciusStr(weather.main.temp_min) + 
				" / " + 
				utilities.convKelvinToCelciusStr(weather.main.temp_max);
		
		$("#current_temp").append(
			utilities.listItemBuilder(null, 
					utilities.convKelvinToCelciusStr(weather.main.temp), 
					temp, "Temp", false)
		);

		$("#current_humid").empty();
		temp = weather.main.humidity + " %";
		$("#current_humid").append(
			utilities.listItemBuilder(null, temp, 
					null, "Humidity", false)
		);
		
		$("#current_wind").empty();
		temp = "Direction: " + weather.wind.deg + "&deg;";
		$("#current_wind").append(
			utilities.listItemBuilder(null, weather.wind.speed + " m/s", 
					temp, "Wind Speed", false)
		);
		
		$("#current_cloud").empty();
		$("#current_cloud").append(
			utilities.listItemBuilder(null, weather.clouds.all + " %", 
					null, "Cloud", false)
		);
	};
	
	onGetCurrentWeatherFail 	= function(err) {
	};
	
	onGetForecastWeatherSuccess = function(result) {
		var list 		= result.list;
		var place_name 	= result.city.name;
		
		$("#forecast-list").empty();
		$("#forecast-list").append("<li class='ui-group-index'>" + 
				place_name + 
				"&apos;s Forecast</li>");
			
		var weather = new WeatherData();
		
		for (var i = 0; i < list.length; i++) {
			weather.setData(place_name, list[i].dt, 
					list[i].weather, list[i].main, 
					list[i].wind, list[i].clouds);
			
			$("#forecast-list").append(
				utilities.listItemBuilder(weather.weather.icon, 
						weather.weather.info, 
						utilities.convUTSToDateTimeStr(weather.dt), 
						utilities.convKelvinToCelciusStr(weather.main.temp), 
						true)
			);
		}
	};
	
	onGetForecastWeatherFail 	= function(err) {
	};
	
	onGetGPSInfoSuccess			= function(result) {
		gps.lon = result.coords.longitude;
		gps.lat = result.coords.latitude;
		
		if (tab_id === 0) {
			weatherAPI.getCurrentWeather(gps, 
					onGetCurrentWeatherSuccess, 
					onGetCurrentWeatherFail);
		} else {
			weatherAPI.getForecastWeather(gps, 
					onGetForecastWeatherSuccess, 
					onGetForecastWeatherFail);
		}
	};
	
	onGetGPSInfoFail			= function(err) {
	};

	/** Add Hardware Back Button Handling **/
	window.addEventListener('tizenhwkey', function( ev ) {
        if(ev.keyName === "back") {
            var activePopup = document.querySelector('.ui-popup-active'),
                page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : "";

            if( pageid === "main" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    });
	
	/** Add tab changing event **/
	var changer = document.getElementById("sectionchanger");
	changer.addEventListener("sectionchange", function(evt) {
		if (evt.detail.active === 0) {
			tab_id = 0;
			weatherAPI.getCurrentWeather(gps, 
					onGetCurrentWeatherSuccess, 
					onGetCurrentWeatherFail);
		} else if (evt.detail.active === 1) {
			tab_id = 1;
			weatherAPI.getForecastWeather(gps, 
					onGetForecastWeatherSuccess, 
					onGetForecastWeatherFail);
		}
	});
	
	var popupElement = document.getElementById("popup");
    popup = tau.widget.Popup(popupElement);
    
    var toastElement = document.getElementById("toast");
    toast = tau.widget.Popup(toastElement);
    
    var clear = document.getElementById("clear_btn");
	clear.addEventListener("click", function(evt) {
		localStorage.clear();

	    toast.open();
	    
	    window.setTimeout(function() {
	    	toast.close();
	    }, 1500);
	});
	
	//Jakarta Location
	gps.setGeolocationData(106.826655, -6.176025);
	
	geolocationAPI.getGeolocationInfo(
			onGetGPSInfoSuccess, 
			onGetGPSInfoFail
	);
	
	var item = localStorage.getItem("first");
    if (item === null || item === undefined) {
    	popup.open();
    	localStorage.setItem("first", 1); 
    }
    
});
