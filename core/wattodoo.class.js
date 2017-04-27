"use strict";


const URL_SITE_PROD = 'http://www.wattodoo.com';
const URL_SITE_DEV  = 'http://dev.wattodoo.com';


class Wattodoo
{
	static get domain_url()      { return Wattodoo._domain_url || URL_SITE_PROD; }
	static set domain_url(value) { Wattodoo._domain_url = value; }

	static get ID() { return WattodooAdapter.getLocale( '@@extension_id' ); }



	static showPanel()
	{
		if ( Auth.isLogged === true ) {
			WattodooAdapter.$emitback('loadpanel', 'panel-home');
		}
		else {
			WattodooAdapter.$emitback('loadpanel', 'panel-register');
		}
	}


	static setEnvironment()
	{
		var manifest = WattodooAdapter.getManifest();

		if ( !isset( manifest.key ) ) {
			Wattodoo.setDev();
		}
	}

	static setDev()
	{
		//Wattodoo.domain_url = URL_SITE_DEV;
		Facebook.APP_ID     = FB_APP_ID_DEV;
	}
}