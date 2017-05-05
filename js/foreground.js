"use strict";


WattodooAdapter.setEnvironment();
Wattodoo.setEnvironment();


WattodooAdapter.$on('loaduser', function(action, oParams, sendResponse ) {
	User.load( oParams.type, sendResponse );
});

WattodooAdapter.$on('loadpanel', function(action, panelName ) {
	PanelFactory.load( panelName );
});

WattodooAdapter.$on('isExtDisplayed', function( action, oParams, sendResponse ) {
	sendResponse( Panel.isDisplayed() );
});

WattodooAdapter.$on('closePanel', function() {
	var p = new PanelRight();
	p.close();
});

WattodooAdapter.$on('displayMessage', function( action, oParams ) {
	Panel.displayMessage( oParams );
});