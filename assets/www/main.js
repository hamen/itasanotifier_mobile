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
    navigator.notification.vibrate(2000);
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

function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
	document.addEventListener("menubutton", onMenuKeyDown, false);
}

function onDeviceReady() {
	getLatestSubs();
}

function getLatestSubs() {
	new Ajax.Request('http://feeds.feedburner.com/ITASA-Ultimi-Sottotitoli?option=com_rsssub&type=lastsub', {
		method:'get',
		onSuccess: function(transport) {
			var response = transport.responseXML || "no response text";
			var titles = response.documentElement.getElementsByTagName("title");
			var links = response.documentElement.getElementsByTagName("link");
			var list = $('latest20subs_list');
			for (var i = 3; i < titles.length; i++) {
				list.insert('<li>' + titles[i].childNodes[0].nodeValue + '</li>');
			}
			beep();
		},
		onFailure: function(){ alert('Something went wrong...'); }
	});
}

function getSub( ) {
	
}

function onMenuKeyDown() {
	alert('menu');
}
