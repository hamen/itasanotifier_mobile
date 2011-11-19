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