var proj, map, markers, selectedFlights, useStops=true, codes = {};
var baby = 0, kid = 0, adult = 1;


function testPayment() {
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
    		'to_city': 'Palmas',
			'from_code': ['MAE', 'GRU', 'CGH'],
			'to_code': ['PMW'],
			'date': '03/01/2014'
    	}, 
    	2 : {
			'from_city': 'Palmas',
    		'to_city': 'Niterói',
			'from_code': ['PMW'],
			'to_code': ['SDU', 'GIG'],
			'date': '03/01/2014'
    	}

    };
    useStops = false;
    adult = 2;
    kid = 2;
    baby = 2;

	generateDateSearch()
	

    $('.masthead .nav-tabs a.date-tab').parent().removeClass('disable');
	$('.masthead .nav-tabs a.ticket-tab').parent().removeClass('disable');
	$('.masthead .nav-tabs a.payment-tab').parent().removeClass('disable');
	setPaymentTab();
	$('.show-flight:first').click();
}

function getPrice(price) {
	return ((by_age.baby * baby) + (by_age.kid * kid) + (by_age.adult * adult)) * price;
}

function setSearchTab() {
	if ($('.masthead .nav-tabs a.search-tab').parent().hasClass('disable')){
		return false;
	}
	setActive('search-tab', true);
}

function setDateTab() {
	if ($('.masthead .nav-tabs a.date-tab').parent().hasClass('disable')){
		return false;
	}
	setActive('date-tab', true);
}

function setTicketTab() {
	if ($('.masthead .nav-tabs a.ticket-tab').parent().hasClass('disable')){
		return false;
	}
	setActive('ticket-tab', true);
}

function setPaymentTab() {
	if ($('.masthead .nav-tabs a.payment-tab').parent().hasClass('disable')){
		return false;
	}
	generateReview();
	setActive('payment-tab', true);


}

function reloadSearchCodes() {
	codes = {};
	$('.fakeInput .code').each(function(k, element){
		var lis = $(element).text().split(', ');
		for (var code in lis) {
			codes[lis[code]] = null;
		}
	});
}

function reloadDateCodes() {
	codes = {};
	$('.sideinfo .code').each(function(k, element){
		var lis = $(element).text().split(', ');
		for (var code in lis) {
			codes[lis[code]] = null;
		}
	});
}

function reloadTicketCodes() {
	codes = {};
	$('.sideinfo .code').each(function(k, element){
		var lis = $(element).text().split(', ');
		for (var code in lis) {
			codes[lis[code]] = 'selected.png';
		}
	});
	show_current_flight();
}



function setActive(tab, def) {
	if (def == undefined) {
		def = false;
	}
	if (!def && $('.masthead .nav-tabs .active').find('a').hasClass('date-tab')) {
		generateDateSearch();
	}
	if (tab == 'search-tab') {
		reloadSearchCodes();
	} else if (tab == 'date-tab') {
		reloadDateCodes()
	} else if (tab == 'ticket-tab') {
		reloadTicketCodes();
	} else {
		codes = {};
		
	}
	reloadMarkers();
	$('.tab-page').hide();
	$('#'+tab).show();
	$('.masthead .nav-tabs .active').removeClass('active');
	$('.masthead .'+tab).parent().addClass('active');
	if (tab == 'payment-tab'){
		$('.show-flight').show();
		$('.show-flight:first').click();
	}
}

function show_current_flight(){
	var i = $('.tabs').tabs( "option", "active"); //get selected tab index
	var av_lat_from = 0.0;
	var av_long_from = 0.0;
	var count_from = 0;
	for (var code_num in selectedFlights[i]['from_code']) {
		var code = selectedFlights[i]['from_code'][code_num];
		av_lat_from += airports[code][3];
		av_long_from += airports[code][4];
		count_from += 1;
	}
	av_lat_from /= count_from;
	av_long_from /= count_from;
	var av_lat_to = 0.0;
	var av_long_to = 0.0;
	var count_to = 0;
	for (var code_num in selectedFlights[i]['to_code']) {
		var code = selectedFlights[i]['to_code'][code_num];
		av_lat_to += airports[code][3];
		av_long_to += airports[code][4];
		count_to += 1;
	}
	av_lat_to /= count_to;
	av_long_to /= count_to;
	codes['extra'] = [
		{
			'from': [av_lat_from, av_long_from, 'gold1.png'],
			'to': [av_lat_to, av_long_to, 'gold2.png'],
		}
	]
	reloadMarkers();
}

function new_marker(img, lonLat, icon, size, offset, especial) {

	if (img === null) {
    	return new OpenLayers.Marker(lonLat);
	} else if (img === undefined) {
		return new OpenLayers.Marker(lonLat, icon.clone());
	} 
	if (especial !== undefined) {
		var size = new OpenLayers.Size(21,25);
    	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    	
	}
	return new OpenLayers.Marker(lonLat, new OpenLayers.Icon(img, size, offset));
	
} 

function loadMarkers(map, proj, markers) {
	var size = new OpenLayers.Size(10,10);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('circle.png', size, offset);

    for (var code in airports) {

    	var airport = airports[code];
    	var lonLat = new OpenLayers.LonLat( airport[4], airport[3] )
          .transform(
            proj, map.getProjectionObject()
          );
        
        var marker = new_marker(codes[code], lonLat, icon, size, offset, codes['especial']);
       
        
        //marker.icon.size = size;
		//marker.icon.offset = offset;
        markers.addMarker(marker);
    }

    for (var marker in codes['extra']) {
    	var extra_size = new OpenLayers.Size(21,25);
    	var extra_offset = new OpenLayers.Pixel(-(extra_size.w/2), -extra_size.h);
    	var element = codes['extra'][marker];
    	var lonLat = new OpenLayers.LonLat(element['from'][1], element['from'][0])
    		.transform(
            	proj, map.getProjectionObject()
          	);
    	var marker = new_marker(element['from'][2], lonLat, icon, extra_size, extra_offset);
    	markers.addMarker(marker);

    	lonLat = new OpenLayers.LonLat(element['to'][1], element['to'][0])
    		.transform(
            	proj, map.getProjectionObject()
          	);

        marker = new_marker(element['to'][2], lonLat, icon, extra_size, extra_offset);
    	markers.addMarker(marker);

        
    }
}



function reloadMarkers(){
	markers.clearMarkers();

	
	loadMarkers(map, proj, markers);
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
					if (useStops || (!useStops && flight[2] == 0)){
						var adjustedPrice = getPrice(flight[1]);
						if (adjustedPrice < minimum) {
							minimum = adjustedPrice;
							selected = flight;
							from = from_code;
							to = to_code;
						}
						if (adjustedPrice < minimum_overall) {
							minimum_overall = adjustedPrice;
						}
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
	$('.tabscontainer .tabs ul').append(
		'<li>'+
		'	<a href="#tabs-'+current_number+'">'+
		'		<div class="from">' +
    	'			<span class="city">'+this_flight['from_city']+'</span>' +
    	'			<span class="code">'+this_flight['from_code'].join(', ')+'</span>' +
		'		</div>' +
		'		<div class="to">' +
    	'			<span class="city">'+this_flight['to_city']+'</span>' +
    	'			<span class="code">'+this_flight['to_code'].join(', ')+'</span>' +
		'		</div>' +
		'		<span class="date">'+this_flight['date']+'</span>' +
		'	</a>'+
		'</li>'
	);
	$('.tabscontainer .tabs').append(
		'<div id="tabs-'+current_number+'">'+
		'	<p><a class="btn btn-sm btn-default skip" href="#" role="button">Próximo</a></p>'+
       // '	<div class="clear"></div>'+
		'	<table cellpadding="0" cellspacing="0" border="0" class="display" id="table'+current_number+'"></table>'+
		'	<div class="clear"></div>'+
		'</div>'
	);

	var today_flights = [];
	current_date = new Date( this_flight['date'].replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") );

	for (var from_code_index in this_flight['from_code']) {
		var from_code = this_flight['from_code'][from_code_index];
		for (var to_code_index in this_flight['to_code']) {
			var to_code = this_flight['to_code'][to_code_index];
			var day_flights = dayFlights(current_date, airports[from_code], airports[to_code]);
			for (var flight_num in day_flights) {
				var flight = day_flights[flight_num];
				if (useStops || (!useStops && flight[2] == 0)) {
					var connections = [];
					for (var connection_num in flight[3]) {
						var connection = flight[3][connection_num];
						connections.push(
							'<span title="'+airports[connection][1]+', '+airports[connection][2]+'">'+
								connection +
							'</span>'
						);
					}
					today_flights.push([
						'<span class="price">'+priceToStr(getPrice(flight[1]))+'</span>',
						'<div class="time">' +
						'	<span class="departure">'+
								timeToStr(flight[0]) +
						'	</span>' +
						'	<span class="arrival">'+
								timeToStr(flight[6]) +
						'	</span>' +
						'</div>' +
						'<div class="airports">' +
						'	<span title="'+airports[from_code][1]+', '+airports[from_code][2]+'" class="departure_airport">'+
								from_code +
						'	</span>' +
						'	<span title="'+airports[to_code][1]+', '+airports[to_code][2]+'" class="arrival_airport">'+
								to_code +
						'	</span>' +
						'</div>',
						durationToStr(flight[4]),
						'<div class="stops">' +
						'	<span class="number">'+
								((flight[2] == 0)? "Sem escala" : ((flight[2] == 1)? "1 parada" : (flight[2] + " paradas")))+
						'	</span>' +
						'	<span class="stops">'+
								connections.join(', ')+
						'	</span>' +
						'</div>',
						'<img src="'+flight[5][1]+'" title="'+flight[5][0]+'" height="40" width="40">'
						

					]);
				}
			}
		}
	}
	var aSelected =[];
	var oTable = $('#table'+current_number).dataTable( {
		"aaData": today_flights,
		"aoColumns": [
			{ "sTitle": "Preço", "sClass": "center"  },
			{ "sTitle": "Horário", "sClass": "center"  },
			{ "sTitle": "Duração", "sClass": "center" },
			{ "sTitle": "Paradas", "sClass": "center"  },
			{ "sTitle": "Companhia", "sClass": "center" }
		],
		//"bScrollInfinite": true,
        //"bScrollCollapse": true,
        //"sScrollY": "400px",
        "sPaginationType": "full_numbers",
        "bFilter": false,
        "oLanguage": {
        	"oPaginate": {
        		"sFirst": "Primeira",
        		"sLast": "Última",
        		"sNext": "Próxima",
        		"sPrevious": "Anterior"
        	},

        	
            "sLengthMenu": "Mostrar _MENU_ voos por página",
            "sZeroRecords": "Nenhum voo encontrado :(",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ voos",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 voos",
            "sInfoFiltered": "(filtrando de um totatl de _MAX_ voos)"
        }
	} );
	$('#table'+current_number+" tbody tr:first-child").addClass('row_selected');
	$('#table'+current_number+" tbody").click(function(event) {
		$(oTable.fnSettings().aoData).each(function (){
			$(this.nTr).removeClass('row_selected');
		});
		$(event.target).parents('tr').addClass('row_selected');
		var flight_id = parseInt($(event.target).parents('.ui-tabs-panel').attr('id').split('tabs-')[1]);
		var price = $(event.target).parents('tr').find('.price').text();
		$('#infoforflight'+flight_id).find('.price').text(price);
		updateDatePrice();
		if (selectedFlights[flight_id+1] == undefined) {
			$('.masthead .nav-tabs a.payment-tab').parent().removeClass('disable');
			setPaymentTab();
		} else {
			var i = $('.tabs').tabs( "option", "active"); //get selected tab index
			$('.tabs').tabs( "option", "active", i+1 ); 
			reloadTicketCodes();
		}
	});
	this_flight['table'] = oTable;
}

function fnGetSelected( oTableLocal ) {
	var aReturn = new Array();
	var aTrs = oTableLocal.fnGetNodes();
	
	for ( var i=0 ; i<aTrs.length ; i++ ) {
		if ( $(aTrs[i]).hasClass('row_selected') ) {
			aReturn.push( aTrs[i] );
		}
	}
	return aReturn;
}

function updateDatePrice() {
	var total = 0.0;
	$(".pricedate").each(function(k, item){
		total += strToPrice($(item).find('.price').text());
	});
	$('.total-price').text(priceToStr(total));
}

function generateDateSearch() {
	codes = {};
	$('.selectdates').html('');
	$('.sideinfo ul').html('');
	$('.tabscontainer').html('');
	$('.tabscontainer').html('<div class="tabs"><ul></ul></div>');
	for (var num in selectedFlights) {
		for (var code in selectedFlights[num]['to_code']) {
			codes[selectedFlights[num]['to_code'][code]] = null;
		}
		for (var code in selectedFlights[num]['from_code']) {
			codes[selectedFlights[num]['from_code'][code]] = null;
		}
		fillDateSearch(num);
	}
	updateDatePrice();
	$('.sideinfo .side-travelers').text('');
	if (useStops) {
		$('.sideinfo .no-stop').text('');
	} else {
		$('.sideinfo .no-stop').text('Sem escala');
	}
	if (adult > 0) {
		$('.sideinfo .adult-travelers').text(adult + ' Adulto' + ((adult > 1)? 's' : ''));
	}
	if (kid > 0) {
		$('.sideinfo .kid-travelers').text(kid + ' Criança' + ((kid > 1)? 's' : ''));
	}
	if (baby > 0) {
		$('.sideinfo .baby-travelers').text(baby + ' Bebê' + ((baby > 1)? 's' : ''));
	}
	$('.sideinfo').show();
	$(".tabs").tabs();
	$("#ticket-tab .skip:last").html('');
	$("#ticket-tab .skip:last").removeClass('btn-default').addClass('btn-primary');	
	$("#ticket-tab .skip:last").append('Continuar');
	$("#ticket-tab .skip:last").append('<span class="glyphicon glyphicon-chevron-right"></span>');
	$("#ticket-tab .skip:last").css('color', 'white');
	$("#ticket-tab .skip:last").addClass('ticket-next');		
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

function loadMap() {
	proj = new OpenLayers.Projection("EPSG:4326");
	map = new OpenLayers.Map('map');

    map.addLayer(new OpenLayers.Layer.OSM());
    
    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    loadMarkers(map, proj, markers);
    

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
}

function generateReview() {
	$('.review-flights').html('');
	var total = 0;
	for (var i in selectedFlights) {
		var tr = $(fnGetSelected(selectedFlights[i].table));
		var price = strToPrice(tr.find('.price').text());
		total += price;
		var departure = tr.find('.departure').text();
		var arrival = tr.find('.arrival').text();
		var from_airport = tr.find('.departure_airport').text().trim();
		var to_airport = tr.find('.arrival_airport').text().trim();
		var stops_text = tr.find('.stops .number').text();
		var duration = tr.find('td:nth-of-type(3)').text();
		var stops = tr.find('.stops .stops span');
		var airline_name = tr.find('img').attr('title');
		var airline_img = tr.find('img').attr('src');
		var date = $('a[href="#tabs-'+i+'"] .date').text();
		var from_city = $('a[href="#tabs-'+i+'"] .from .city').text();
		var to_city = $('a[href="#tabs-'+i+'"] .to .city').text();
		var from_city_text = "";
		var to_city_text = "";
		if (from_city != airports[from_airport][2]) {
			from_city_text = '<span class="city">próximo a '+from_city+'</span>'; 
		}
		if (to_city != airports[to_airport][2]) {
			to_city_text = '<span class="city">próximo a '+to_city+'</span>'; 
		}

		var stop_text = "";
	//	console.log(stops[0].trim());
		if (stops.length > 0) {
			stop_text = 
				'<div class="stops">'+
				'	<span class="text">'+stops_text.trim()+'</span>';
			var stopi = 1;
			stops.each(function(k, item){
				var stop = $(item).text();
				
				stop_text += 
					'<div class="airport" title="'+airports[stop][2]+'">'+
					'	<img class="flight-img" src="blue'+(stopi++)+'.png">'+
					'	<span class="code">'+stop+'</span>' +
					'	<span class="name">'+airports[stop][1]+'</span>' +
					'</div>';
			});	
			stop_text += '</div>';
		}
		
		$('.review-flights').append(
			'<div class="flight">' +
			'	<div class="header">'+
			'		<div class="airline">'+
			'			<a href="'+airlines_website[airline_name]+'">'+
			'				<img title="'+airline_name+'" src="'+airline_img+'">'+
			'			</a>'+
			'		</div>'+
			'		<div class="date">'+dateToFullStr(strToDate(date))+'</div>'+
			'		<a href="#flight'+i+'" title="Editar este voo" class="edit-flight">'+
            '			<span class="glyphicon glyphicon-edit"></span>'+
            '		</a>'+
            '		<a href="#map" id="mapflight'+i+'" title="Mostrar no mapa" class="show-flight">'+
            '			<span class="glyphicon glyphicon-globe"></span>'+
            '		</a>'+
			'		<div class="clear"></div>'+
			'	</div>'+
			'	<div class="from">'+
			'		<div class="time">'+
			'			<span class="text">Saída:</span>'+
			'			<span class="hour">'+departure+'</span>'+
			'		</div>'+
			'		<div class="place">'+
			'			<span class="text">Origem:</span>'+
			'			<span class="airport_city">'+airports[from_airport][2]+' </span>'+
						from_city_text+
			'			<div class="airport">'+
			'				<img class="flight-img" src="gold1.png">'+
			'				<span class="code">'+from_airport+'</span>'+
			'				<span class="name">'+airports[from_airport][1]+'</span>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'	<div class="to">'+
			'		<div class="time">'+
			'			<span class="text">Chegada:</span>'+
			'			<span class="hour">'+arrival+'</span>'+
			'		</div>'+
			'		<div class="place">'+
			'			<span class="text">Destino:</span>'+
			'			<span class="airport_city">'+airports[to_airport][2]+' </span>'+
						to_city_text+
			'			<div class="airport">'+
			'				<img class="flight-img" src="gold2.png">'+
			'				<span class="code">'+to_airport+'</span>'+
			'				<span class="name">'+airports[to_airport][1]+'</span>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'	<div class="side">'+
			'		<div class="duration">'+
			'			<span class="text">Duração:</span>'+
			'			<span class="duration">'+duration+'</span>'+
			'		</div>'+
			'		<div class="price">'+
			'			<span class="price">'+priceToStr(price)+'</span>'+
			'		</div>'+
			'	</div>'+
			'	<div class="clear"></div>'+
				stop_text +
			'</div>'
		);


	}
	$('.review-flight-total span.price').text(priceToStr(total));

	$('.travelers').html('');

	for (var i = 0; i < adult; i++) {
		$('.travelers').append(
			'<div class="input-group input-group-lg">'+
			'	<span class="input-group-addon"> Adulto '+(i+1)+'</span>'+
			'	<input name="adult-'+(i+1)+'-name" title="Nome - Campo Obrigatório" type="text" class="half required form-control" placeholder="Nome *">'+
			'	<input name="adult-'+(i+1)+'-name" title="Identidade ou Passaporte - Campo Obrigatório" type="text" class="half required form-control" placeholder="Identidade ou Passaporte *">'+
			'</div>'
		);
	}

	for (var i = 0; i < kid; i++) {
		$('.travelers').append(
			'<div class="input-group input-group-lg">'+
			'	<span class="input-group-addon"> Criança '+(i+1)+'</span>'+
			'	<input name="kid-'+(i+1)+'-name" title="Nome - Campo Obrigatório" type="text" class="half required form-control" placeholder="Nome *">'+
			'	<input name="kid-'+(i+1)+'-name" title="Identidade ou Passaporte - Campo Obrigatório" type="text" class="half required form-control" placeholder="Identidade ou Passaporte *">'+
			'</div>'
		);
	}

	for (var i = 0; i < baby; i++) {
		$('.travelers').append(
			'<div class="input-group input-group-lg">'+
			'	<span class="input-group-addon"> Bebê '+(i+1)+'</span>'+
			'	<input name="baby-'+(i+1)+'-name" title="Nome - Campo Obrigatório" type="text" class="half required form-control" placeholder="Nome *">'+
			'	<input name="baby-'+(i+1)+'-name" title="Identidade ou Passaporte - Campo Obrigatório" type="text" class="half required form-control" placeholder="Identidade ou Passaporte *">'+
			'</div>'
		);
	}


}

function validatePayment() {
	var result = true;
	var field_error = false;
	$('.payment input.warning').removeClass('warning');
	var errors = [];
	$('.payment input.required').each(function(k, element){
		if (!$(element).val()) {
			result = false;
			field_error = true;
			$(element).addClass('warning');
		}
	});

	if (!$('#expireMM').val()){
		result = false;
		field_error = true;
		$('#expireMM').addClass('warning');
	}

	if (!$('#expireYY').val()){
		result = false;
		field_error = true;
		$('#expireYY').addClass('warning');
	}
	
	if (!result) {
		if (field_error) {
			errors.push("Todos os campos com * devem estar preenchidos.");	
		}
		$('.payment-alert').html(errors.join("<br>"));
		$('.payment-alert').show();
	} else {
		$('.payment-alert').hide();
	}
	return result;
}

$(document).ready(function(){
	
    loadMap();
    
    selectedFlights = {};
    useStops = true;
    adult = 1;

	setSearchTab();
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
		         	reloadSearchCodes();
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
				reloadSearchCodes();
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
                	    html.replace('Destino', 'Origem') +
                '    </div>'+
                '    <div class="searchAirport second">'+
                '    	<input type="text" class="searchInput input-medium"/>'+
                '      	<div tabindex="0" class="fakeInput input-medium">'+
                '        	<div class="city empty">Destino</div>'+
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

		$('.masthead .nav-tabs a').click(function(e){
			if ($(this).parent().hasClass('disable')){
				return false;
			}
			setActive(this.className);
		});	

		$('#search-next').click(function(){
			if (validateSearch()) {
				var number = 0;
				selectedFlights = {};
				codes = {};
				$('.fakeInput .code').each(function(k, element){
					var lis = $(element).text().split(', ');
					for (var code in lis) {
						codes[lis[code]] = null;
					}
				});
				$('.selectdates').html('');
				$('.sideinfo ul').html('');
				$('.tabscontainer').html('');
				$('.tabscontainer').html('<div class="tabs"><ul></ul></div>');
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
				$('.sideinfo .side-travelers').text('');
				if (useStops) {
					$('.sideinfo .no-stop').text('');
				} else {
					$('.sideinfo .no-stop').text('Sem escala');
				}
				if (adult > 0) {
					$('.sideinfo .adult-travelers').text(adult + ' Adulto' + ((adult > 1)? 's' : ''));
				}
				if (kid > 0) {
					$('.sideinfo .kid-travelers').text(kid + ' Criança' + ((kid > 1)? 's' : ''));
				}
				if (baby > 0) {
					$('.sideinfo .baby-travelers').text(baby + ' Bebê' + ((baby > 1)? 's' : ''));
				}
				$('.sideinfo').show();
				$(".tabs").tabs();
				$("#ticket-tab .skip:last").html('');
				$("#ticket-tab .skip:last").removeClass('btn-default').addClass('btn-primary');	
				$("#ticket-tab .skip:last").append('Continuar');
				$("#ticket-tab .skip:last").append('<span class="glyphicon glyphicon-chevron-right"></span>');
				$("#ticket-tab .skip:last").css('color', 'white');
				$("#ticket-tab .skip:last").addClass('ticket-next');	

				$('.masthead .nav-tabs a.date-tab').parent().removeClass('disable');
				$('.masthead .nav-tabs a.ticket-tab').parent().removeClass('disable');
				setActive('date-tab')
			}
		});

		$('#date-tab .skip').click(function(){
			
			generateDateSearch();
			setActive('ticket-tab', true);
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

		$("#ticket-tab .skip").livequery(function(){
			$(this).click(function(){
				if ($(this).hasClass('ticket-next')) {
					$('.masthead .nav-tabs a.payment-tab').parent().removeClass('disable');
					setPaymentTab();
				} else {
					var i = $('.tabs').tabs( "option", "active"); //get selected tab index
					$('.tabs').tabs( "option", "active", i+1 ); 
					reloadTicketCodes();
				}
			});
		});

		$(".ui-tabs-anchor").livequery(function(){
			$(this).click(function(){
				reloadTicketCodes();
			});
		});

		$('#pay-next').click(function(){
			if (validatePayment()) {
				$('.payment').hide();
				$('.success-payment').show();
			}
			
		});

		$(".edit-flight").livequery(function(){
			$(this).click(function(){
				setTicketTab();
				$('.tabs').tabs( "option", "active", parseInt($(this).attr('href').split('#flight')[1]) ); 
			})
		});
		$(".show-flight").livequery(function(){
			$(this).click(function(){
				$('.show-flight').show();
				$('.flight-img').hide();
				$(this).hide();
				$(this).parents('.flight').find('.flight-img').show();
				codes = {};
				codes['especial'] = true;
				codes[$(this).parents('.flight').find('.from .code').text().trim()] = 'gold1.png';
				codes[$(this).parents('.flight').find('.to .code').text().trim()] = 'gold2.png';
				
				var current = 1;
				$(this).parents('.flight').find('.stops .code').each(function(k, item){
					codes[$(item).text().trim()] = 'blue'+(current++)+'.png';
					
				});
				reloadMarkers();
				//$('.tabs').tabs( "option", "active", parseInt($(this).attr('href').split('#flight')[1]) ); 
			})
		});
		
		$('.erase-search').click(function(){
			$('input[type="text"]').val('');
			$('select').val('');
			$('.payment').show();
			$('.success-payment').hide();
			$('.sideinfo').hide();
			$('.masthead .nav-tabs a.date-tab').parent().addClass('disable');
			$('.masthead .nav-tabs a.ticket-tab').parent().addClass('disable');
			$('.masthead .nav-tabs a.payment-tab').parent().addClass('disable');
			$('.first .fakeInput .city').html('Origem');
			$('.second .fakeInput .city').html('Destino');
			$('.first .fakeInput .city').addClass('empty');
			$('.second .fakeInput .city').addClass('empty');
			$('#add-roundtrip').css('visibility', 'hidden');
			$('.searchFlight:not(:first)').remove();
			$('.searchFlight .removeflight').css('visibility', 'hidden');
			$('.fakeInput .code').html('&nbsp;');
			codes = {};
			selectedFlights = {};
			setSearchTab();
   
		});

	});
});