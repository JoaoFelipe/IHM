/*
 * jQuery UI Autocomplete HTML Extension
 *
 * Copyright 2010, Scott González (http://scottgonzalez.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * http://github.com/scottgonzalez/jquery-ui-extensions
 */
(function( $ ) {

var proto = $.ui.autocomplete.prototype,
	initSource = proto._initSource;

function filter( array, term ) {
	var matcher = new RegExp( '(^|)('+$.ui.autocomplete.escapeRegex(term)+')(|$)', "ig" );
	return $.grep( array, function(value) {
		if (matcher.test( $( "<div>" ).html( value.search || value.label || value.value || value ).text() )) {
			value.show = value.label_template;
			for (var i = 0; i < value.label_value.length; i++) {
				v = (value.label_value[i]+"").replace(matcher, "$1<b>$2</b>$3");
				value.show = value.show.replace(new RegExp('\\['+i+'\\]', "ig"), v);
			}
			return true;
		}
		return false;
	});
}

$.extend( proto, {
	_initSource: function() {
		if ( this.options.html && $.isArray(this.options.source) ) {
			this.source = function( request, response ) {
				response( filter( this.options.source, request.term ) );
			};
		} else {
			initSource.call( this );
		}
	},

	_renderItem: function( ul, item) {
		return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.show ) )
			.appendTo( ul );
	}
});

})( jQuery );