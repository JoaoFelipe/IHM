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

$(document).ready(function(){
	$('.masthead .nav-tabs a').click(function(){
		if ($(this).parent().hasClass('disable')){
			return false;
		}
		setActive(this.className);
		
	})	

	$('#search-next').click(function(){
		$('.masthead .nav-tabs a.date-tab').parent().removeClass('disable');
		$('.masthead .nav-tabs a.ticket-tab').parent().removeClass('disable');
		setActive('date-tab')
	})


    var proj = new OpenLayers.Projection("EPSG:4326");
	var map = new OpenLayers.Map('map');

    map.addLayer(new OpenLayers.Layer.OSM());
    
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    var size = new OpenLayers.Size(10,10);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('circle.png', size, offset);
    
    for (var i = 0; i < airports.length; i++) {
    	var lonLat = new OpenLayers.LonLat( airports[i][4], airports[i][3] )
          .transform(
            proj, map.getProjectionObject()
          );
        marker = new OpenLayers.Marker(lonLat, icon.clone());
        marker.icon.size = size;
		marker.icon.offset = offset;
        markers.addMarker(marker);
    }

 	var position = new OpenLayers.LonLat(-53.1, -15.2).transform(proj, map.getProjectionObject());
 	//var extent = new OpenLayers.Bounds(-74.4, 4.7, -30.8, -32.8);A
	//extent.transform(proj, map.getProjectionObject());
    map.setCenter(position, 4);

    map.events.register('zoomend', this, function (event) {
        var x = map.getZoom();
        
        if( x < 4)
        {
            map.zoomTo(15);
        }
    });
    //map.setOptions({restrictedExtent: extent});

    $(function() {
    	
    	var source = [];
    	for (var i = 0; i < airports.length; i++) {
    		var airport = airports[i];
    		source.push({
    			value: airport[2],
    			label_template: '<div class="airport_item">' +
               	  '  <div class="airport">' +
                  '    <div class="code">[0]</div>' +
                  '    <div class="name">[1]</div>' +
                  '  </div>' +
                  '  <div class="city">[2]</div>' +
                  '  <div class="clear"></div>' +
                  '</div>',
                label_value: airport,
                search: airport[0] + ' ' + airport[1] + ' ' + airport[2]
    		});
    	}
    	console.log(source);
    	

	    $("#my_ac").autocomplete({
	    	html: true,
	    	autoFocus: true,
	        source: source,
	        minLength: 1
	    }).data( "autocomplete" );
	});
});