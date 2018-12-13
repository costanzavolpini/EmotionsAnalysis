$(document).ready(function () {
	// Main JS
	scrollHeader();
	fillCarousel();
	sliderEmotions();
	generatePath();
	runExperiment();

	// HEADER SCROLL
	function scrollHeader() {
		$(window).on('scroll', function () {
			var scroll = $(window).scrollTop();

			if (scroll >= 50) {
				$('#header').addClass('fixed');
			} else {
				$('#header').removeClass('fixed');
			}
		});

		$('.nav-btn').click(function () {
			var divId = $(this).attr('href');
			$('html, body').animate({
				scrollTop: $(divId).offset().top - 100
			}, 100);
		});
	}

	// Slider emotions
	function sliderEmotions() {
		var emotions = {
			anger: 50,
			fear: 50,
			disgust: 50,
			contempt: 50,
			happiness: 50,
			surprise: 50
		}

		$.each(emotions, function (key, obj) {
			$(`input[id=${key}]`).on('input change', function (e) {
				$(`#${key}Value`).text(e.target.value + "%");
			});
		});
	}

	// Generate path
	function generatePath() {
		$('#generatePath').click(function (e) {
			var d = new Date / 1E3 | 0;
			var path = $("#pathGenerated")[0].src.replace(/\/[^\/]*$/, "/pathGenerated" + d + ".png");
			console.log(path);


			var duration = $("#durationVisit")[0].value;
			if (duration) {
				duration = Math.round(parseFloat(duration.replace(/[^\d\.]*/g, ''))); // get number
			} else {
				duration = 24;
			}

			var data_emotions_path = {
				"anger": $("#anger").val() / 100.0,
				"fear": $("#fear").val() / 100.0,
				"disgust": $("#disgust").val() / 100.0,
				"contempt": $("#contempt").val() / 100.0,
				"happiness": $("#happiness").val() / 100.0,
				"sadness": $("#sadness").val() / 100.0,
				"surprise": $("#surprise").val() / 100.0,
				"date": "" + d,
				"duration": duration
			}

			$("#imagePath")[0].innerHTML = `<div class="loader medium" style="margin: auto; margin-top: 25%;"></div>`;
			e.preventDefault();
			$.ajax({
				url: '/pathgenerator',
				dataType: "text",
				contentType: "application/json",
				data: JSON.stringify(data_emotions_path),
				type: 'POST',
				success: function (response) {
					// Should receive the new path image
					$("#imagePath")[0].innerHTML = `<img src="${path}" id="pathGenerated" alt="Path of museum" style="width: 60%;">`
				},
				error: function (error) {
					console.log(error);
				}
			});

		});
	}

	// fill a chart
	function fillChart(typeChar, idCanvas, nameCanvas1, input1, nameCanvas2, input2) {
		var data = normalizeData(input1);
		var datasets = [];
		var dataset_1 = {
			label: nameCanvas1,
			data: [data['anger'], data['contempt'], data['disgust'], data['fear'], data['happiness'], data['sadness'], data['surprise']],
			backgroundColor: ['rgba(254, 164, 126, .5)', ],
			borderColor: ['rgba(254, 164, 126, .5)', ],
			borderWidth: 2
		};

		if (input2) {
			var data_table = normalizeData(input2);

			var dataset_2 = {
				label: nameCanvas2,
				data: [data_table['anger'], data_table['contempt'], data_table['disgust'], data_table['fear'], data_table['happiness'], data_table['sadness'], data_table['surprise']],
				backgroundColor: ['rgba(139, 69, 19, .5)', ],
				borderColor: ['rgba(139, 69, 19, .5)', ],
				borderWidth: 2
			}
			datasets = [dataset_1, dataset_2];
		} else {
			datasets = [dataset_1];
		}


		var config = {
			type: typeChar,
			data: {
				labels: ["Anger", "Fear", "Disgust", "Contempt", "Happiness", "Sadness", "Surprise"],
				datasets: datasets
			},
			options: {
				responsive: true,
				scale: {
					ticks: {
						display: false,
						maxTicksLimit: 1
					}
				}
			}
		};

		var chart = new Chart($(`#${idCanvas}`)[0].getContext('2d'), config);
		return chart;
	}


	// fill a chart
	function fillChartTime(typeChar, idCanvas, input1) {
		var data = {
			'1': {
				'anger': null,
				'contempt': null,
				'disgust': null,
				'fear': null,
				'happiness': null,
				'sadness': null,
				'surprise': null
			},
			'2': {
				'anger': null,
				'contempt': null,
				'disgust': null,
				'fear': null,
				'happiness': null,
				'sadness': null,
				'surprise': null
			},
			'3': {
				'anger': null,
				'contempt': null,
				'disgust': null,
				'fear': null,
				'happiness': null,
				'sadness': null,
				'surprise': null
			},
			'4': {
				'anger': null,
				'contempt': null,
				'disgust': null,
				'fear': null,
				'happiness': null,
				'sadness': null,
				'surprise': null
			}
		};

		for (var t in input1) {
			data[t] = normalizeData(input1[t]);
		}

		var labels = ["1s", "2s", "3s", "4s"];


		var datasets = [{
				label: "Anger",
				data: [data['1']['anger'], data['2']['anger'], data['3']['anger'], data['4']['anger']],
				backgroundColor: [
					'rgba(244, 237, 124, .5)',
				],
				borderColor: [
					'rgba(244, 237, 124, .5)',
				],
				borderWidth: 1
			},
			{
				label: "Fear",
				data: [data['1']['fear'], data['2']['fear'], data['3']['fear'], data['4']['fear']],
				backgroundColor: [
					'rgba(249, 214, 22, .5)',
				],
				borderColor: [
					'rgba(249, 214, 22, .5)',
				],
				borderWidth: 1
			},
			{
				label: "Disgust",
				data: [data['1']['disgust'], data['2']['disgust'], data['3']['disgust'], data['4']['disgust']],
				backgroundColor: [
					'rgba(247, 181, 12, .5)',
				],
				borderColor: [
					'rgba(247, 181, 12, .5)',
				],
				borderWidth: 1
			},
			{
				label: "Contempt",
				data: [data['1']['contempt'], data['2']['contempt'], data['3']['contempt'], data['4']['contempt']],
				backgroundColor: [
					'rgba(249, 155, 12, .5)',
				],
				borderColor: [
					'rgba(249, 155, 12, .5)',
				],
				borderWidth: 1
			},
			{
				label: "Happiness",
				data: [data['1']['happiness'], data['2']['happiness'], data['3']['happiness'], data['4']['happiness']],

				backgroundColor: [
					'rgba(244, 124, 0, .5)',
				],
				borderColor: [
					'rgba(244, 124, 0, .5)',
				],
				borderWidth: 1
			},
			{
				label: "Sadness",
				data: [data['1']['sadness'], data['2']['sadness'], data['3']['sadness'], data['4']['sadness']],
				backgroundColor: [
					'rgba(249, 107, 7, .5)',
				],
				borderColor: [
					'rgba(249, 107, 7, .5)',
				],
				borderWidth: 1
			},
			{
				label: "Surprise",
				data: [data['1']['surprise'], data['2']['surprise'], data['3']['surprise'], data['4']['surprise']],
				backgroundColor: [
					'rgba(209, 91, 5, .5)',
				],
				borderColor: [
					'rgba(209, 91, 5, .5)',
				],
				borderWidth: 1
			}
		];


		var config = {
			type: typeChar,
			data: {
				labels: labels,
				datasets: datasets
			},
			options: {
				responsive: true,
			}
		};

		var chart = new Chart($(`#${idCanvas}`)[0].getContext('2d'), config);
		return chart;
	}

	// Take pictures, update database, return result obtained on Azure Microsoft
	function runExperiment() {
		// Function to generate a sequence of slideshow and so on
		// open on click!
		function experiment() {
			// 101 - 123
			var sequence = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]

			// function to random generate a sequence
			function shuffle(array) {
				var currentIndex = array.length,
					temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}
				return array;
			}

			sequence = shuffle(sequence);
			var inner = "<div class='carousel-inner'>"

			var first = true;
			sequence.forEach(function (value_random) {
				if (first) {
					inner += "<div class='carousel-item active'>"
					first = false
				} else inner += "<div class='carousel-item'>"
				inner += "<img class='d-block h-100' style='margin-left: auto; margin-right: auto; height:150%; width:auto;' src='/static/images/floor1/"
				inner += value_random + ".jpg'>"

				inner += "</div>";
			});
			inner += "</div><a class='carousel-control-prev' href='#experimentRunning' role='button' data-slide='prev'><span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='sr-only'>Previous</span></a><a class='carousel-control-next' href='#experimentRunning' role='button' data-slide='next'><span class='carousel-control-next-icon' aria-hidden='true'></span><span class='sr-only'>Next</span></a>";

			$("#slideShowExperiment")[0].innerHTML = inner;

			$("#slideShowExperiment").carousel({
				pause: true,
				interval: false,
				keyboard: false
			})

			return sequence;
		}

		function startExperiment() {
			$.ajax({
				url: '/experiment/table',
				type: 'GET',
				success: function (table) {
					$('#modalVideo').modal({
						'show': true,
						backdrop: 'static' //avoid possibility to closs a modal
					});
					navigator.permissions.query({
							name: 'camera'
						}).then((permissionObj) => {
							console.log(permissionObj.state);
							var sequence = experiment();
							//Generate path to pass in the get
							var sequenceurl = sequence.join("-");

							var first = true;
							var d = new Date();
							var dirname = sequenceurl + d.getTime();

							$.ajax({
								url: `/experiment/folder?dirname=${dirname}`,
								type: 'GET',
								success: function (succRes) {
									console.log(succRes);

									$.ajax({
										url: '/experiment/person',
										type: 'GET',
										success: function (idPerson) {
											console.log(idPerson);

											// put loader
											var total = $('#slideShowExperiment div.carousel-item').length;

											function getPhoto(dirname, idPerson, id) {
												console.log(sequence[id]);
												console.log(sequence[id]);
												$('#slideShowExperiment').carousel(id);
												$.ajax({
													url: `/experiment?sequence=${dirname}&person=${idPerson}&id=${sequence[id]}`,
													type: 'GET',
													success: function (res) {
														var next = id + 1;
														if (next < total) {
															getPhoto(dirname, idPerson, next);
														} else {
															// $("#modalexperiment")[0].innerText = "Loading data..."
															// $('#bodyLoading')[0].innerHTML = `<div class="loader medium" style="margin: auto;"></div>`;
															$.ajax({
																url: '/experiment/emotion?person=' + idPerson,
																type: 'GET',
																success: function (resultsPainting) {
																	$('#modalVideo').modal('hide');
																	$('#modalResultExperiment').modal('show');
																	var container = document.getElementById("resultExperiment");

																	// Fill Modal with charts obtained during the experiment
																	for (var k in resultsPainting) {
																		var resultPerson = resultsPainting[k];
																		var resultPeople = table[k];
																		var s = null;

																		var div = document.createElement("div");
																		var h5 = document.createElement("h5");
																		h5.innerHTML = `${resultPerson['name']}`
																		var canvas = document.createElement("canvas");
																		canvas.setAttribute("id", `${resultPerson['person'] + "-" + k}`);
																		div.appendChild(h5);
																		div.appendChild(canvas);
																		container.appendChild(div);

																		var idCanvas = `${resultPerson['person'] + "-" + k}`
																		fillChart('radar', idCanvas, "you", resultPerson, "others", resultPeople);
																	}

																	$('#modalResultExperiment').modal('hide');
																	$('#modalResultExperiment').modal('show');
																	$('#modalResultExperiment').data('bs.modal').handleUpdate()
																},
																error: function (error) { // error for retrieve the emotion of a person
																	console.log(error);
																}
															})
														}

													},
													error: function (error) {
														console.log(error);
													}
												});

											}

											getPhoto(dirname, idPerson, 0);
										},
										error: function (error) { // error for send sequence and do the experiment
											console.log(error);
										}
									});
								},
								error: function (error) { // error for send sequence and do the experiment
									console.log(error);
								}
							});

						})

						.catch((error) => { //error for navigation permission
							console.log('Got error :', error);
						})

				},
				error: function (error) { //error for /experiment/table
					console.log(error);
				}
			});

		}

		$('#experiment').click(startExperiment);

	}

	// Helper functions:
	function normalizeData(input) {
		var max = null;
		var min = null;
		var emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'sadness', 'surprise']
		// Find max and min
		for (var i in input) {
			if (emotions.includes(i)) {
				if (max == null || input[i] > max) max = input[i]
				if (min == null || input[i] < min) min = input[i]
			}
		}
		var data = {}
		//normalize and log(x + 1)
		for (var i in input) {
			if (emotions.includes(i)) {
				var normalized = (input[i] - min) / (max - min)
				data[i] = (Math.log(normalized + 1)).toFixed(3)
			}
		}
		return data;
	}

	// Fill carousel with Liu Bolin painting
	function fillCarousel() {
		addInsideHtml();

		function addInsideHtml() {
			var ids = ["101", "102", "103", "1122", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123"];

			// Set before looping inside!
			var div_row = document.createElement("div");
			div_row.classList.add("row");
			var div_item = document.createElement("div");
			div_item.classList.add("carousel-item", "active");
			div_item.appendChild(div_row);
			$("#container-bolin")[0].appendChild(div_item);

			var count = 0;

			for (var i in ids) {
				var id = ids[i];
				// Add Modals
				var modal = generateModal(id);
				$("#modalsBulin")[0].appendChild(modal);
				// Add Images
				var res_img = addImages(id, count, div_row);
				count = res_img[0];
				div_row = res_img[1];
			}

			fillChartsModal(ids);

			$('#carouselImages').carousel({
				interval: 2800
			});
		}

		function generateModal(id) {
			var div_out_modal = document.createElement("div");
			div_out_modal.classList.add("modal", "fade");
			div_out_modal.setAttribute("id", "modal-" + id)
			div_out_modal.setAttribute("tabindex", "-1")
			div_out_modal.setAttribute("role", "dialog")
			div_out_modal.setAttribute("aria-labelledby", "painting" + id)
			div_out_modal.setAttribute("aria-hidden", "true")

			var div_modal_dialog = document.createElement("div");
			div_modal_dialog.classList.add("modal-dialog", "modal-lg");
			div_modal_dialog.setAttribute("role", "document");

			var div_modal_content = document.createElement("div");
			div_modal_content.classList.add("modal-content");

			var div_modal_header = document.createElement("div");
			div_modal_header.classList.add("modal-header");

			// Body Modal
			var modal_title = document.createElement("h4");
			modal_title.classList.add("modal-title", "w-100");
			modal_title.setAttribute("id", "painting" + id);
			modal_title.innerText = "Emotions analysis";

			div_modal_header.appendChild(modal_title);

			div_modal_content.appendChild(div_modal_header);

			var div_modal_body = document.createElement("div");
			div_modal_body.classList.add("modal-body");

			var canvas = document.createElement("canvas");
			canvas.setAttribute("id", "canvas-" + id);
			div_modal_body.appendChild(canvas);

			div_modal_content.appendChild(div_modal_body);

			// Statistics
			var statistics = document.createElement("div");
			statistics.classList.add("row", "mg-20-top");

			var statistics_left = document.createElement("div");
			statistics_left.classList.add("col");

			var statistics_right = document.createElement("div");
			statistics_right.classList.add("col");

			var canvas_line = document.createElement("canvas");
			canvas_line.setAttribute("id", "canvasline-" + id);
			statistics_right.appendChild(canvas_line);

			statistics.appendChild(statistics_left);
			statistics.appendChild(statistics_right);

			div_modal_body.appendChild(statistics);

			var div_modal_footer = document.createElement("div");
			div_modal_footer.classList.add("modal-footer");

			var button_footer = document.createElement("button");
			button_footer.classList.add("btn", "sunny-morning-gradient", "btn-sm");
			button_footer.setAttribute("data-dismiss", "modal");
			button_footer.innerText = "Close";

			div_modal_footer.appendChild(button_footer);
			div_modal_content.appendChild(div_modal_footer);

			div_modal_dialog.appendChild(div_modal_content);
			div_out_modal.appendChild(div_modal_dialog);
			return div_out_modal;
		}

		function addImages(id, count, div_row) {
			// Add dynamically all the images in carousel
			var div = document.createElement("div");
			div.classList.add("col", "work");

			var a = document.createElement("a");
			a.setAttribute("id", "a-" + id);
			a.setAttribute("data-toggle", "modal");
			a.setAttribute("data-target", "modal-" + id);
			a.classList.add("work-box", "imageBolin");

			a.addEventListener("click", function () {
				$("#modal-" + id).modal('show');
			});

			var img = document.createElement("img");
			img.setAttribute("src", "/static/images/bolin/" + id + ".jpg");

			a.appendChild(img);

			var div_inner = document.createElement("div");
			div_inner.classList.add("overlay");

			var div_inner2 = document.createElement("div");
			div_inner2.classList.add("overlay-caption");

			var p = document.createElement("p");
			var span = document.createElement("span");
			span.classList.add("icon", "icon-magnifying-glass");
			p.appendChild(span);

			div_inner2.appendChild(p);
			div_inner.appendChild(div_inner2);

			a.appendChild(div_inner);

			div.appendChild(a);

			if (count != 0 & count % 6 == 0) {
				var div_row = document.createElement("div");
				div_row.classList.add("row");

				var div_item = document.createElement("div");
				div_item.classList.add("carousel-item");

				div_item.appendChild(div_row);

				$("#container-bolin")[0].appendChild(div_item);
			}
			div_row.appendChild(div);
			count = count + 1;
			return [count, div_row];
		}

		function fillChartsModal(keys) {
			if (keys.length > 0) {
				var id = keys[0];
				keys = keys.slice(1);
				var idPic = null;

				if (id == "1122")
					idPic = "112";
				else idPic = id;


				$.ajax({
					url: '/experiment/painting?id=' + idPic,
					type: 'GET',
					success: function (result) {
						var datas = {}

						for (var r in result) {
							datas[r] = normalizeData(result[r]);
							datas[r]["name"] = result[r]["name"];
						}

						var datasMean = {
							"name": null,
							"anger": 0,
							"contempt": 0,
							"disgust": 0,
							"fear": 0,
							"happiness": 0,
							"sadness": 0,
							"surprise": 0
						};

						var emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'sadness', 'surprise']
						var t = 0;

						for (var i in datas) { // average to avoid time
							t++;
							datasMean['name'] = datas[i]['name'];
							for (var el in emotions) {
								var emotion = emotions[el];
								datasMean[emotion] = (((datasMean[emotion] * (t - 1)) / t) + datas[i][emotion] / t);
							}
						}

						// Generate radar chart
						var chartGenerated = fillChart('radar', `canvas-${id}`, datasMean['name'], datasMean);

						var chartTimeGenerated = fillChartTime('line', `canvasline-${id}`, datas);

						fillChartsModal(keys);
					},
					error: function (error) { // error retrieve data of an image
						console.log(error);
					}
				});
				// });
			} else return

		};
	}

	// Function made just to realize data visualization for the final presentation. (Comment or decomment the function inside to use it!)
	function showResultPoster() {
		function showResultPerson(person) {
			$.ajax({
				url: '/final/person?p=' + person,
				type: 'GET',
				success: function (result) {

					document.body.innerHTML = "";
					var divMain = document.createElement("div");
					document.body.appendChild(divMain);

					for (var id in result['time']) {
						var paint = result['time'][id];
						for (var i = 1; i <= 4; i++) {

							if (paint[i] == {}) { //put average in case it is empty
								paint[i] = result['average'][id]
							}
						}
						var div = document.createElement("div");
						div.classList.add("col");
						var h5 = document.createElement("h5");

						h5.innerHTML = `${paint[1]['name']}`;
						var canvas = document.createElement("canvas");
						var idCanvas = `${id}-time`;
						canvas.setAttribute("id", idCanvas);
						div.appendChild(h5);
						div.appendChild(canvas);
						divMain.appendChild(div);

						fillChartTime('line', idCanvas, paint)
					}

				},
				error: function (error) { // error retrieve data of an image
					console.log(error);
				}
			});
		}

		// showResultPerson(92); //comment or decomment (52 is just an example)

		function showRadarChartAll() {
			$.ajax({
				url: '/experiment/table',
				type: 'GET',
				success: function (results) {
					document.body.innerHTML = "";
					var divMain = document.createElement("div");
					document.body.appendChild(divMain);


					for (var i in results) {
						paint = results[i];
						var div = document.createElement("div");
						div.classList.add("col");
						var h5 = document.createElement("h5");

						h5.innerHTML = `${paint['name']}`;
						var canvas = document.createElement("canvas");
						var idCanvas = `${i}-final`;
						canvas.setAttribute("id", idCanvas);
						div.appendChild(h5);
						div.appendChild(canvas);
						divMain.appendChild(div);

						fillChart('radar', idCanvas, `${paint['name']}`, paint, null, null)
					}


				},
				error: function (error) { //error for /experiment/table
					console.log(error);
				}
			});

		}
		// showRadarChartAll(); //comment or decomment
	}
	showResultPoster();
});