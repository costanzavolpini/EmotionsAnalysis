function formatTime(totalSec){
	const hours = parseInt( totalSec / 3600 ) % 24;
	const minutes = parseInt( totalSec / 60 ) % 60;
	const seconds = totalSec % 60;

	let result = (hours < 1 ? '': hours + ':') ;
	result +=  (minutes < 1 ? "00:" : minutes + ':') ;
	result += (seconds  < 10 ? "0" + seconds : seconds);
	return result;
}

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		const reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}