$("body").delegate(".logout", "click", function(e) {
    localStorage.clear();
    window.location = '/';
});

function formatAMPM(timedate) {
	const date = new Date(timedate);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function nth(d) {
	if (d > 3 && d < 21) return 'th';
	switch (d % 10) {
		case 1:  return "st";
		case 2:  return "nd";
		case 3:  return "rd";
		default: return "th";
	}
}

function niceDate(timedate, withyear=true) {
	const fortnightAway = new Date(timedate);
	const date = fortnightAway.getDate();
	const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][fortnightAway.getMonth()];

	if (withyear) {
		var cdate = `${month} ${date}${nth(date)}, ${fortnightAway.getFullYear()}`;
	} else {
		var cdate = `${month} ${date}${nth(date)}`;
	}
	return cdate;
}

function niceDateTime(timedate) {
	var datetime = `${niceDate(timedate)} at ${formatAMPM(timedate)}`;
	return datetime; 
}

function getCoordinates(address) {
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&key='+ GOOGLE_MAP_KEY;

	var jqXHR = $.ajax({
        url: url,
        type: 'GET',
        async: false,
	});

	var data = JSON.parse(jqXHR.responseText);
	return {
		lat: data.results[0].geometry.location.lat.toFixed(6),
		lng: data.results[0].geometry.location.lng.toFixed(6),
	}
}

function show_message(message) {
    swal(message, {
      buttons: false,
      timer: 3000,
    });
}

function parseQuerystring(){
    var foo = window.location.href.split('?')[1].split('#')[0].split('&');
    var dict = {};
    var elem = [];
    for (var i = foo.length - 1; i >= 0; i--) {
        elem = foo[i].split('=');
        dict[elem[0]] = elem[1];
    };
    return dict;
};