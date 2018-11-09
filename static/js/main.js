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

	function getValRangeFlushed(e){
		value_flushed = e.target.value;
		$("#flushedValue").text(value_flushed + "%");
	}

	// Frown
	$("input[id=frown]").on('input change', getValRangeFrown);

	function getValRangeFrown(e){
		value_frown = e.target.value;
		$("#frownValue").text(value_frown + "%");
	}

	// Grin
	$("input[id=grin]").on('input change', getValRangeGrin);

	function getValRangeGrin(e){
		value_grin = e.target.value;
		$("#grinValue").text(value_grin + "%");
	}

	// Surprise
	$("input[id=surprise]").on('input change', getValRangeSurprise);

	function getValRangeSurprise(e){
		value_surprise = e.target.value;
		$("#surpriseValue").text(value_surprise + "%");
	}

	var data_emotions_path = {
		"flushed" : value_flushed,
		"frown" : value_frown,
		"grin" : value_grin,
		"surprise" : value_surprise
	}

	// Function that handle generate and return of the emotions
	$('#generatePath').click(function(e) {
		e.preventDefault();
        $.ajax({
            url: '/path',
            data: JSON.stringify(data_emotions_path),
            type: 'POST',
            success: function(response) {
				// Should receive the new path image
				$("#pathGenerated")[0].src.replace("path", "giorda");
				var actualPath = $("#pathGenerated")[0].src.replace("path", "giorda")
				$("#pathGenerated").attr("src", actualPath);
            },
            error: function(error) {
                console.log(error);
            }
        });
	});


	$('#experiment').click(function(e){
		navigator.permissions.query({name: 'camera'})
		.then((permissionObj) => {
			console.log(permissionObj.state);
			$.ajax({
				url: '/experiment',
				type: 'GET',
				success: function(response) {
					// Should receive the new path image
					console.log("EHII")
					console.log(response)
				},
				error: function(error) {
					console.log(error);
				}
			});
			$('#modalVideo').modal('show')
		})
		.catch((error) => {
		 console.log('Got error :', error);
		})
	});


	// Function that takes a set of images and upload it on microsoft azure returning json
	$('#saveUpload').click(function(e) {
		e.preventDefault();
        // $.ajax({
			// MICROSOFT AZURE
            // url: '/path',
            // // data: JSON.stringify(data_emotions_path), set of images
            // type: 'POST',
            // success: function(response) {
			// 	// Should receive the JSON WITH VALUES
			// 	Generate a new data/cluster to show instead of card of pingu in order to compare result!
            // },
            // error: function(error) {
            //     console.log(error);
            // }
		// });

		$('#wrapCluster').removeClass("col-md-6").addClass("col-md-5");

		var ctxRyour = document.getElementById("yourEmotion").getContext('2d');
		var your = new Chart(ctxRyour, {
			type: 'radar',
			data: {
				labels: ["Anger", "Contempt", "Disgust", "Happiness", "Fear", "Neutral", "Sadness", "Surprise"],
				datasets: [{
						label: "YOUR RESULT",
						data: [65, 59, 90, 81, 56, 55, 40, 20],
						backgroundColor: [
							'rgba(105, 0, 132, .2)',
						],
						borderColor: [
							'rgba(200, 99, 132, .7)',
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




	// Fancybox
	// $('.work-box').fancybox();
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
				}
			]
		},
		options: {
			responsive: true
		}
	});


	var finalGraph =  document.getElementById("emotionFinal").getContext('2d');
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


	// // Flexslider
	// $('.flexslider').flexslider({
	// 	animation: "fade",
	// 	directionNav: false,
	// });

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
});