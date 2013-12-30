function setSearchTab() {
	$('.masthead .nav-tabs a.search-tab').click();
}

function setDateTab() {
	$('.masthead .nav-tabs a.date-tab').click();
}

function setTicketTab() {
	$('.masthead .nav-tabs a.ticket-tab').click();
}

function setPaymentTab() {
	$('.masthead .nav-tabs a.payment-tab').click();
}

function setActive(tab) {
	$('.tab-page').hide();
	$('#'+tab).show();
	$('.masthead .nav-tabs .active').removeClass('active');
	$('.masthead .'+tab).parent().addClass('active');
}

function loadMarkers(map, proj, markers, codes) {
	var size = new OpenLayers.Size(10,10);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('circle.png', size, offset);
    var selected = new OpenLayers.Icon('selected.png', size, offset);

    for (var code in airports) {

    	var airport = airports[code];
    	var lonLat = new OpenLayers.LonLat( airport[4], airport[3] )
          .transform(
            proj, map.getProjectionObject()
          );
        if ($.inArray(code, codes) > -1) {
        	marker = new OpenLayers.Marker(lonLat);
		} else {
			marker = new OpenLayers.Marker(lonLat, icon.clone());
		}
        
        //marker.icon.size = size;
		//marker.icon.offset = offset;
        markers.addMarker(marker);
    }
}

var proj, map, markers, selectedFlights;

function reloadMarkers(){
	markers.clearMarkers();
	var codes = [];
	$('.fakeInput .code').each(function(k, element){
		codes = codes.concat($(element).text().split(', '));
	});
	loadMarkers(map, proj, markers, codes);
}

function showRemoveFlight() {
	if ($('.searchFlights .searchFlight').length > 1) {
		$('.removeflight').css('visibility', 'visible');
	} else {
		$('.removeflight').css('visibility', 'hidden');
	}
}

function showAddRoundTrip() {
	var first = $('.searchFlights .searchFlight:first-child .first .fakeInput .code');
	var last = $('.searchFlights .searchFlight:last-child .second .fakeInput .code');
	var first_codes = $(first).text().split(', ');
	var last_codes = $(last).text().split(', ');
	var found = false;
	for (var code_index in first_codes) {
		var code = first_codes[code_index];
		if ($.inArray(code, last_codes) > -1) {
			found = true;
			break;
		}
	}
	if (found) {
		$("#add-roundtrip").css('visibility', 'hidden');
	} else {
		$("#add-roundtrip").css('visibility', 'visible');
	}
}

function validateSearch() {
	var result = true;
	var field_error = false;
	var date_error = false;
	var last_date = null;
	$('.searchFlights input.datepicker').each(function(k, element){
		if (!$(element).val()) {
			result = false;
			field_error = true;
			$(element).addClass('warning');
		}
		if (last_date == null) {
			last_date = new Date( $(element).val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") );
		} else {
			new_date = new Date( $(element).val().replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") );
			if (new_date < last_date) {
				$(element).addClass('warning');
				date_error = true;
				result = false;
			}
			last_date = new_date;
		}
	});
	$('.searchFlights .fakeInput .code').each(function(k, element){
		if (!$(element).text().replace(/^\s+|\s+$/g, '')) {
			result = false;
			field_error = true;
			$(element).parent().addClass('warning');
		}
	});
	if (!result) {
		var errors = [];
		if (field_error) {
			errors.push("Todos os campos devem estar preenchidos.");	
		}
		if (date_error) {
			errors.push("Os voos devem estar ordenados por data.");
		}
		$('.search-alert').html(errors.join("<br>"));
		$('.search-alert').show();
	} else {
		$('.search-alert').hide();
	}
	return result;
	//
}


function fillDateSearch(current_number) {
	var this_flight = selectedFlights[current_number];
	var each_day = [];
	var date = this_flight['date'];
	var current_date = new Date( date.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") );


	var today = new Date();
	today.setHours(0,0,0,0);

	var minimum_day = -Math.min(days_between(today, current_date), 3);

	var minimum_overall = 100000000;
	for (var i = minimum_day; i < minimum_day + 7; i++) {
		var minimum = 100000000;
		var selected = [];
		var to = '';
		var from = '';
		var current_date = new Date( date.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") );
		current_date.setDate(current_date.getDate() + i);
		for (var from_code_index in this_flight['from_code']) {
			var from_code = this_flight['from_code'][from_code_index];
			for (var to_code_index in this_flight['to_code']) {
				var to_code = this_flight['to_code'][to_code_index];
				var day_flights = dayFlights(current_date, airports[from_code], airports[to_code]);
				for (var flight_index in day_flights) {
					var flight = day_flights[flight_index];
					if (flight[1] < minimum) {
						minimum = flight[1];
						selected = flight;
						from = from_code;
						to = to_code;
					}
					if (flight[1] < minimum_overall) {
						minimum_overall = flight[1];
					}
				}
			}
		}
		each_day.push([current_date, from, to, minimum, selected]);
	}
	var result_html = 
			'<div class="bestdateselect" id="dateforflight'+ current_number +'">' +
			'	<div class="title">' +
			'		<div class="from">' +
        	'			<span class="city">'+this_flight['from_city']+'</span>' +
        	'			<span class="code">'+this_flight['from_code'].join(', ')+'</span>' +
			'		</div>' +
			'		<div class="to">' +
        	'			<span class="city">'+this_flight['to_city']+'</span>' +
        	'			<span class="code">'+this_flight['to_code'].join(', ')+'</span>' +
			'		</div>' +
			'		<span class="date">'+this_flight['date']+'</span>' +
			'	</div>' +
			'   <div class="options">';

	var current_price = 0;
	for (var i = 0; i < each_day.length; i++) {
		if ((dateToStr(each_day[i][0])==this_flight['date'])) {
			current_price = each_day[i][3];
		}
		result_html +=
			'<div class="option">' +
			'	<input class="datelabel" type="radio" '+((dateToStr(each_day[i][0])==this_flight['date'])? ' checked="checked" ' : '')+' id="radioforflight'+current_number+'_'+i+'" name="radioforflight'+current_number+'" />' +
			'	<label for="radioforflight'+current_number+'_'+i+'">' +
			'		<span class="weekday">'+weekday(each_day[i][0])+'</span>' +
			'		<span class="date">'+dateToStr(each_day[i][0])+'</span>' +
			'		<span class="price '+ ((each_day[i][3] <= minimum_overall)? 'min' : '') + '">'+priceToStr(each_day[i][3])+'</span>' +
			'	</label>' +
			'</div>';
	}
	result_html += '</div></div>'
	$('.selectdates').append(result_html);

	var side_html = 
			'<li id="infoforflight'+ current_number +'">' +
			'	<div class="from">' +
        	'		<span class="city">'+this_flight['from_city']+'</span>' +
        	'		<span class="code">'+this_flight['from_code'].join(', ')+'</span>' +
			'	</div>' +
			'	<div class="to">' +
        	'		<span class="city">'+this_flight['to_city']+'</span>' +
        	'		<span class="code">'+this_flight['to_code'].join(', ')+'</span>' +
			'	</div>' +
			'	<div class="pricedate">' +
			'		<span class="price">'+priceToStr(current_price)+'</span>' +
			'		<span class="date">'+this_flight['date']+'</span>' +
			'	</div>' +
			'</li>';
	$('.sideinfo ul').append(side_html);
}

function updateDatePrice() {
	var total = 0.0;
	$(".bestdateselect input[type='radio']:checked").each(function(k, item){
		total += strToPrice($(item).siblings('label').find('.price').text());
	});
	$('.total-price').text(priceToStr(total));
}

function generateDateSearch() {
	$('.selectdates').html('');
	$('.sideinfo ul').html('');
	for (var num in selectedFlights) {
		fillDateSearch(num);
	}
	updateDatePrice();
	$('.sideinfo').show();
}

function validateDate() {
	var result = true;
	var field_error = false;
	var date_error = false;
	var last_date = null;
	$(".bestdateselect input[type='radio']:checked").each(function(k, item){
		var date = strToDate($(item).siblings('label').find('.date').text());
		if (last_date == null) {
			last_date = date;
		} else {
			new_date = date;
			if (new_date < last_date) {
				$(item).parents('.bestdateselect').addClass('warning');
				date_error = true;
				result = false;
			}
			last_date = new_date;
		}
	});

	if (!result) {
		var errors = [];
		if (date_error) {
			errors.push("Os voos devem estar ordenados por data.");
		}
		$('.date-alert').html(errors.join("<br>"));
		$('.date-alert').show();
	} else {
		$('.date-alert').hide();
	}
	return result;
}

$(document).ready(function(){
	


    proj = new OpenLayers.Projection("EPSG:4326");
	map = new OpenLayers.Map('map');

    map.addLayer(new OpenLayers.Layer.OSM());
    
    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    loadMarkers(map, proj, markers, []);
    

 	var position = new OpenLayers.LonLat(-53.1, -15.2).transform(proj, map.getProjectionObject());
 	//var extent = new OpenLayers.Bounds(-74.4, 4.7, -30.8, -32.8);A
	//extent.transform(proj, map.getProjectionObject());
    map.setCenter(position, 3);

    map.events.register('zoomend', this, function (event) {
        var x = map.getZoom();
        
        if( x < 3)
        {
            map.zoomTo(15);
        }
    });
    //map.setOptions({restrictedExtent: extent});
    /*
    selectedFlights = {
    	0 : {
    		'from_city': 'Niterói',
			'to_city': 'São Paulo',
			'from_code': ['SDU', 'GIG'],
			'to_code': ['MAE', 'GRU', 'CGH'],
			'date': '31/12/2013'
    	}, 
    	1 : {
			'from_city': 'São Paulo',
    		'to_city': 'Niterói',
			'from_code': ['MAE', 'GRU', 'CGH'],
			'to_code': ['SDU', 'GIG'],
			'date': '03/01/2014'
    	}

    };
	generateDateSearch()
	

    $('.masthead .nav-tabs a.date-tab').parent().removeClass('disable');
	$('.masthead .nav-tabs a.ticket-tab').parent().removeClass('disable');
	
	setActive('date-tab');
	*/
    $(function() {
    	
	    $(".searchInput").livequery(function(){
	    	$(this).autocomplete({
		    	html: true,
		    	autoFocus: true,
		        source: autoCompleteList(),
		        minLength: 0,
		        select: function (event, item) {

			        $(this).hide();
		         	var fakeInput = $(this).parent().children(".fakeInput");
		         	var city = item.item.city;
		         	if (city.length > 18) {
		         		city = city.substring(0, 15) + '...';
		         	}
		         	fakeInput.html(
		         		'<div class="city">'+city+'</div>' +
	                    '<div class="code">'+((item.item.codes.length > 0) ? item.item.codes.join(', ') : "Nenhum aeroporto selecionado")+'</div>'
	                );
	                $(this).removeClass('warning');
	                fakeInput.removeClass('warning');
		         	fakeInput.show();
		         	fakeInput.focus();
		         	reloadMarkers();
		         	showAddRoundTrip();

			    },
			    close: function (a, b) {
			        $(this).hide();
		         	$(this).parent().children(".fakeInput").show();
			    }
		    }).focus(function(){            
	            $(this).autocomplete("search");
	        }).data( "autocomplete" );
	    });

		$(".fakeInput").livequery(function(){
			var autocompl = function(){
				var searchInput = $(this).parent().children(".searchInput");
				
				searchInput.show();
				$(this).hide();
				searchInput.focus();
				searchInput.autocomplete("search");
			};

			$(this).click(autocompl);
			$(this).bind('keypress', function(e) {
			    var searchInput = $(this).parent().children(".searchInput");
			
				searchInput.show();
				$(this).hide();
				searchInput.focus();
				searchInput.autocomplete("search");
			});
			
		});
			
		$(".datepicker").livequery(function(){
			$(this).datepicker({ 
				minDate: 0,
				dateFormat: "dd/mm/yy",
				onClose: function(date){
					if (date) {
						$(this).removeClass('warning');
					}
				}
			});
		});

		$(".removeflight").livequery(function(){
			$(this).click(function(){
				$(this).parent().remove();
				showRemoveFlight();
				reloadMarkers();
				showAddRoundTrip();
			});
		});

		$(".datelabel").livequery(function(){
			$(this).change(function(){
				var price = $(this).siblings('label').children('.price').text();
				var date = $(this).siblings('label').children('.date').text();
				var id = $(this).parents('.bestdateselect').attr('id').split('dateforflight')[1];
				$('#infoforflight'+id).find('.price').text(price);
				$('#infoforflight'+id).find('.date').text(date);
				updateDatePrice();
			});
		})

		$("#add-flight").click(function(){
			var html = $('.searchFlights .searchFlight:last-child .second').html();
			$('.searchFlights').append(
				'<div class="searchFlight">'+
                '    <div class="searchAirport first">'+
                	    html +
                '    </div>'+
                '    <div class="searchAirport second">'+
                '    	<input type="text" class="searchInput input-medium"/>'+
                '      	<div tabindex="0" class="fakeInput input-medium">'+
                '        	<div class="city">&nbsp;</div>'+
                '        	<div class="code">&nbsp;</div>'+
                '      	</div>'+
                '    </div>'+
                '    <div class="selectdate">'+
                '      	<input type="text" class="datepicker" placeholder="Data">'+
                '      	<span class="glyphicon glyphicon-calendar"></span>'+
                '    </div>'+
                '    <a class="btn btn-sm btn-danger sidebutton removeflight" href="#" role="button">'+
                '         <span class="glyphicon glyphicon-minus"></span>'+
                '    </a>'+
                '</div>'
            );
			showRemoveFlight();
            $('.searchFlights .searchFlight:last-child .fakeInput')[0].focus();
		});
		$("#add-roundtrip").click(function(){
			var first = $('.searchFlights .searchFlight:last-child .second').html();
			var second = $('.searchFlights .searchFlight:first-child .first').html();
			$('.searchFlights').append(
				'<div class="searchFlight">'+
                '    <div class="searchAirport first">'+
                	    first +
                '    </div>'+
                '    <div class="searchAirport second">'+
                    	second +
                '    </div>'+
                '    <div class="selectdate">'+
                '      	<input type="text" class="datepicker" placeholder="Data">'+
                '      	<span class="glyphicon glyphicon-calendar"></span>'+
                '    </div>'+
                '    <a class="btn btn-sm btn-danger sidebutton removeflight" href="#" role="button">'+
                '         <span class="glyphicon glyphicon-minus"></span>'+
                '    </a>'+
                '</div>'
            );
			showRemoveFlight();
			showAddRoundTrip();
            $('.searchFlights .searchFlight:last-child .fakeInput')[0].focus();
		});


		$('.masthead .nav-tabs a').click(function(){
			if ($(this).parent().hasClass('disable')){
				return false;
			}
			setActive(this.className);
			
		});	

		$('#search-next').click(function(){
			if (validateSearch()) {
				var number = 0;
				selectedFlights = {};
				$('.selectdates').html('');
				$('.sideinfo ul').html('');
				$('.searchFlights .searchFlight').each(function(k, item){
					var current_number = number++;

					var first_city = $(item).find('.first .city').text();
					var first_code = $(item).find('.first .code').text();
					var second_city = $(item).find('.second .city').text();
					var second_code = $(item).find('.second .code').text();
					var date = $(item).find('.datepicker').val();
					
					var this_flight = {
						'from_city': first_city,
						'to_city': second_city,
						'from_code': first_code.split(', '),
						'to_code': second_code.split(', '),
						'date': date		
					};

					selectedFlights[current_number] = this_flight;
					fillDateSearch(current_number);
				});
				updateDatePrice();
				$('.sideinfo').show();
				$('.masthead .nav-tabs a.date-tab').parent().removeClass('disable');
				$('.masthead .nav-tabs a.ticket-tab').parent().removeClass('disable');
				setActive('date-tab')
			}
		});

		$('#date-tab .skip').click(function(){
			setActive('ticket-tab');
			generateDateSearch();
		});

		$('#date-next').click(function(){
			if (validateDate()) {
				$(".bestdateselect input[type='radio']:checked").each(function(k, item){
					var id = $(this).parents('.bestdateselect').attr('id').split('dateforflight')[1];
					selectedFlights[id]['date'] = $(item).siblings('label').find('.date').text();
				});
				generateDateSearch();
				setActive('ticket-tab');
			}
			
		});

	});
});