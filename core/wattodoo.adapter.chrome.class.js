"use strict";


class WattodooAdapterChrome
{
	static getURL( url )
	{
		return chrome.extension.getURL( url );
	}


	static getLocale( key )
	{
		return chrome.i18n.getMessage( key );
	}


	static getManifest()
	{
		return chrome.runtime.getManifest();
	}



	/**
	 * Cookies
	 */

	static getCookies( oParams, callback )
	{
		chrome.cookies.get( oParams, callback );
	}

	static setCookies( oParams, callback )
	{
		chrome.cookies.set( oParams, callback );
	}

	static delCookies( oParams, callback )
	{
		chrome.cookies.remove( oParams, callback );
	}


	/**
	 * Storage
	 */

	static getStorage( mixedName, callback )
	{
		if ( isset( callback ) )
		{
			chrome.storage.local.get( mixedName, callback );
		}
		else {
			chrome.storage.local.get( mixedName );
		}
	}

	static setStorage( oParams, callback )
	{
		if ( isset( callback ) )
		{
			chrome.storage.local.set( oParams, callback );
		}
		else {
			chrome.storage.local.set( oParams );
		}
	}

	static clearStorage( callback )
	{
		if ( isset( callback ) )
		{
			chrome.storage.local.clear( callback );
		}
		else {
			chrome.storage.local.clear( oParams );
		}
	}



	static $on( action, callback )
	{
		chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
		{
			if ( typeof(action) === 'string' && request.action === action || typeof(action) === 'object' && in_array( request.action, action ) )
			{
				console.log("in on ok => callback");
				callback( request.action, request.params, sendResponse );
			}

			return true;
		});
	}


	static $emit( action, oParams, callback )
	{
		chrome.runtime.sendMessage( {action: action, params: oParams}, callback );
	}


	static $emitback( action, oParams, callback )
	{
		chrome.tabs.sendMessage( Tab.id, {action: action, params: oParams}, callback );
	}


	/**
	 * Extension
	 */

	static onExtInstalled( callback )
	{
		chrome.runtime.onInstalled.addListener( callback );
	}

	static onExtStart( callback )
	{
		chrome.runtime.onStartup.addListener( callback );
	}

	static onExtClick( callback )
	{
		chrome.browserAction.onClicked.addListener( callback );
	}

	static setExtIcon( oParams )
	{
		chrome.browserAction.setIcon( oParams );
	}


	/**
	 * Browser
	 */

	static tabCreate( oParams )
	{
		chrome.tabs.create( oParams );
	}

	static onTabUpdate( callback )
	{
		chrome.tabs.onUpdated.addListener( callback );
	}
}