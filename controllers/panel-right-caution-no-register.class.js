"use strict";


class PanelRightCautionNoRegister extends PanelRight
{
	get view()          { return 'views/caution-no-register.html'; }
	get prefix_locale() { return 'caution_no_register'; }


	constructor()
	{
		super();
	}


	addEvents()
	{
		super.addEvents();


		var self  = this,
		    doc   = '.' + self.elementClassSup;


		// Clic lien vers panel inscription
		$j(doc).on('click', '.' + self.elementClass + '-btn-register', function()
		{
			PanelFactory.load('panel-register');
			return false;
		});


		// Clic lien poursuivre vers aucune inscription
		$j(doc).on('click', '.' + self.elementClass + '-btn-continue', function()
		{
			WattodooAdapter.$emit('auth_no_account');
			return false;
		});
	}
}