"use strict";


class Auth
{
	static get isLogged()      { return Auth._isLogged || false; }
	static set isLogged(value) { Auth._isLogged = value; }



	static test()
	{
		WattodooAdapter.getCookies( {url: Wattodoo.domain_url, name:'user_type'}, function(cookie)
		{
			if ( cookie !== null ) {
				if ( isset( Auth.si ) ) {
					clearInterval( Auth.si );
					Auth.si = undefined;
				}

				switch ( cookie.value )
				{
					case 'auth' :
						WattodooAdapter.getCookies( {url: Wattodoo.domain_url, name:'auth'}, function(cookie)
						{
							if ( cookie === null ) {
								Auth.isLogged = false;
								Wattodoo.showPanel();
							}
							else {
								Auth.token     = cookie.value;

								var oAjax      = new Ajax( 'get_user', {} );
								oAjax.method   = 'post';
								oAjax.callback = function( datas ) {
									WattodooAdapter.setStorage({'User': datas.user, 'Users': datas.users_datas}, function() {
										WattodooAdapter.$emitback('loaduser', {type: 'auth'}, function(response ) {
											Auth.isLogged = true;
											Wattodoo.showPanel();
										});
									});
								};
								oAjax.send();
							}
						});
					break;

					case 'no_auth' :
						WattodooAdapter.$emitback('loaduser', {type: 'no_auth'}, function(response ) {
							Auth.isLogged = true;
							Auth.token    = undefined;
							Wattodoo.showPanel();
						});
					break;
				}
			}
			else {
				if ( !isset( Auth.si ) ) {
					Auth.isLogged = false;
					Wattodoo.showPanel();
				}
			}
		});
	}
}