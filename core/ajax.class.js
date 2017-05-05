"use strict";


class Ajax
{
	get method()        { return this._method || 'get'; }
	set method(value)   { this._method = value; }

	get url()           { return this._url; }
	set url(value)      { this._url = Wattodoo.domain_url + '/ws/' + value + '.php'; this._rawURL = value; }

	get datas()         { return this._datas || {}; }
	set datas(value)    { this._datas = value; }

	get callback()      { return this._callback || undefined; }
	set callback(value) { this._callback = value; }



	constructor( url, datas, retry )
	{
		this.retry = ( isset(retry) ) ? retry : 2;
		
		this.url   = url;
		this.datas = datas;

		if ( !isset( retry ) ) {
			this.datas = $j.extend( {}, this.datas, {auth: Auth.token});
		}
	}


	send()
	{
		if ( this.callback === undefined && Auth.token === undefined ) {
			return;
		}

		var self = this;

		console.log('ajax in send : ' + self.url);

		$j.ajax({
			type      : self.method,
			url       : self.url,
			data      : self.datas,
			dataType  : 'json',

			beforeSend: function() {
				if ( isset( self.callback ) )
				{
					self.loading();
				}
			},
			error: function ( jqXHR ) {
				if ( isset( self.callback ) )
				{
					self.endLoading();
				}

				console.log('-------- ERROR --------');
				console.log(jqXHR);
				console.log(self.toString());

				if ( self.retry !== 0 )
				{
					self.retry--;

					var oAjax      = new Ajax( self._rawURL, self.datas, self.retry );
					oAjax.method   = self.method;
					oAjax.callback = self.callback;
					oAjax.send();
				}
				else {
					alert('error ajax! see logs');
				}
			},
			success: function( data )
			{
				if ( isset( self.callback ) )
				{
					if ( data.response === 'ok' ) {
						self.callback( data );
					}
					else {
						//alert( data.error );
						self.displayMessage( data.error );
					}

					self.endLoading();
				}
				else if ( isset( data.error ) ) {
					alert( data.error );
				}
			}
		});
	}


	loading()
	{
		var i = 1;

		this.SI = setInterval(function()
		{
			if ( i === 9 ) {
				i = 1;
			}
			
			WattodooAdapter.setExtIcon({
				path: 'img/' + i + '.png',
				tabId: Tab.id
			});

			i++;
		}, 100);
	}


	endLoading()
	{
		WattodooAdapter.setExtIcon({
			path: "img/logo.png",
			tabId: Tab.id
		});

		clearInterval(this.SI);
	}


	displayMessage( message, type )
	{
		type = type || 'error';

		WattodooAdapter.$emitback('displayMessage', {type: type, message: message}, function() {});
	}



	toString()
	{
		return [this.url, this.method, this.datas].join(' ; ');
	}
}