"use strict";


class PanelExpand extends Panel
{
	get elementClassSup() { return super.elementClass + '-panel-expand' }
	get zIndex()          { return parseInt( Panel.zIndex + 3 ); }



	constructor()
	{
		super();
	}


	addEvents()
	{
		var self  = this,
		    doc   = '.' + self.elementClassSup;


		// Clic close panel
		$j(doc).on('click', '.' + self.elementClass + '-head-close', function()
		{
			self.close();
			return false;
		});


		// Clic close overlay
		$j(doc).on('click', '.' + self.elementClass + '-overlay-close', function()
		{
			self.overlayClose( $j(this) );
			return false;
		});
	}


	close()
	{
		var self = this;
		
		$j('body').find( '> .' + self.elementClassSup + '.' + self.elementClass ).removeClass( self.elementClass + '-show' );

		setTimeout( function() {
			$j('body').find( '> .' + self.elementClass + '-panel-expand-light' ).remove();
		}, 500 );
	}


	overlayClose( btnClose )
	{
		var self = this;

		btnClose.parents('.' + self.elementClass + '-overlay').remove();
	}
}