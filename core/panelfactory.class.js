"use strict";


class PanelFactory
{
	static load( panelName, oParams )
	{
		var callback = undefined,
				oPanel;

		switch ( panelName )
		{
			case 'panel-todo' :
				oPanel = new PanelRightTodo();
			break;

			case 'panel-home' :
				oPanel = new PanelRightHome();

				oPanel.oPartials = {
					'home-profile-register' : ( Wattodoo.USER._type_in_app === 'auth' ) ? 'home-profile-register-true' : 'home-profile-register-false'
				};
			break;

			case 'panel-login' :
				oPanel = new PanelRightLogin();
			break;

			case 'panel-register' :
				oPanel = new PanelRightRegister();
			break;

			case 'panel-caution-no-register' :
				oPanel = new PanelRightCautionNoRegister();
			break;

			case 'panel-project' :
				oPanel = new PanelExpandProject( oParams );
				/** @TODO : mettre links en partial **/
				oPanel.oPartials = {
					'project-participants'       : 'project-participants',
					'project-btn-add-subproject' : ( Wattodoo.PROJECT.name !== '___project_default___' ) ? 'project-btn-add-subproject' : '',
					'project-subprojects'        : ( Wattodoo.PROJECT.name !== '___project_default___' ) ? 'project-subprojects'        : ''
				};

				callback = function()
				{
					WattodooAdapter.getStorage('display_links', function(result) {
						if ( isset( result.display_links ) )
						{
							oPanel.setDisplayLink( result.display_links );
						}
						else {
							oPanel.setDisplayLink( 'gal' );
						}
					});
				};
			break;

			case 'panel-me' :
				oPanel = new PanelMajorMe();
			break;

			case 'panel-link' :
				oPanel = new PanelMajorLink( oParams.oLink );

				oPanel.oPartials = {
					'link-comments' : 'link-comments'
				};
			break;

			case 'panel-project-conf' :
				oPanel = new PanelMajorProjectConf();

				oPanel.oPartials = {
					'project-subprojects' : 'project-conf-subprojects',
					'project-participants': 'project-conf-participants'
				};
			break;
		}

		oPanel.append( callback );
	}
}