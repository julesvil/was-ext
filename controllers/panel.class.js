"use strict";

/*
Vert : #43ca83
Orange : #ee7e33
Bleu : #0096db
*/



const CommentRelationships = {
	user: User
};

const LinkRelationships = {
	comments: Comment
};

const ProjectRelationships = {
	participants: User,
	links       : Link,
	subprojects : Project
};

const UserRelationships = {
	myprojects        : Project,
	myarchivedprojects: Project,
	mysharedprojects  : Project
};






class Panel {
	static get MAJOR_COLOR()  { return '#ee7e33'; }

	static get zIndex()        { return Panel._zIndex; }
	static set zIndex( value ) { Panel._zIndex = value; }


	get elementClass()  { return WattodooAdapter.getLocale( '@@extension_id' ) + '-ext'; }

	get oPartials()        { return this._oPartials || ''; }
	set oPartials( value ) { this._oPartials = value; }


	constructor()
	{
		if ( !isset( Panel.zIndex ) )
		{
			Panel.zIndex = Math.max(
				99999,
				Math.max.apply(
					null,
					$j.map( $j.makeArray( document.getElementsByTagName('*') ),
						function (element) {
							return parseInt( $j(element).css('z-index') ) || null;
						}
					)
				)
			);
		}
	}

	append( callback )
	{
		var that = this;


		function loadContent( callback )
		{
			$j.get( WattodooAdapter.getURL( that.view ), function( data )
			{
				$j('body').append( Content.replace( data, that.prefix_locale ) );
				$j('.' + that.elementClassSup ).css( 'z-index', that.zIndex );

				that.addEvents();


				if ( that.oPartials !== '' )
				{
					for ( let namePartial in that.oPartials )
					{
						if ( that.oPartials.hasOwnProperty(namePartial) && that.oPartials[namePartial] !== '' )
						{
							$j.get( WattodooAdapter.getURL( 'views/partials/' + that.oPartials[namePartial] + '.html' ), function(data )
							{
								/** @TODO : debug remplace uniquement son panel **/
								$j('.' + that.elementClassSup + ' .' + that.elementClass + '-partial-' + namePartial ).html( Content.replace( data, that.prefix_locale ) );
							});
						}
					}
				}


				setTimeout( function() {
					$j('body').find( '> .' + that.elementClassSup + '.' + that.elementClass ).addClass( that.elementClass + '-show' );

					if ( isset( callback ) )
					{
						callback();
					}
				}, 10 );

				setTimeout( function() {
					var oldIdProject = '';

					$j('body').find( '> .' + that.elementClassSup ).not(':last').remove();
					$j('.' + that.elementClassSup + ' .scrollbar-macosx').scrollbar();

					$j('.' + that.elementClass + '-sortable-links').sortable({
						connectWith: '.' + that.elementClass + '-sortable-links',
						placeholder: that.elementClass + '-ui-state-highlight ' + that.elementClass + '-flex-33',
						start      : function( event, ui )
						{
							oldIdProject = $j(ui.item).parents('.' + that.elementClass + '-project-links').data('idproject');
						},
						stop       : function( event, ui )
						{
							var newIdProject = $j(ui.item).parents('.' + that.elementClass + '-project-links').data('idproject');

							if ( oldIdProject != newIdProject )
							{
								WattodooAdapter.$emit( 'set_parent_link', {id_link: $j(ui.item).children('a').first().data('id'), id_project_old: oldIdProject, id_project_new: newIdProject} );
							}
						}
					}).disableSelection();
				}, 500 );
			});
		}


		if ( $j('head > #' + that.elementClass + '-style-element').length === 0 )
		{
			$j.get( WattodooAdapter.getURL( 'css/styles.css' ), function(dataCSS )
			{
				dataCSS = dataCSS.replace( Content.reg('color'),  Panel.MAJOR_COLOR );

				/** @TODO : mettre css dans manifest + dynmaiser partial css color **/
				$j('head').append('<style id="' + that.elementClass + '-style-element">' + dataCSS + '</style>');
				$j('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"/>');
				$j('head').append('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css"/>');

				loadContent( callback );
			});
		}
		else {
			loadContent( callback );
		}
	}



	static isDisplayed()
	{
		return $j('.' + WattodooAdapter.getLocale( '@@extension_id' ) + '-ext').length >= 1;
	}
}