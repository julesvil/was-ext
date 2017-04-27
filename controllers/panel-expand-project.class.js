"use strict";


class PanelExpandProject extends PanelExpand
{
	get view()          { return 'views/project.html'; }
	get prefix_locale() { return 'project'; }



	constructor( params )
	{
		super();

		Wattodoo.PROJECT = new Project( params );
	}


	addEvents( namePartial )
	{
		var self  = this,
		    doc   = '.' + self.elementClassSup;


		super.addEvents();


		// Clic bouton de configuration du projet
		/*$j(doc).on('click', '.' + self.elementClass + '-btn-project-conf', function()
		{
			PanelFactory.load('panel-project-conf');

			return false;
		});*/


		// Clic bouton ajout participant
		$j(doc).on('click', '.' + self.elementClass + '-btn-add-participants', function()
		{
			$j.get( WattodooAdapter.getURL( 'views/partials/overlay-add-participants.html' ), function(data )
			{
				data = Content.replace( data, 'project_overlay' );
				data = Content.replaceProject( data, 'project_overlay' );

				$j('.' + self.elementClassSup + ' > .' + self.elementClass + '-wrap-content').append( data );
				$j('.' + self.elementClass + '-overlay').css('bottom', 'auto');
			});

			return false;
		});


		// Modification vue liens en galerie
		$j(doc).on('click', '.' + self.elementClass + '-links-btn-views .' + self.elementClass + '-links-btn-gal', function()
		{
			self.setDisplayLink('gal');
			return false;
		});


		// Modification vue liens en lignes
		$j(doc).on('click', '.' + self.elementClass + '-links-btn-views .' + self.elementClass + '-links-btn-row', function()
		{
			self.setDisplayLink('row');
			return false;
		});


		// Affiche les sous-projets
		$j(doc).on('click', '.' + self.elementClass + '-project-list-subprojects a', function()
		{
			$j(this).siblings('div').toggle();
			$j(this).children('.fa').toggleClass('rotate');

			return false;
		});


		// Clic bouton affiche formulaire ajout sous-projet
		$j(doc).on('click',  '.' + self.elementClass + '-wrap-btn-add-subproject .' + self.elementClass + '-btn-add-subproject', function()
		{
			$j(this).siblings('form').toggle();
			$j(this).toggle();
			$j(this).siblings('form').find( '.' + self.elementClass + '-field-add-project').focus();

			return false;
		});


		// Clic bouton cancel ajout sous-projet
		$j(doc).on('click',  '.' + self.elementClass + '-wrap-btn-add-subproject .' + self.elementClass + '-btn-danger', function()
		{
			$j(this).parents('form').siblings('button').toggle();
			$j(this).parents('form').toggle();

			return false;
		});


		// Soumission formulaire ajout sous-projet
		$j(doc).on('submit',  '.' + self.elementClass + '-wrap-btn-add-subproject .' + self.elementClass + '-form-add-subproject', function()
		{
			var newprojectname = $j(this).find('input[name="project"]').val(),
			    idparent       = $j(this).find('input[name="id_parent"]').val(),
			    nameparent     = $j(this).find('input[name="name_parent"]').val(),
			    level          = $j(this).find('input[name="level"]').val(),
			    newidproject   = 'new' + parseInt( Object.keys(Wattodoo.USER[Wattodoo.PROJECT.__type] ).length );

			Wattodoo.USER[Wattodoo.PROJECT.__type][newidproject]    = $j.extend({}, newProject(), {id: newidproject, name: newprojectname, id_parent: idparent});
			Wattodoo.USER[Wattodoo.PROJECT.__type][idparent].childs = Wattodoo.USER[Wattodoo.PROJECT.__type][idparent].childs || [];
			Wattodoo.USER[Wattodoo.PROJECT.__type][idparent].childs.push(newidproject);

			WattodooAdapter.setStorage( {'User': Wattodoo.USER} );

			$j(this).siblings('button').toggle();
			$j(this).toggle();

			var ul, wrapSubprojects,
			    oProject        = new Project( $j.extend( {}, {type: Wattodoo.PROJECT.__type}, Wattodoo.USER[Wattodoo.PROJECT.__type][newidproject] ) ),
			    li              = constructLiSubproject( oProject, level );

			if ( level == '1' ) {
				wrapSubprojects = $j(this).parents('.' + self.elementClass + '-partial-project-btn-add-subproject').siblings('.' + self.elementClass + '-partial-project-subprojects');
			}
			else {
				wrapSubprojects = $j(this).parents('.' + self.elementClass + '-wrap-btn-add-subproject').parent();
			}

			ul = wrapSubprojects.children('ul.' + self.elementClass + '-project-list-subprojects');

			if ( ul.length === 0 )
			{
				ul = $j('<ul/>').addClass(self.elementClass + '-project-list-subprojects ' + self.elementClass + '-project-list-subprojects' + level);
				ul.append(li);
				wrapSubprojects.append(ul);
			}
			else {
				ul.append(li);
			}

			WattodooAdapter.$emit('create_project', {name: newprojectname, id_parent: idparent, name_parent: nameparent} );

			return false;
		});


		// Clic sur un lien
		$j(doc).on('click', '.' + self.elementClass + '-links a', function()
		{
			var idproject = $j(this).parents('.' + self.elementClass + '-project-links').data('idproject');
			
			PanelFactory.load('panel-link', { oLink: Wattodoo.USER[Wattodoo.PROJECT.__type][idproject].links[$j(this).data('id')] });

			return false;
		});
	}


	setDisplayLink( display )
	{
		var self  = this;

		display = display || 'gal';

		if ( display === 'gal' )
		{
			$j('.' + self.elementClass + ' .' + self.elementClass + '-links').removeClass(self.elementClass + '-layout-column').addClass(self.elementClass + '-layout-row');
			$j('.' + self.elementClass + ' .' + self.elementClass + '-links a header').removeClass(self.elementClass + '-layout-row').addClass(self.elementClass + '-layout-column');
		}
		else {
			$j('.' + self.elementClass + ' .' + self.elementClass + '-links').removeClass(self.elementClass + '-layout-row').addClass(self.elementClass + '-layout-column');
			$j('.' + self.elementClass + ' .' + self.elementClass + '-links a header').removeClass(self.elementClass + '-layout-column').addClass(self.elementClass + '-layout-row');
		}

		WattodooAdapter.setStorage( {'display_links': display} );
	}
}