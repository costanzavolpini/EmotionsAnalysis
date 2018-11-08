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
	}

	// Frown
	$("input[id=frown]").on('input change', getValRangeFrown);

	function getValRangeFrown(e){
		value_frown = e.target.value;
	}

	// Grin
	$("input[id=grin]").on('input change', getValRangeGrin);

	function getValRangeGrin(e){
		value_grin = e.target.value;
	}

	// Surprise
	$("input[id=surprise]").on('input change', getValRangeSurprise);

	function getValRangeSurprise(e){
		value_surprise = e.target.value;
	}

	var data_emotions_path = {
		"flushed" : value_flushed,
		"frown" : value_frown,
		"grin" : value_grin,
		"surprise" : value_surprise
	}

	$('#generatePath').click(function(e) {
		e.preventDefault();
        $.ajax({
            url: '/path',
            data: JSON.stringify(data_emotions_path),
            type: 'POST',
            success: function(response) {
				console.log("ehh");

                console.log(response);
            },
            error: function(error) {
                console.log(error);
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
			labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
			datasets: [{
					label: "My First dataset",
					data: [65, 59, 90, 81, 56, 55, 40],
					backgroundColor: [
						'rgba(105, 0, 132, .2)',
					],
					borderColor: [
						'rgba(200, 99, 132, .7)',
					],
					borderWidth: 2
				},
				{
					label: "My Second dataset",
					data: [28, 48, 40, 19, 96, 27, 100],
					backgroundColor: [
						'rgba(0, 250, 220, .2)',
					],
					borderColor: [
						'rgba(0, 213, 132, .7)',
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