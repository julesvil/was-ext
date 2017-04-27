"use strict";


class PanelRightLogin extends PanelRight
{
	get view()          { return 'views/form-login.html'; }
	get prefix_locale() { return 'form_login'; }



	constructor()
	{
		super();
	}


	addEvents()
	{
		super.addEvents();


		var self  = this,
		    doc   = '.' + self.elementClassSup;


		// Soumission formulaire de connexion
		$j(doc).on('submit', '.' + self.elementClass + '-form-login', function()
		{
			var email    = $j(this).find('input[name="email"]').val(),
			    password = $j(this).find('input[name="password"]').val();

			WattodooAdapter.$emit('auth', {email: email, password: password} );
			return false;
		});


		// Clic lien vers panel inscription
		$j(doc).on('click', '.' + self.elementClass + '-btn-register', function()
		{
			PanelFactory.load('panel-register');
			return false;
		});


		// Clic connexion/inscription Facebook
		$j(doc).on('click', '.' + self.elementClass + '-btn-fb', function()
		{
			Facebook.open();

			WattodooAdapter.$emit('login_fb_wait');

			return false;
		});
	}
}