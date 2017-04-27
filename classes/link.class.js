"use strict";


const MAX_RATE  = 5;



class Link
{
	get host()       { return this.url.split('/')[2]; }
	get desc()       { return ( this.description.length > 162 ) ? this.description.substr(0, 160) + '...' : this.description; }
	get long_desc()  { return ( this.description.length > 250 ) ? this.description.substr(0, 248) + '...' : this.description; }


	get image()      { return ( this._image === '' ) ? WattodooAdapter.getURL( 'img/no-image.png' ) : this._image; }
	set image(value) { return this._image = value; }

	get title()      { return ( this._title === '' ) ? '-' : this._title; }
	set title(value) { return this._title = value; }

	get rate()       {
		if ( typeof( this.rates ) === 'undefined' || this.rates.length == 0 ) {
			return 0;
		}
		
		var sum = 0;

		for ( var k in this.rates )
		{
			if ( this.rates.hasOwnProperty(k) ) {
				sum += parseInt( this.rates[k], 10 );
			}
		}

		return +( sum / Object.keys(this.rates).length ).toFixed(2);
	}

	get nbrate()     {
		if ( this.rates.length == 0 ) {
			return 0;
		}

		return Object.keys(this.rates).length;
	}

	get myrate()     {
		if ( isset( this.rates[Wattodoo.USER.id] ) ) {
			return this.rates[Wattodoo.USER.id];
		}

		return 0;
	}



	constructor( oInfos )
	{
		if ( isset( oInfos ) ) {
			for ( var carac in oInfos ) {
				if ( oInfos.hasOwnProperty(carac) ) {
					this[carac] = oInfos[carac];
				}
			}
		}
		else {
			this.retreiveURL();
			this.retreiveTitle();
			this.retreiveDescription();
			this.retreiveImage();
		}
	}



	retreiveURL()
	{
		if ( $j('meta[property="og:url"]').length > 0 && $j.trim( $j('meta[property="og:url"]').attr('content') ) !== '' )
		{
			this.url = $j.trim( $j('meta[property="og:url"]').attr('content') );
		}
		else if ( $j('link[rel="canonical"]').length > 0 && $j.trim( $j('link[rel="canonical"]').attr('href') ) !== '' )
		{
			this.url = $j.trim( $j('link[rel="canonical"]').attr('href') );

			if ( this.url.match( /^http/ ) === null ) {
				this.url = window.location.protocol + '//' + window.location.host + this.url;
			}
		}
		else {
			this.url = window.location.href;
		}
	}

	retreiveTitle()
	{
		if ( $j('meta[property="og:title"]').length > 0 && $j.trim( $j('meta[property="og:title"]').attr('content') ) !== '')
		{
			this.title = $j.trim( $j('meta[property="og:title"]').attr('content') );
		}
		else if ( $j('h1').length > 0 && $j.trim( $j('h1').first().text() ) !== '')
		{
			this.title = $j.trim( $j('h1').first().text() );
		}
		else {
			this.title = $j.trim( $j('title').text() );
		}
	}

	retreiveDescription()
	{
		if ( $j('meta[property="og:description"]').length > 0 && $j.trim( $j('meta[property="og:description"]').attr('content') ) !== '' )
		{
			this.description = $j.trim( $j('meta[property="og:description"]').attr('content') );
		}
		else if ( $j('meta[name="description"]').length > 0 && $j.trim( $j('meta[name="description"]').attr('content') ) !== '' )
		{
			this.description = $j.trim( $j('meta[name="description"]').attr('content') );
		}
		else if ( $j('meta[name="Description"]').length > 0 && $j.trim( $j('meta[name="Description"]').attr('content') ) !== '' )
		{
			this.description = $j.trim( $j('meta[name="Description"]').attr('content') );
		}
		else {
			this.description = '';
		}
	}

	retreiveImage()
	{
		if ( $j('meta[property="og:image"]').length > 0 && $j.trim( $j('meta[property="og:image"]').attr('content') ) !== '' )
		{
			this.image = $j.trim( $j('meta[property="og:image"]').attr('content') );
		}
		else {
			this.image   = '';
			this.aImages = [];

			var that = this;

			$j('body img:visible').each(function ( k, elem )
			{
				var oImg = $j( elem ),
				    src  = oImg.attr('src');

				if ( !isset( src ) || src === '' ) {
					return;
				}

				if ( oImg.offset().top > 600) {
					return;
				}

				if ( oImg.width() < 100 && oImg.height() < 100 ) {
					return;
				}

				if ( oImg.height() < oImg.width() / 4 ) {
					return;
				}

				that.aImages.push( src );
			});

			if ( this.aImages.length === 1 )
			{
				this.image   = this.aImages[0];
				this.aImages = [];
			}
			else if ( this.aImages.length > 1 )
			{
				this.image   = this.aImages[0];
			}
		}
	}



	relationConstruct( name, page, oParams )
	{
		return LinkRelationships[name].constructHTML( this, name, page, oParams );
	}



	static constructHTML( oCaller, relation, page, oParams )
	{
		var extID = WattodooAdapter.getLocale( '@@extension_id' );

		if ( isset(oCaller[relation]) )
		{
			switch ( page )
			{
				case 'project' :
				case 'project-partial' :
					var oLink;

					$j.get( WattodooAdapter.getURL( 'views/partials/project-link.html' ), function(data )
					{
						var newData;

						for ( var k in oCaller.links )
						{
							if ( oCaller.links.hasOwnProperty(k) ) {
								oLink = new Link(oCaller.links[k]);

								newData = Content.replaceLink  (data, page, oParams, oLink);
								newData = Content.replaceGlobal(newData, page);

								$j('.' + extID + '-ext-partial-' + page + '-links[data-idproject="' + oCaller.id + '"] ul').append(newData);
							}
						}
					});

					return '';
				break;
			}
		}
		else {
			setTimeout(function() {
				$j('.' + extID + '-ext-partial-' + page + '-links[data-idproject="' + oCaller.id + '"]').append('<p>Aucun lien à afficher</p>');
			}, 50);

			return '';
		}
	}
}