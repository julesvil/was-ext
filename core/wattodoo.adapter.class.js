"use strict";


class WattodooAdapter
{
	static setEnvironment()
	{
		if ( isset( chrome ) )
		{
			WattodooAdapter.ENV = WattodooAdapterChrome;
		}
	}


	static getURL( url )
	{
		return WattodooAdapter.ENV.getURL( url );
	}


	static getLocale( key )
	{
		return WattodooAdapter.ENV.getLocale( key );
	}


	static getManifest()
	{
		return WattodooAdapter.ENV.getManifest();
	}


	/**
	 * Cookies
	 */

	static getCookies( oParams, callback )
	{
		WattodooAdapter.ENV.getCookies( oParams, callback );
	}

	static setCookies( oParams, callback )
	{
		WattodooAdapter.ENV.setCookies( oParams, callback );
	}

	static delCookies( oParams, callback )
	{
		WattodooAdapter.ENV.delCookies( oParams, callback );
	}


	/**
	 * Storage
	 */

	static getStorage( mixedName, callback )
	{
		WattodooAdapter.ENV.getStorage( mixedName, callback );
	}

	static setStorage( oParams, callback )
	{
		WattodooAdapter.ENV.setStorage( oParams, callback );
	}

	static clearStorage( callback )
	{
		WattodooAdapter.ENV.clearStorage( callback );
	}


	/**
	 * Transport
	 */

	static $on( action, callback )
	{
		WattodooAdapter.ENV.$on( action, callback );
	}


	static $emit( action, oParams, callback )
	{
		WattodooAdapter.ENV.$emit( action, oParams, callback );
	}


	static $emitback( action, oParams, callback )
	{
		WattodooAdapter.ENV.$emitback( action, oParams, callback );
	}


	/**
	 * Extension
	 */

	static onExtInstalled( callback )
	{
		WattodooAdapter.ENV.onExtInstalled( callback );
	}

	static onExtStart( callback )
	{
		WattodooAdapter.ENV.onExtStart( callback );
	}

	static onExtClick( callback )
	{
		WattodooAdapter.ENV.onExtClick( callback );
	}

	static setExtIcon( oParams )
	{
		WattodooAdapter.ENV.setExtIcon( oParams );
	}


	/**
	 * Browser
	 */

	static tabCreate( oParams )
	{
		WattodooAdapter.ENV.tabCreate( oParams );
	}

	static onTabUpdate( callback )
	{
		WattodooAdapter.ENV.onTabUpdate( callback );
	}
}