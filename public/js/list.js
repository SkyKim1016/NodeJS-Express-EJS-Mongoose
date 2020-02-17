let delay;

function loadingDelay() {
	delay = setTimeout(showPage, 800);
}

function showPage() {
	document.getElementById("loader").style.display = "none";
	document.getElementById("LoadingWrapper").style.display = "block";
}

function pageLimit() {
	currentPageLimit = <%= pageLimit %> + 10
	location.href = "/list?pageLimit=" + currentPageLimit;
}
/*
$(document).ready(function () {

	$('.btn btn-outline-secondary border-left-0').css( 'height', 38 + 'px !important' )
	$('.body_container2_div3_span_timestamp').each(function (index) {
		timestamp = $("#timestamp" + index).innerHTML
		timestampFormat = moment(timestamp).format('YYYY.MM.DD HH:MM')

		$('#timestamp' + index).text(timestampFormat)
	})

});
*/
$('#calendarbutton').click(function () {
	('#datepicker').datepicker('show');
});
