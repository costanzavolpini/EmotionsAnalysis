$(document).ready(function () {
	var value_flushed = 50;
	var value_frown = 50;
	var value_grin = 50;
	var value_surprise = 50;

	// Header Scroll
	$(window).on('scroll', function () {
		var scroll = $(window).scrollTop();

		if (scroll >= 50) {
			$('#header').addClass('fixed');
		} else {
			$('#header').removeClass('fixed');
		}
	});


	// EMOTIONS
	// Flushed
	$("input[id=flushed]").on('input change', getValRangeFlushed);

	function getValRangeFlushed(e) {
		value_flushed = e.target.value;
		$("#flushedValue").text(value_flushed + "%");
	}

	// Frown
	$("input[id=frown]").on('input change', getValRangeFrown);

	function getValRangeFrown(e) {
		value_frown = e.target.value;
		$("#frownValue").text(value_frown + "%");
	}

	// Grin
	$("input[id=grin]").on('input change', getValRangeGrin);

	function getValRangeGrin(e) {
		value_grin = e.target.value;
		$("#grinValue").text(value_grin + "%");
	}

	// Surprise
	$("input[id=surprise]").on('input change', getValRangeSurprise);

	function getValRangeSurprise(e) {
		value_surprise = e.target.value;
		$("#surpriseValue").text(value_surprise + "%");
	}

	var data_emotions_path = {
		"flushed": value_flushed,
		"frown": value_frown,
		"grin": value_grin,
		"surprise": value_surprise
	}

	// Function that handle generate and return of the emotions
	$('#generatePath').click(function (e) {
		e.preventDefault();
		$.ajax({
			url: '/path',
			data: JSON.stringify({"c" : 1}),
			// data: JSON.stringify(data_emotions_path),
			type: 'POST',
			success: function (response) {
				// Should receive the new path image
				$("#pathGenerated")[0].src.replace("path", "giorda");
				var actualPath = $("#pathGenerated")[0].src.replace("path", "giorda")
				$("#pathGenerated").attr("src", actualPath);
			},
			error: function (error) {
				console.log(error);
			}
		});
	});


	$('#experiment').click(function (e) {
		$('#modalVideo').modal('show')
		navigator.permissions.query({
				name: 'camera'
			})
			.then((permissionObj) => {
				console.log(permissionObj.state);
				$.ajax({
					url: '/experiment',
					type: 'GET',
					success: function (response) {
						// Should receive the new path image
						your_result = response.scores

						var ctxRyour = document.getElementById("yourEmotion").getContext('2d');
						var your = new Chart(ctxRyour, {
							type: 'radar',
							data: {
								labels: ["Anger", "Contempt", "Disgust", "Happiness", "Fear", "Neutral", "Sadness", "Surprise"],
								datasets: [{
									label: "YOUR RESULT",
									data: [your_result.anger * 100, your_result.contempt * 100, your_result.disgust * 100, your_result.fear * 100, your_result.happiness * 100, your_result.neutral * 100, your_result.sadness * 100, your_result.surprise * 100],
									backgroundColor: [
										'rgba(105, 0, 132, .2)',
									],
									borderColor: [
										'rgba(200, 99, 132, .7)',
									],
									borderWidth: 2
								}]
							},
							options: {
								responsive: true
							}
						});

						$('#wrapCluster').removeClass("col-md-6").addClass("col-md-5");
					},
					error: function (error) {
						console.log(error);
					}
				});

				$('#videoBoulin').contents().find('video').each(function () {
					this.currentTime = 0;
				});
			})
			.catch((error) => {
				console.log('Got error :', error);
			})
	});


	// Function that takes a set of images and upload it on microsoft azure returning json
	$('#saveUpload').click(function (e) {
		e.preventDefault();
	});


	$('#carouselImages').carousel({
		interval: 1500
	})


	// Fancybox
	$(function () {
		var ctxR = document.getElementById("radarChart").getContext('2d');
		var myRadarChart = new Chart(ctxR, {
			type: 'radar',
			data: {
				labels: ["Anger", "Contempt", "Disgust", "Happiness", "Fear", "Neutral", "Sadness", "Surprise"],
				datasets: [{
					label: "PAINTING NAME",
					data: [65, 59, 90, 81, 56, 55, 40, 20],
					backgroundColor: [
						'rgba(105, 0, 132, .2)',
					],
					borderColor: [
						'rgba(200, 99, 132, .7)',
					],
					borderWidth: 2
				}]
			},
			options: {
				responsive: true
			}
		});


		var finalGraph = document.getElementById("emotionFinal").getContext('2d');
		var myFinalChart = new Chart(finalGraph, {
			type: 'radar',
			data: {
				labels: ["Anger", "Contempt", "Disgust", "Happiness", "Fear", "Neutral", "Sadness", "Surprise"],
				datasets: [{
						label: "PAINTING 1",
						data: [65, 59, 90, 81, 56, 55, 40, 20],
						backgroundColor: [
							'rgba(105, 0, 132, .2)',
						],
						borderColor: [
							'rgba(200, 99, 132, .7)',
						],
						borderWidth: 2
					},
					{
						label: "PAINTING 2",
						data: [5, 50, 80, 91, 96, 45, 20, 40],
						backgroundColor: [
							'rgba(105, 40, 132, .2)',
						],
						borderColor: [
							'rgba(200, 49, 132, .7)',
						],
						borderWidth: 2
					}

				]
			},
			options: {
				responsive: true
			}
		});
	});


	// Page Scroll
	var sections = $('section')
	nav = $('nav[role="navigation"]');

	$(window).on('scroll', function () {
		var cur_pos = $(this).scrollTop();
		sections.each(function () {
			var top = $(this).offset().top - 76
			bottom = top + $(this).outerHeight();
			if (cur_pos >= top && cur_pos <= bottom) {
				nav.find('a').removeClass('active');
				nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
			}
		});
	});
	nav.find('a').on('click', function () {
		var $el = $(this)
		id = $el.attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 75
		}, 500);
		return false;
	});

	// Mobile Navigation
	$('.nav-toggle').on('click', function () {
		$(this).toggleClass('close-nav');
		nav.toggleClass('open');
		return false;
	});
	nav.find('a').on('click', function () {
		$('.nav-toggle').toggleClass('close-nav');
		nav.toggleClass('open');
	});

	// Select floor
	$('#selectFloor').on('show.bs.dropdown', function (ev) {
		// do something…
		console.log(ev.target)
	})

	$(".dropdown-menu li a").click(function () {
		$(".btn:first-child").html($(this).text() + ' <span class="caret"></span>');
	});


	// JSON ------------
	// Read from json data
	function readTextFile(file, callback) {
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		}
		rawFile.send(null);
	}

	//usage:
	readTextFile("/static/js/database.json", function (text) {
		var data = JSON.parse(text);
		console.log("JSON LOADED");

		console.log(data);

		// TODO: detect if we are in url /diagrams
		$(jQuery.parseJSON(JSON.stringify(data))).each(function () {
			var id = this.id;
			var result_arr = this.res;
			var name = this.name;

			var length = result_arr.length;

			var res = [0, 0, 0, 0, 0, 0, 0]

			// find mean
			for (var i = 0; i < length; i++) {
				var max = null

				for (var j = 0; j < result_arr[i].length; j++) {
					if (j != 5) { //remove neutral
						if ((max == null) || (result_arr[i][j] > max)) {
							max = result_arr[i][j]
						}
					}
				}

				for (var j = 0; j < result_arr[i].length; j++) {
					if (j < 5) { //remove neutral
						var normalized = result_arr[i][j] / max
						res[j] = res[j] + normalized
					} else if(j > 5){
						var normalized = result_arr[i][j] / max
						res[j-1] = res[j-1] + normalized
					}
				}
			}

			console.log(res)

			// invert happiness with neutral just for a nicer result
			var temp = res[3]
			res[3] = res[1]
			res[1] = temp

			var div = document.createElement("div");
			div.classList.add("col");

			var canvas = document.createElement("canvas");
			canvas.setAttribute("id", id);

			div.appendChild(canvas);

			$("#diagrams")[0].appendChild(div);

			// Add code for chart
			var ctxR = document.getElementById(id).getContext('2d');
			var myRadarChart = new Chart(ctxR, {
				type: 'radar',
				data: {
					// anger, contempt, disgust, fear, happiness, neutral, sadness, surprise
					// invert fear and contempt
					// fear 3 contempt 1
					labels: ["Anger", "Fear", "Disgust", "Contempt", "Happiness", "Sadness", "Surprise"],
					datasets: [{
						label: name,
						data: res,
						backgroundColor: [
							'rgba(244, 240, 242, .9)',
						],
						borderColor: [
							'rgba(213, 208, 206, .7)',
						],
						pointBackgroundColor: [
							'rgba(244, 240, 242, .9)',
						],
						pointBorderColor: [
							'rgba(213, 208, 206, .7)',
						],
						borderWidth: 1
					}]
				},
				options: {
					responsive: true,
					scale: {
						ticks: {
							display: false,
							maxTicksLimit: 1
						}
					},
					//  showScale: false,
					//  labels: {
					// 	 fontFamily: "Garamond Black"
					// }
				}
			});


		});

	});
});