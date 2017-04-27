"use strict";


class PanelMajorLink extends PanelMajor
{
	get view()          { return 'views/link.html'; }
	get prefix_locale() { return 'link'; }



	constructor( params )
	{
		super();

		Wattodoo.LINK = new Link( params );
	}

	addEvents()
	{
		var self  = this,
		    doc   = '.' + self.elementClassSup;


		super.addEvents();


		// Hover sur les étoiles pour noter
		$j(doc).on('mouseenter', '.' + self.elementClass + '-my-rate .' + self.elementClass + '-links-rate-under span', function()
		{
			$j(this).parents('.' + self.elementClass + '-links-rating').children('.' + self.elementClass + '-links-rate-over').css('width',  parseInt( $j(this).data('value') / MAX_RATE * 100 ) + '%' );
		});


		// Quitte hover sur les étoiles pour noter
		$j(doc).on('mouseleave', '.' + self.elementClass + '-my-rate .' + self.elementClass + '-links-rate-under span', function()
		{
			$j(this).parents('.' + self.elementClass + '-links-rating').children('.' + self.elementClass + '-links-rate-over').css('width', parseInt( $j(this).parents('.' + self.elementClass + '-links-rating').data('default') / MAX_RATE * 100 ) + '%' );
		});


		// Clic sur les étoiles pour noter
		$j(doc).on('click', '.' + self.elementClass + '-my-rate .' + self.elementClass + '-links-rate-under span', function()
		{
			var linkRate    = $j(doc).find('.' + self.elementClass + '-link-rate'),
			    commentRate = $j(doc).find('.' + self.elementClass + '-comment-rate[data-iduser="' + Wattodoo.USER.id + '"]'),
			    oldValue    = Wattodoo.LINK.myrate,
			    newValue    = $j(this).data('value'),
			    moreRate    = ( Wattodoo.LINK.myrate == 0 ) ? 1 : 0,
			    newNbRate   = ( parseInt(Wattodoo.LINK.nbrate) + parseInt(moreRate) ),
			    newRate     = ( ( Wattodoo.LINK.rate * Wattodoo.LINK.nbrate - oldValue ) + newValue ) / newNbRate;

			$j(this).parents('.' + self.elementClass + '-links-rating').children('.' + self.elementClass + '-links-rate-over').css('width', parseInt( newValue / MAX_RATE * 100 ) + '%' );
			$j(this).parents('.' + self.elementClass + '-links-rating').data('default', newValue);

			commentRate.children('.' + self.elementClass + '-links-rating').attr('title', (+newValue.toFixed(2)) + ' / ' + MAX_RATE);
			commentRate.find('.' + self.elementClass + '-links-rate-over').css('width', parseInt( newValue / MAX_RATE * 100 ) + '%');

			linkRate.children('.' + self.elementClass + '-links-rating').attr('title', (+newRate.toFixed(2)) + ' / ' + MAX_RATE + ' sur ' + newNbRate + ' votes');
			linkRate.find('.' + self.elementClass + '-links-rate-over').css('width', parseInt( newRate / MAX_RATE * 100 ) + '%');

			WattodooAdapter.$emit('set_rate_link', {rate: newValue, id_link: Wattodoo.LINK.id} );

			return false;
		});


		// Soumission form message
		$j(doc).on('submit', '.' + self.elementClass + '-form-comment', function()
		{
			var textarea = $j(this).find('textarea[name="comment"]');


			$j.get( WattodooAdapter.getURL( 'views/partials/link-comment.html' ), function(data )
			{
				function pad(s) { return (s < 10) ? '0' + s : s; }
				
				var newData,
				    d        = new Date(),
				    oComment = new Comment({
							comment     : textarea.val(),
							date_comment: d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + d.toLocaleTimeString(),
							id_user     : Wattodoo.USER.id,
							id_link     : Wattodoo.LINK.id,
							id_project  : Wattodoo.PROJECT.id
						}),
				    oUser    = Wattodoo.USER;

				newData = Content.replaceComment( data,    'link', {}, oComment );
				newData = Content.replaceUser   ( newData, 'link', {}, oUser );
				newData = Content.replaceGlobal ( newData, 'link' );

				$j('.' + self.elementClass + '-partial-link-comments ul').prepend( newData );
				$j('.' + self.elementClass + '-partial-link-comments ul li').first().hide().slideDown();


				Wattodoo.LINK.comments.unshift(oComment);


				WattodooAdapter.$emit('add_comment_link', {comment: textarea.val(), id_link: Wattodoo.LINK.id} );

				textarea.val('');
			});

			return false;
		});
	}
}