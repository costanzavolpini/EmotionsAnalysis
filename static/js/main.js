$(document).ready(function () {
	// Header Scroll
	$(window).on('scroll', function () {
		var scroll = $(window).scrollTop();

		if (scroll >= 50) {
			$('#header').addClass('fixed');
		} else {
			$('#header').removeClass('fixed');
		}
	});

	// Fancybox
	// $('.work-box').fancybox();
$(function () {
	console.log("here")
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