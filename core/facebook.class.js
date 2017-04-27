"use strict";


const FB_APP_ID_PROD = '297717787239117';
const FB_APP_ID_DEV  = '324267314584164';


class Facebook
{
	static get APP_ID()      { return Facebook._APP_ID || FB_APP_ID_PROD; }
	static set APP_ID(value) { Facebook._APP_ID = value; }


	static authURL()
	{
		var url =
			'https://www.facebook.com/dialog/oauth'
				+ '?client_id='    + Facebook.APP_ID
				+ '&redirect_uri=' + escape( Wattodoo.domain_url + '/fbconnect.php?ref=chromeext' )
				+ '&scope=email'
				+ '&response=token'
				+ '&display=popup';

		return url;
	}


	static open()
	{
		var w = 660,
		    h = 400,
		    x = ( $j(window).width()  - w) / 2,
		    y = ( $j(window).height() - h) / 2;

		window.open( Facebook.authURL(), 'logFB', 'location=1,scrollbars=1,width=' + w + ',height=' + h + ',left=' + x + ',top='+ y );
	}
}