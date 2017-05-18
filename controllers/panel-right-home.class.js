"use strict";


class PanelRightHome extends PanelRight
{
	get view()          { return 'views/home.html'; }
	get prefix_locale() { return 'home'; }



	constructor()
	{
		super();

		Wattodoo.LINK = new Link();
	}


	addEvents()
	{
		super.addEvents();
		

		var self  = this,
		    doc   = '.' + self.elementClassSup;


		$j(document).ready(function()
		{
			if ( !isset( Wattodoo.LINK.aImages ) || Wattodoo.LINK.aImages.length === 0 )
			{
				$j('.' + self.elementClass + '-content-home .' + self.elementClass + '-preview-link-wrap-img .' + self.elementClass + '-link-img-nav').hide();
			}

			var myprojects = Wattodoo.USER._myprojects,
					hasLink    = false,
					mylinks, k1, k2;

			loopmaster:
			for ( k1 in myprojects )
			{
				if ( myprojects.hasOwnProperty(k1) )
				{
					mylinks = myprojects[k1].links;

					for ( k2 in mylinks )
					{
						if ( mylinks.hasOwnProperty(k2) )
						{
							if ( Wattodoo.LINK.url == mylinks[k2].url ) {
								hasLink = true;
								break loopmaster;
							}
						}
					}
				}
			}

			if ( hasLink === true )
			{
				var regLocale = new RegExp( '___' + self.prefix_locale + '_([0-9a-z_]+)___', 'g' );
				var html      = '<i class="fa fa-check"></i><span>___home_link_added___</span>';

				$j('.' + self.elementClass + '-content-home .' + self.elementClass + '-wrap-btn-add-link')
					.addClass(self.elementClass + '-link-added ' + self.elementClass + '-layout-row ' + self.elementClass + '-hcenter ' + self.elementClass + '-vcenter')
					.html(
						html.replace( regLocale, function( match, p1 ) { return WattodooAdapter.getLocale( '___' + self.prefix_locale + '_' + p1 + '___' ); })
					);
			}
		});

		var navImage = 0;
		$j(doc).on('click', '.' + self.elementClass + '-preview-link-wrap-img .' + self.elementClass + '-link-img-nav a.' + self.elementClass + '-link-img-nav-left', function()
		{
			navImage--;

			if ( navImage === -1 ) {
				navImage = Wattodoo.LINK.aImages.length - 1;
			}

			Wattodoo.LINK.image = Wattodoo.LINK.aImages[navImage];
			$j('.' + self.elementClass + '-content-home .' + self.elementClass + '-preview-link-wrap-img img').attr('src', Wattodoo.LINK.aImages[navImage]);

			return false;
		});

		$j(doc).on('click', '.' + self.elementClass + '-preview-link-wrap-img .' + self.elementClass + '-link-img-nav a.' + self.elementClass + '-link-img-nav-right', function()
		{
			navImage++;

			if ( navImage === Wattodoo.LINK.aImages.length ) {
				navImage = 0;
			}

			Wattodoo.LINK.image = Wattodoo.LINK.aImages[navImage];
			$j('.' + self.elementClass + '-content-home .' + self.elementClass + '-preview-link-wrap-img img').attr('src', Wattodoo.LINK.aImages[navImage]);

			return false;
		});


		// Clic sur le profil
		/*$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-show-profile', function()
		{
			PanelFactory.load('panel-me');
			return false;
		});*/


		// Clic sur le lien de déconnexion
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-btn-logout', function()
		{
			WattodooAdapter.clearStorage(function()
			{
				$j('body').find( '> .' + self.elementClass + '-panel-expand' + '.' + self.elementClass ).removeClass( self.elementClass + '-show' );

				setTimeout( function() {
					$j('body').find( '> .' + self.elementClass + '-panel-expand' ).remove();
				}, 500 );

				Wattodoo.USER = undefined;

				WattodooAdapter.$emit('logout');
			});

			return false;
		});


		// Clic sur la catégorie des projets (toggle)
		$j(doc).on('click', '.' + self.elementClass + '-content-home h2 a', function()
		{
			var ul = $j(this).parent().next('.' + self.elementClass + '-list');
			ul.toggleClass(self.elementClass + '-hide');

			if ( ul.is(':visible') ) {
				$j(this).children('.fa').addClass('fa-chevron-down').removeClass('fa-chevron-right');
			}
			else {
				$j(this).children('.fa').addClass('fa-chevron-right').removeClass('fa-chevron-down');
			}

			return false;
		});


		// Clic sur le nom d'un projet
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-list a', function()
		{
			PanelFactory.load('panel-project', {type: $j(this).data('type'), id: $j(this).data('id')});

			return false;
		});


		// Clic sur le lien pour changer de projet par défaut
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-btn-search-project', function()
		{
			var button = $j('.' + self.elementClass + '-content-home .' + self.elementClass + '-btn-add-link');

			$j.get( WattodooAdapter.getURL( 'views/partials/overlay-add-link-projects.html' ), function(data )
			{
				$j('.' + self.elementClassSup + ' > .' + self.elementClass + '-wrap-content').append( Content.replace( data, 'home_overlay' ) );
				$j('.' + self.elementClass + '-overlay').css('top', button.position().top);
				$j('.' + self.elementClass + '-overlay-back').hide();
			});

			return false;
		});


		// Clic sur le nom d'un projet dans l'overlay de sélection
		$j(doc).on('click', ' .' + self.elementClass + '-overlay-list-projects li a', function()
		{
			var oProject = Wattodoo.USER[$j(this).data('type')][$j(this).data('id')];

			if ( isset( oProject.childs ) )
			{
				var html = Project.constructHTML( Wattodoo.USER, $j(this).data('type'), 'home_overlay', {type:$j(this).data('type'), id_parent:oProject.id } );
				var regExtID  = new RegExp( '__MSG_@@extension_id__', 'g' ),
				    regLocale = new RegExp( '___' + self.prefix_locale + '_([0-9a-z_]+)___', 'g' );

				/** @TODO : facto replace **/
				html = html
					.replace( regExtID, WattodooAdapter.getLocale( '@@extension_id' ) )
					.replace( regLocale, function( match, p1 ) { return WattodooAdapter.getLocale( '___' + self.prefix_locale + '_' + p1 + '___' ); })
					.replace( /___typeproject___/, $j(this).data('type') );

				$j('.' + self.elementClassSup + ' .' + self.elementClass + '-overlay-list-projects').html( html );
				$j('.' + self.elementClass + '-overlay-back')
					.attr('data-id_prev', oProject.id_parent)
					.attr('data-type', $j(this).data('type'));

				$j('.' + self.elementClass + '-overlay-back').show();
			}
			else {
				//$j('.' + self.elementClass + '-wrap-btn-add-link .' + self.elementClass + '-btn-add-link').data('idproject', oProject.id);
				$j('.' + self.elementClass + '-wrap-btn-add-link .' + self.elementClass + '-btn-add-link').attr('data-idproject', oProject.id);
				$j('.' + self.elementClass + '-wrap-btn-add-link .' + self.elementClass + '-btn-search-project span').text( (oProject.name === '___project_default___') ? WattodooAdapter.getLocale( '___project_default___' ) : oProject.name );

				self.overlayClose( $j('.' + self.elementClass + '-overlay-close') );

				WattodooAdapter.$emit('set_default_project', {id: oProject.id} );
			}

			return false;
		});


		// Clic sur le lien back de l'overlay de sélection
		$j(doc).on('click', ' .' + self.elementClass + '-overlay-back', function()
		{
			var html, idprev, oProject;

			if ( isset( Wattodoo.USER[$j(this).data('type')][$j(this).attr('data-id_prev').toString()] ) )
			{
				oProject = Wattodoo.USER[$j(this).data('type')][$j(this).attr('data-id_prev').toString()];
				html = Project.constructHTML( Wattodoo.USER, $j(this).data('type'), 'home_overlay', {type:$j(this).data('type'), id_parent:oProject.id } );
				idprev = oProject.id_parent;
			}
			else {
				html = Project.constructHTML( Wattodoo.USER, $j(this).data('type'), 'home_overlay', {type:$j(this).data('type'), id_parent:0 } );
				idprev = null;
			}

			
			var regExtID  = new RegExp( '__MSG_@@extension_id__', 'g' ),
			    regLocale = new RegExp( '___' + self.prefix_locale + '_([0-9a-z_]+)___', 'g' );

			/** @TODO : facto replace **/
			html = html
				.replace( regExtID, WattodooAdapter.getLocale( '@@extension_id' ) )
				.replace( regLocale, function( match, p1 ) { return WattodooAdapter.getLocale( '___' + self.prefix_locale + '_' + p1 + '___' ); })
				.replace( /___typeproject___/, $j(this).data('type') )
				.replace( /___project_default___/, WattodooAdapter.getLocale( '___project_default___' ) );

			$j('.' + self.elementClassSup + ' .' + self.elementClass + '-overlay-list-projects').html( html );
			$j('.' + self.elementClass + '-overlay-back')
				.attr('data-id_prev', idprev)
				.data('type', $j(this).data('type'));

			if ( $j(this).attr('data-id_prev') == null ) {
				$j('.' + self.elementClass + '-overlay-back').hide();
			}
			else {
				$j('.' + self.elementClass + '-overlay-back').show();
			}

			return false;
		});


		// Clic sur le bouton pour ajouter le lien au projet sélectionné
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-btn-add-link', function()
		{
			var aLinks    = Wattodoo.USER['myprojects'][$j(this).data('idproject')]['links'] || {},
			    newIdLink = 'new' + parseInt( Object.keys( aLinks ).length );

			aLinks[newIdLink] = Wattodoo.LINK;
			/** @TODO : facto replace **/
			var regLocale = new RegExp( '___' + self.prefix_locale + '_([0-9a-z_]+)___', 'g' );
			var html      = '<i class="fa fa-check"></i><span>___home_link_added___</span>';

			$j(this).parents('.' + self.elementClass + '-wrap-btn-add-link')
				.addClass(self.elementClass + '-link-added ' + self.elementClass + '-layout-row ' + self.elementClass + '-hcenter ' + self.elementClass + '-vcenter')
				.html(
					html.replace( regLocale, function( match, p1 ) { return WattodooAdapter.getLocale( '___' + self.prefix_locale + '_' + p1 + '___' ); })
				);

			WattodooAdapter.setStorage( {'User': Wattodoo.USER} );

			WattodooAdapter.$emit('add_link', $j.extend({}, {id_project: $j(this).data('idproject')}, Wattodoo.LINK ) );

			return false;
		});


		// Clic sur le bouton pour afficher le form d'ajout de projet
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-btn-add-project', function()
		{
			var oBtn = this;
			
			var regExtID  = new RegExp( '__MSG_@@extension_id__', 'g' ),
			    regLocale = new RegExp( '___' + self.prefix_locale + '_([0-9a-z_]+)___', 'g' );

			/** @TODO : facto replace **/
			if ( $j('.' + self.elementClass + '-form-add-project').length === 0 )
			{
				$j.get( WattodooAdapter.getURL( 'views/partials/form-add-project.html' ), function(data )
				{
					data = data
						.replace( regExtID, WattodooAdapter.getLocale( '@@extension_id' ) )
						.replace( regLocale, function( match, p1 ) { return WattodooAdapter.getLocale( '___' + self.prefix_locale + '_' + p1 + '___' ); })
						.replace( /___typeproject___/, $j(oBtn).data('type') );

					$j(oBtn).parent().next('ul').after( data );

					$j('.' + self.elementClass + '-field-add-project').focus();
				});
			}
			else {
				$j('.' + self.elementClass + '-field-add-project').focus();
			}

			return false;
		});


		// Soumission formulaire ajout projet
		$j(doc).on('submit', '.' + self.elementClass + '-form-add-project', function()
		{
			var form           = $j(this),
			    newprojectname = form.find('input[name="project"]').val(),
			    typeproject    = form.find('input[name="type_project"]').val(),
			    newidproject   = 'new' + parseInt( Object.keys(Wattodoo.USER[typeproject] ).length );


			WattodooAdapter.$emit('create_project', {name: newprojectname, id_temp:newidproject, classname:'.' + self.elementClass + '-form-add-project', typeproject:typeproject} );

			return false;
		});


		// Clic sur le bouton d'annulation de création de projet
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-form-add-project .' + self.elementClass + '-btn-danger', function()
		{
			$j(this).parents('form').remove();
			return false;
		});


		// Clic sur le bouton de to do
		$j(doc).on('click', '.' + self.elementClass + '-content-home .' + self.elementClass + '-btn-todo', function()
		{
			PanelFactory.load('panel-todo');
			return false;
		});
	}


	static callbackCreateProject( oParams )
	{
		var form = $j(oParams.classname);

		Wattodoo.USER[oParams.typeproject][oParams.id_project] = $j.extend({}, newProject(), {id: oParams.id_project, name: oParams.name});

		WattodooAdapter.setStorage( {'User': Wattodoo.USER} );

		var li = $j('<li/>').html(
				'<a href="#" class="'+WattodooAdapter.getLocale( '@@extension_id' )+'-ext-layout-row '+WattodooAdapter.getLocale( '@@extension_id' )+'-ext-vcenter" data-type="' + oParams.typeproject + '" data-id="' + oParams.id_project + '">\
					<i class="fa fa-eye"></i>\
					<span class="'+WattodooAdapter.getLocale( '@@extension_id' )+'-ext-flex">' + escapeHTML( oParams.name ) + '</span>\
					<span class="count">0</span>\
				</a>'
		);
		form.prev('ul').append(li);

		PanelFactory.load('panel-project', {type: oParams.typeproject, id: oParams.id_project});

		form.remove();
	}
}