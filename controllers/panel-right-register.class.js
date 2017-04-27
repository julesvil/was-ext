"use strict";


class PanelRightRegister extends PanelRight
{
	get view()          { return 'views/form-register.html'; }
	get prefix_locale() { return 'form_register'; }



	constructor()
	{
		super();
	}


	addEvents()
	{
		super.addEvents();


		var self  = this,
		    doc   = '.' + self.elementClassSup;


		// Soumission formulaire inscription
		$j(doc).on('submit', '.' + self.elementClass + '-form-register', function()
		{
			var email      = $j(this).find('input[name="email"]').val(),
					firstname  = $j(this).find('input[name="firstname"]').val(),
					lastname   = $j(this).find('input[name="lastname"]').val(),
			    password   = $j(this).find('input[name="password"]').val(),
			    repassword = $j(this).find('input[name="repassword"]').val();

			WattodooAdapter.$emit('create_user', {email: email, firstname: firstname, lastname: lastname, password: password, repassword: repassword} );
			return false;
		});


		// Clic lien vers panel connexion
		$j(doc).on('click', '.' + self.elementClass + '-btn-login', function()
		{
			PanelFactory.load('panel-login');
			return false;
		});


		// Clic connexion/inscription Facebook
		$j(doc).on('click', '.' + self.elementClass + '-btn-fb', function()
		{
			Facebook.open();

			WattodooAdapter.$emit('login_fb_wait');

			return false;
		});


		// Clic lien vers aucune inscription
		$j(doc).on('click', '.' + self.elementClass + '-btn-no-register', function()
		{
			PanelFactory.load('panel-caution-no-register');
			return false;
		});
	}
}