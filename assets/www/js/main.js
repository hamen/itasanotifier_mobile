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
	$.ajax({
		type: "GET",
		url: "http://feeds.feedburner.com/ITASA-Ultimi-Sottotitoli?option=com_rsssub&type=lastsub",
		dataType: "xml",
		success: function(xml) {
			var list = $('#latest20subs_list');
			list.html("");
			$(xml).find('title').each(function(){
				var title = $(this).text();
				if(title != "Ultimi Sottotitoli" && title != "LOGO ITASA") {
					var link = $(this).next().text();
					list.append($(document.createElement('li')).html(title));
					//alert(title + " " + link);
				}
				list.listview("destroy").listview();
			});
			vibrate();
		}
	});
}



function getSub( ) {
	
}

function onMenuKeyDown() {
	alert('menu');
}

function saveUserData() {
	var username = $('#username').val();
	var password = $('#password').val();
	window.localStorage.setItem("username", username);
	window.localStorage.setItem("password", password);

	if (window.localStorage.getItem("username") == username &&
		window.localStorage.getItem("password") == password) {
		navigator.notification.alert("Saved");
	}
}

function loadUserSavedData() {
	var username = window.localStorage.getItem("username");
	var password = window.localStorage.getItem("password");
	if( username !== "" && password !== "") {
		$('#username').val(username);
		$('#password').val(password);
	}
}

function getShowList() {
	$.ajax({
		type: "GET",
		url: "https://api.italiansubs.net/api/rest/shows?apikey=632e846bc06f90a91dd9ff000b99ef87",
		dataType: "xml",
 		success: function(xml) {
			//alert(xml);
			var list = $('#series_list');
			list.html("");
			$(xml).find('show').each(function() {
				var name = $(this).find('name').text();				 
				list.append($(document.createElement('li')).html(name));
				list.listview("destroy").listview();
			});
			vibrate();
		},
		error: function(data) {
		alert("error: " + data);
		}
	});
}
