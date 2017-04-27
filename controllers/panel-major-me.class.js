"use strict";


class PanelMajorMe extends PanelMajor
{
	get view()          { return 'views/me.html'; }
	get prefix_locale() { return 'me'; }



	constructor()
	{
		super();
	}

	addEvents()
	{
		super.addEvents();
	}
}