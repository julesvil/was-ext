"use strict";

var Tab = {
	id: null
};


WattodooAdapter.setEnvironment();
Wattodoo.setEnvironment();


WattodooAdapter.onExtInstalled( function(details ) {
	console.log('install !!!');
	console.log(details);

	if ( details.reason === 'install' )
	{
		WattodooAdapter.tabCreate( {url: Wattodoo.domain_url + '/plug-install.php' } );
	}
	else if ( details.reason === 'update' )
	{

	}
});

WattodooAdapter.onExtStart( function() {
	console.log('start !!!');
});

WattodooAdapter.onExtClick( function (tab) {
	console.log('click !!!');
	console.log(tab);

	Tab.id = tab.id;

	WattodooAdapter.$emitback('isExtDisplayed', {}, function( response ) {
		if ( response === true ) {
			WattodooAdapter.$emitback('closePanel');
		}
		else {
			Auth.test();
		}
	});
});


//Listen for any changes to the URL of any tab.
WattodooAdapter.onTabUpdate( function(tabId, changeInfo, tab) {
	console.log('change !!!');
	console.log(changeInfo);
	console.log(tab);
});



WattodooAdapter.$on( ['create_user', 'auth'], function(action, oParams ) {
	var oAjax      = new Ajax( action, oParams );
	oAjax.method   = 'post';
	oAjax.callback = function() {
		Auth.test();
	};
	oAjax.send();
});

WattodooAdapter.$on( 'auth_no_account', function() {
	WattodooAdapter.setCookies( { url: Wattodoo.domain_url, name: 'user_type', value: 'no_auth' }, function()
	{
		Auth.test();
	});
});

WattodooAdapter.$on( 'create_project', function( action, oParams ) {
	var oAjax      = new Ajax( action, {name: oParams.name} );
	oAjax.method   = 'post';
	oAjax.callback = function( oDataReturned ) {
		var id_project;

		if ( isset( Auth.token ) ) {
			id_project = oDataReturned.id_project;
		}
		else {
			id_project = oParams.id_temp;
		}

		WattodooAdapter.$emitback('callbackCreateProject', {id_project: id_project, name: oParams.name, typeproject: oParams.typeproject, classname: oParams.classname}, function() {});
	};
	oAjax.send();
});

WattodooAdapter.$on([
		'update_project',
		'archive_project',
		'delete_user',
		'set_default_project',
		'set_parent_link',
		'set_rate_link',
		'add_comment_link',
		'add_link'
	],
	function( action, oParams ) {
		var oAjax      = new Ajax( action, oParams );
		oAjax.method   = 'post';
		oAjax.send();
	}
);

WattodooAdapter.$on( 'logout', function() {
	WattodooAdapter.delCookies( { url: Wattodoo.domain_url, name: 'user_type' }, function()
	{
		WattodooAdapter.delCookies( { url: Wattodoo.domain_url, name: 'auth' }, function()
		{
			Auth.test();
		});
	});
});

WattodooAdapter.$on( 'login_fb_wait', function() {
	Auth.si = setInterval( function()
	{
		Auth.test();
	}, 100);
});