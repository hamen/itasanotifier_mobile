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
	
	$('#save_button').click(function(){
		saveUserData();
	});

	$('#login_button').click(function(){
		login(true);
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

	$('#exit_button').click(function(){
		navigator.app.exitApp();
	});
	
	$('#vibrate_checkbox').click(function(){
		if(this.checked) {
			window.localStorage.setItem("vibrate_checkbox", true);
		}
		else {
			window.localStorage.setItem("vibrate_checkbox", false);
		}
	});

	$('#newsButton').click(function(){
		getNews();
	});

	$('#news_refresh_button').click(function(){
		getNews();
	});

	$('.thumb').live("click", function(){
		showNewsDialog($(this).attr('show_id'));
	});

	$("#myitasaButton").click(function(){
		$.mobile.changePage('#myitasa');
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

function onMenuKeyDown() {
	$.mobile.changePage("#settings");
}

function onBackKeyDown() {
	window.history.back();
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
	var list = $('#series_list');
	list.html("");
	$.ajax({
		type: "GET",
		url: "https://api.italiansubs.net/api/rest/shows?apikey=632e846bc06f90a91dd9ff000b99ef87",
		dataType: "xml",
		async: false,
 		success: function(xml) {
			//alert(xml);
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
	var list = $('#favorite_list');
	list.html("");
	var authcode = login(false);
	if(authcode !== "" && authcode !== undefined) {
		//alert(authcode);
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/myitasa/shows?",
			data: {authcode : authcode, apikey: "632e846bc06f90a91dd9ff000b99ef87"},
			dataType: "xml",
 			success: function(xml) {
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
		$.mobile.changePage("#favorite");
	}
	else {
		alert('Errore di autenticazione\nAssicurati di aver creato un account\ne di aver effettuato il login in Impostazioni');
	}
}

function getLatestFavoriteSubs() {
	var list = $('#latest_favorite_list');
	list.html("");
	var authcode = login(false);
	if(authcode !== "" && authcode !== undefined) {
		//alert(authcode);
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/myitasa/lastsubtitles?page=<PAGE=1>?",
			data: {authcode : authcode, apikey: "632e846bc06f90a91dd9ff000b99ef87"},
			dataType: "xml",
 			success: function(xml) {
				$(xml).find('subtitle').each(function() {
					var nameNep = $(this).find('name').text();
					var name = nameNep.substr(0, nameNep.lastIndexOf(' '));
					var episode = nameNep.substr(nameNep.lastIndexOf(' '));
					var version = $(this).find('version').text();
					var id = $(this).find('id').text();
					var img = '<img src="http://www.italiansubs.net/varie/ico/' + name + '.png"/>';
					var h3 = '<h3>' + name + '</h3>';
					var p = '<p>' + episode + '</p>';
					list.append('<li>' + img + h3 + p + '</li>');
					list.listview("destroy").listview();
				});
				if(window.localStorage.getItem("vibrate_checkbox") === 'true')
					vibrate();
			},
			error: function(data) {
				alert("error: " + data);
			}
		});
		$.mobile.changePage("#latest_favorite");
	}
	else {
		alert('Errore di autenticazione\nAssicurati di aver creato un account\ne di aver effettuato il login in Impostazioni');
	}
}

function getNextFavoriteSubs() {
	var list = $('#next_favorite_list');
	list.html("");
	var authcode = login(false);
	if(authcode !== "" && authcode !== undefined) {
		//alert(authcode);
		$.ajax({
			type: "GET",
			url: "https://api.italiansubs.net/api/rest/myitasa/nextepisodes?page=<PAGE=1>?",
			data: {authcode : authcode, apikey: "632e846bc06f90a91dd9ff000b99ef87"},
			dataType: "xml",
 			success: function(xml) {
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
		$.mobile.changePage("#next_favorite");
	}
	else {
		alert('Errore di autenticazione\nAssicurati di aver creato un account\ne di aver effettuato il login in Impostazioni');
	}
}

function getNews() {
	var news_img_url = [];
	$('#new_table').empty();
	$.ajax({
		type: "GET",
		url: "https://api.italiansubs.net/api/rest/news?page=1",
		dataType: "xml",
		data: {apikey: "632e846bc06f90a91dd9ff000b99ef87"},
		async: false,
		success: function(xml) {
			$(xml).find('news > news').each(function() {
				var image = $(this).find('thumb').text();
				var id = $(this).find('id').text();
				news_img_url.push({ 'image_url' : image, 'id' : id });
			});
			if(window.localStorage.getItem("vibrate_checkbox") === 'true')
				vibrate();
		},
		error: function() {
			alert('Something was wrong');
		}
	});

	var news_index = 0;
	$('#news_table tr').each(function(i) {
		$(this).find('td:first span')
			.html('<a class="thumb" show_id="' + news_img_url[news_index].id +'" data-rel="dialog" data-transition="none" href="#show_dialog_page"><img src="'+ news_img_url[news_index].image_url + '" /></a>');

		$(this).find('td:last span')
			.html('<a class="thumb" show_id="' + news_img_url[news_index+1].id +'" data-rel="dialog" data-transition="none" href="#show_dialog_page"><img src="'+ news_img_url[news_index+1].image_url + '" /></a>');
		news_index += 2;
	});
}

function getNewsByID(id) {
	var show;
	$.ajax({
		type: "GET",
		url: "https://api.italiansubs.net/api/rest/news/" + id,
		dataType: "xml",
		data: {apikey: "632e846bc06f90a91dd9ff000b99ef87"},
		async: false,
		success: function(xml) {
			$(xml).find('news').each(function() {
				var show_name = $(this).find('show_name').text();
				var info = $(this).find('info').text();
				var image_url = $(this).find('image').text();
				var episode = $(this).find('episode').text();
				show = {
					'show_name' : show_name,
					'info' : info,
					'image_url' : image_url,
					'episode' : episode
				};
			});
			// if(window.localStorage.getItem("vibrate_checkbox") === 'true')
			// 	vibrate();
		},
		error: function() {
			alert('Something was wrong');
		}
	});
	return show;
}

function showNewsDialog(id) {
	var show = getNewsByID(id);
	var page = $("#show_dialog_page");
	var content = page.find('.dialog_content');
	page.find('h1').html(show.show_name);
	content.empty();
	content.append('<div style="text-align: center"><img src="' + show.image_url + '"/></div>');
	content.append('<h3>Episode ' + show.episode + '</h3>');
	content.append('<p>' + show.info + '</p>');
}

function websiteLogin() {
	$.ajax({
		type: 'POST',
		url: "http://www.italiansubs.net/index.php",
		data: {
			"username" : window.localStorage.getItem("username"),
			"passwd" : window.localStorage.getItem("password"),
			"remember" : "yes",
			"Submit" : "Login",
			"silent" : "true",
			"task" : "login",
			"option" : "com_user"
		},
		success: function(resp) {
			console.log(resp);
		},
		error: function(resp) {
			console.log(resp);
		}
	});
}
