"use strict";


class PanelMajor extends Panel
{
	get elementClassSup() { return super.elementClass + '-panel-major' }
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
	}


	close()
	{
		var self = this;
		
		$j('body').find( '> .' + self.elementClassSup + '.' + self.elementClass ).removeClass( self.elementClass + '-show' );

		setTimeout( function() {
			$j('body').find( '> .' + self.elementClassSup ).remove();
		}, 500 );
	}
}