function isset( name ) {
	return typeof( name ) !== 'undefined';
}

function ucfirst( string ) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function in_array( value, array ) {
	return array.indexOf( value ) !== -1;
}

function escapeHTML( unsafe, aKeepTag ) {
	if ( !isset( unsafe ) || !isNaN( unsafe ) ) {
		return unsafe;
	}

	unsafe = unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");

	if ( isset( aKeepTag ) )
	{
		var reg1,
				reg2,
				reg3;

		if ( typeof( aKeepTag ) === 'string' )
		{
			reg1 = new RegExp('&lt;'  + aKeepTag + '&gt;',  'g');
			reg2 = new RegExp('&lt;/' + aKeepTag + '&gt;',  'g');
			reg3 = new RegExp('&lt;'  + aKeepTag + '/&gt;', 'g');
			
			unsafe = unsafe
				.replace(reg1, '<'  + aKeepTag + '>')
				.replace(reg2, '</' + aKeepTag + '>')
				.replace(reg3, '<'  + aKeepTag + '/>');
		}
		else {
			for ( var k in aKeepTag )
			{
				if ( aKeepTag.hasOwnProperty(k) )
				{
					reg1 = new RegExp('&lt;'  + aKeepTag[k] + '&gt;',  'g');
					reg2 = new RegExp('&lt;/' + aKeepTag[k] + '&gt;',  'g');
					reg3 = new RegExp('&lt;'  + aKeepTag[k] + '/&gt;', 'g');

					unsafe = unsafe
						.replace(reg1, '<'  + aKeepTag[k] + '>')
						.replace(reg2, '</' + aKeepTag[k] + '>')
						.replace(reg3, '<'  + aKeepTag[k] + '/>');
				}
			}
		}
	}

	return unsafe;
}



Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
