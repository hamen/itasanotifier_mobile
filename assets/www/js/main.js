/*
 *  Copyright (C) 2011 Ivan Morgillo
 *  Email: imorgillo [@] gmail [dot] com
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * 
 */

function onDeviceReady() {
	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("backbutton", onBackKeyDown, true);
	
	$('#recentButton').click(function(){
		getLatestSubs();
	});

	$('#refresh_button').click(function(){
		getLatestSubs();
	});
	
	$('#save_button').click(function(){
		saveUserData();
	});

	$('#login_button').click(function(){
		login(true);
	});
	
	$('.swipehome').live('swiperight',function(event){
		if (event.type == "swiperight") {
			$.mobile.changePage("#home", { transition: "slide", reverse: "true" } ,true);
		}
		event.preventDefault();
    });

	$('.swipemyitasa').live('swiperight',function(event){
		if (event.type == "swiperight") {
			$.mobile.changePage("#myitasa", { transition: "slide", reverse: "true" } ,true);
		}
		event.preventDefault();
    });
	
	$('#series_list_button').click(function(){
		getShowList();
	});

	$('#favorite_button').click(function(){
		getFavoriteList();
	});

	$('#latest_favorite_button').click(function(){
		getLatestFavoriteSubs();
	});
	$('#latest_refresh_button').click(function(){
		getLatestFavoriteSubs();
	});

	$('#next_favorite_button').click(function(){
		getNextFavoriteSubs();
	});
	$('#next_refresh_button').click(function(){
		getNextFavoriteSubs();
	});
	
	$('#vibrate_checkbox').click(function(){
		if(this.checked) {
			window.localStorage.setItem("vibrate_checkbox", true);
		}
		else {
			window.localStorage.setItem("vibrate_checkbox", false);
		}
	});
}

$(document).bind("mobileinit", function(){
    $.mobile.defaultPageTransition = 'none';
});

function beep() {
    navigator.notification.beep(1);
}

function vibrate() {
    navigator.notification.vibrate(500);
}

var preventBehavior = function(e) {
    e.preventDefault();
};

function fail(msg) {
    alert(msg);
}

function close() {
    var viewport = document.getElementById('viewport');
    viewport.style.position = "relative";
    viewport.style.display = "none";
}

function getLatestSubs() {
	var list = $('#latest20subs_list');
	list.html("");
	$.ajax({
		type: "GET",
		url: "http://feeds.feedburner.com/ITASA-Ultimi-Sottotitoli?option=com_rsssub&type=lastsub",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('title').each(function(){
				var title = $(this).text();
				if(title != "Ultimi Sottotitoli" && title != "LOGO ITASA") {
					var link = $(this).next().text();
					list.append($(document.createElement('li')).html(title));
					//alert(title + " " + link);
				}
				list.listview("destroy").listview();
			});
			if(window.localStorage.getItem("vibrate_checkbox") === 'true')
				vibrate();
		}
	});
}

function getSub( ) {
	
}

function onMenuKeyDown() {
	$.mobile.changePage("#settings");
}

function onBackKeyDown() {
	//do nothing for now
}
function saveUserData() {
	var username = $('#username').val();
	var password = $('#password').val();
	window.localStorage.setItem("username", username);
	window.localStorage.setItem("password", password);

	if (window.localStorage.getItem("username") == username &&
		window.localStorage.getItem("password") == password) {
		navigator.notification.alert("Dati salvati correttamente!");
	}
}

function loadUserSavedData() {
	var username = window.localStorage.getItem("username");
	var password = window.localStorage.getItem("password");
	if( username !== "" && password !== "") {
		$('#username').val(username);
		$('#password').val(password);
	}

	$('#vibrate_checkbox').prop("checked", window.localStorage.getItem("vibrate_checkbox"));
}

function getShowList() {
	$.ajax({
		type: "GET",
		url: "https://api.italiansubs.net/api/rest/shows?apikey=632e846bc06f90a91dd9ff000b99ef87",
		dataType: "xml",
		async: false,
 		success: function(xml) {
			//alert(xml);
			var list = $('#series_list');
			list.html("");
			$(xml).find('show').each(function() {
				var name = $(this).find('name').text();				 
				list.append($(document.createElement('li')).html(name));
				list.listview("destroy").listview();
			});
			if(window.localStorage.getItem("vibrate_checkbox") === 'true')
				vibrate();
		},
		error: function(data) {
			alert("error: " + data);
		}
	});
}

function login(show_alert) {
	var username = window.localStorage.getItem("username");
	var password = window.localStorage.getItem("password");
	var authcode;
	if( username !== "" && password !== "") {
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/users/login?apikey=632e846bc06f90a91dd9ff000b99ef87",
			data: {username : username, password: password},
			dataType: "xml",
			async: false,
 			success: function(xml) {
				$(xml).find('user').each(function(){
					authcode = $(this).find('authcode').text();
					if(authcode !== "" && authcode !== undefined && show_alert) {
						alert("Login effettuato con successo");
					}
				});
			},
			error: function(data) {
				alert("error: " + data);
			}
		});
		return authcode;
	}
	else {
		fail("No user found");
	}
}

function getFavoriteList() {
	var authcode = login(false);
	if(authcode !== "" && authcode !== undefined) {
		//alert(authcode);
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/myitasa/shows?",
			data: {authcode : authcode, apikey: "632e846bc06f90a91dd9ff000b99ef87"},
			dataType: "xml",
 			success: function(xml) {
				var list = $('#favorite_list');
				list.html("");
				$(xml).find('show').each(function() {
					var name = $(this).find('name').text();
					list.append($(document.createElement('li')).html(name));
					list.listview("destroy").listview();
				});
				if(window.localStorage.getItem("vibrate_checkbox") === 'true')
					vibrate();
			},
			error: function(data) {
				alert("error: " + data);
			}
		});
	}
	else {
		alert('Errore di autenticazione\nAssicurati di aver creato un account\ne di aver effettuato il login in Impostazioni');
	}
}

function getLatestFavoriteSubs() {
	var authcode = login(false);
	if(authcode !== "" && authcode !== undefined) {
		//alert(authcode);
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/myitasa/lastsubtitles?page=<PAGE=1>?",
			data: {authcode : authcode, apikey: "632e846bc06f90a91dd9ff000b99ef87"},
			dataType: "xml",
 			success: function(xml) {
				var list = $('#latest_favorite_list');
				list.html("");
				$(xml).find('subtitle').each(function() {
					var name = $(this).find('name').text();
					var version = $(this).find('version').text();
					list.append($(document.createElement('li')).html(name + " " + version));
					list.listview("destroy").listview();
				});
				if(window.localStorage.getItem("vibrate_checkbox") === 'true')
					vibrate();
			},
			error: function(data) {
				alert("error: " + data);
			}
		});
	}
	else {
		alert('Errore di autenticazione\nAssicurati di aver creato un account\ne di aver effettuato il login in Impostazioni');
	}
}

function getNextFavoriteSubs() {
	var authcode = login(false);
	if(authcode !== "" && authcode !== undefined) {
		//alert(authcode);
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/myitasa/nextepisodes?page=<PAGE=1>?",
			data: {authcode : authcode, apikey: "632e846bc06f90a91dd9ff000b99ef87"},
			dataType: "xml",
 			success: function(xml) {
				var list = $('#next_favorite_list');
				list.html("");
				$(xml).find('episode').each(function() {
					var name = $(this).find('show_name').text();
					var date = $(this).find('date').text();
					list.append($(document.createElement('li')).html(name + " " + date));
					list.listview("destroy").listview();
				});
				if(window.localStorage.getItem("vibrate_checkbox") === 'true')
					vibrate();
			},
			error: function(data) {
				alert("error: " + data);
			}
		});
	}
	else {
		alert('Errore di autenticazione\nAssicurati di aver creato un account\ne di aver effettuato il login in Impostazioni');
	}
}
