"use strict";


var newProject = function() {
	return {
		archive     : '0',
		date_end    : '0000-00-00 00:00:00',
		date_start  : '0000-00-00 00:00:00',
		id          : 'new',
		by_default  : '0',
		id_parent   : '0',
		is_admin    : '1',
		name        : '___project_default___',
		participants: [
			/*{
				name  : Wattodoo.USER.name,
				avatar: Wattodoo.USER.avatar
			}*/
			Wattodoo.USER.id
		],
		links: []
	};
};



class Project
{
	get date_start()        { return ( this._date_start === '00/00/0000' ) ? '' : this._date_start; }
	set date_start( value ) {
		var aDateTime = value.split(' '),
		    aDate     = aDateTime[0].split('-'),
		    aTime     = aDateTime[1].split(':');

		this._date_start  = aDate[2] + '/' + aDate[1] + '/' + aDate[0];
		this.time_h_start = aTime[0];
		this.time_i_start = aTime[1];
	}

	get date_end()          { return ( this._date_end === '00/00/0000' ) ? '' : this._date_end; }
	set date_end( value )   {
		var aDateTime = value.split(' '),
				aDate     = aDateTime[0].split('-'),
				aTime     = aDateTime[1].split(':');

		this._date_end  = aDate[2] + '/' + aDate[1] + '/' + aDate[0];
		this.time_h_end = aTime[0];
		this.time_i_end = aTime[1];
	}



	constructor( params )
	{
		var aDatas = Wattodoo.USER[params.type];

		for ( var k in aDatas ) {
			if ( aDatas.hasOwnProperty(k) && aDatas[k].id == params.id )
			{
				for ( var carac in aDatas[k] ) {
					if ( aDatas[k].hasOwnProperty(carac) ) {
						this[carac] = aDatas[k][carac];
					}
				}
			}
		}

		this.__type = params.type;
	}



	relationConstruct( name, page, oParams )
	{
		return ProjectRelationships[name].constructHTML( this, name, page, oParams );
	}


	/** @TODO : exporter html en partial **/
	static constructHTML( oCaller, relation, page, oParams )
	{
		var wrap   = $j('<div/>'),
				aDatas = oCaller[relation],
				ul, li, show, k;

		oParams    = oParams || {};

		switch ( page )
		{
			case 'home' :
				ul = $j('<ul/>').addClass('__MSG_@@extension_id__-ext-list');

				if ( relation === 'myprojects' )
				{
					show = true;

					wrap.html(
						'<h2 class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter">\
							<a href="#" class="__MSG_@@extension_id__-ext-flex"><i class="fa fa-chevron-down"></i> <span>Mes projets</span></a>\
							<button type="button" class="__MSG_@@extension_id__-ext-btn __MSG_@@extension_id__-ext-btn-xs __MSG_@@extension_id__-ext-btn-add-project" data-type="' + oParams.type + '">Créer</button>\
						</h2>'
					);
				}
				else if ( relation === 'myarchivedprojects' )
				{
					show = false;

					wrap.html(
						'<h2 class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter">\
							<a href="#" class="__MSG_@@extension_id__-ext-flex"><i class="fa fa-chevron-right"></i> <span>Mes projets archivés</span></a>\
						</h2>'
					);
				}
				else if ( relation === 'mysharedprojects' && Wattodoo.USER._type_in_app === 'auth' )
				{
					show = true;

					wrap.html(
						'<h2 class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter">\
							<a href="#" class="__MSG_@@extension_id__-ext-flex"><i class="fa fa-chevron-down"></i> <span>Projets partagés avec moi</span></a>\
						</h2>'
					);
				}


				console.log(aDatas);

				if ( aDatas.length == 0 )
				{
					ul = $j('<p/>').addClass('__MSG_@@extension_id__-ext-no-result __MSG_@@extension_id__-ext-list').text('Aucun projet dans cette catégorie');
				}
				else {
					for ( k in aDatas ) {
						if ( aDatas.hasOwnProperty(k) && aDatas[k].id_parent === '0' )
						{
							li = $j('<li/>')
											.html( '<a href="#" class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter" data-type="' + oParams.type + '" data-id="' + aDatas[k].id + '">\
																<i class="fa fa-eye"></i>\
																<span class="__MSG_@@extension_id__-ext-flex">' + aDatas[k].name + '</span>\
																<span class="count">' + Object.size(aDatas[k].links) + '</span>\
															</a>' );

							ul.append(li);
						}
					}
				}

				if ( show === false )
				{
					ul.addClass('__MSG_@@extension_id__-ext-hide');
				}

				wrap.append(ul);
			break;

			case 'home_overlay' :
				ul = $j('<ul/>').addClass('__MSG_@@extension_id__-ext-overlay-list-projects');

				oParams.id_parent = oParams.id_parent || '0';

				for ( k in aDatas ) {
					if ( aDatas.hasOwnProperty(k) && aDatas[k].id_parent === oParams.id_parent )
					{
						li = $j('<li/>').html( '<a href="#" class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter" data-type="' + oParams.type + '" data-id="' + aDatas[k].id + '">' + aDatas[k].name + '</a>' );

						ul.append(li);
					}
				}

				wrap.append(ul);
			break;

			case 'project' :
				var extID = WattodooAdapter.getLocale( '@@extension_id' );

				if ( isset( Wattodoo.PROJECT.childs ) )
				{
					wrap.append( getContentChilds( Wattodoo.PROJECT.childs, 1 ) );
				}

				if ( Wattodoo.PROJECT.archive == '1' )
				{
					$j('.' + extID + '-ext-btn-project-conf').remove();
					$j('.' + extID + '-ext-btn-add-participants').remove();
					$j('.' + extID + '-ext-btn-add-subproject').remove();
				}
			break;

			case 'projectconf' :
				if ( isset( Wattodoo.PROJECT.childs ) )
				{
					wrap.append( getContentChilds2( Wattodoo.PROJECT.childs, 1 ) );
				}
			break;
		}


		function getContentChilds2( children, level )
		{
			var ul = $j('<ul/>').addClass('__MSG_@@extension_id__-ext-project-list-subprojects __MSG_@@extension_id__-ext-project-list-subprojects' + level),
			    li, oProject;

			return $j.map( children, function( id, key )
			{
				oProject = new Project( {type: Wattodoo.PROJECT.__type, id: children[key]} );

				li = constructLiSubproject2( oProject );

				if ( isset( oProject.childs ) )
				{
					li.find('> div').append( getContentChilds2( oProject.childs, 2 ) );
				}

				ul.append(li);

				return ul;
			});
		}


		function getContentChilds( children, level )
		{
			var ul = $j('<ul/>').addClass('__MSG_@@extension_id__-ext-project-list-subprojects __MSG_@@extension_id__-ext-project-list-subprojects' + level),
			    li, oProject;

			return $j.map( children, function( id, key )
			{
				oProject = new Project( {type: Wattodoo.PROJECT.__type, id: children[key]} );

				li = constructLiSubproject( oProject, level );

				if ( isset( oProject.childs ) )
				{
					li.find('> div').append( getContentChilds( oProject.childs, 2 ) );
				}

				ul.append(li);

				return ul;
			});
		}

		return wrap.get(0).innerHTML;
	}
}



/** @TODO : exporter HTML et facto replace **/
var constructLiSubproject = function( oProject, level )
{
	var li = $j('<li/>').html( 
	    	'<a href="#" class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter __MSG_@@extension_id__-ext-show-subproject">' +
	    		'<i class="fa fa-play"></i>' +
	    		'<span>' + oProject.name + '</span>' +
	    	'</a>' +
				'<div>' +
					(
						( level == 1 ) ?
						'<div class="__MSG_@@extension_id__-ext-wrap-btn-add-subproject">' +
							'<button type="button" class="__MSG_@@extension_id__-ext-btn __MSG_@@extension_id__-ext-btn-xs __MSG_@@extension_id__-ext-btn-add-subproject">Créer un sous-projet</button>' +
							'<form action="#" method="post" class="__MSG_@@extension_id__-ext-form-add-subproject">' +
								'<p class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter">' +
									'<span class="__MSG_@@extension_id__-ext-flex"></span>' +
									'<input placeholder="___project_form_project_name___" name="project" type="text" required style="background:#fff;border:1px solid #a7a7a7" class="__MSG_@@extension_id__-ext-field-add-project"/>' +
									'<input type="hidden" name="id_parent" value="___PROJECT_id___"/>' +
									'<input type="hidden" name="name_parent" value="___PROJECT_name___"/>' +
									'<input type="hidden" name="level" value="2"/>' +
									'<button type="submit" class="__MSG_@@extension_id__-ext-btn __MSG_@@extension_id__-ext-btn-xs">___project_form_project_btn___</button>' +
									'<button type="button" class="__MSG_@@extension_id__-ext-btn __MSG_@@extension_id__-ext-btn-xs __MSG_@@extension_id__-ext-btn-danger">Annuler</button>' +
								'</p>' +
							'</form>' +
						'</div>' : ''
					) +

					'<div class="__MSG_@@extension_id__-ext-partial-project-partial-links __MSG_@@extension_id__-ext-project-links" data-idproject="___PROJECT_id___">\
						<ul class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-hcenter __MSG_@@extension_id__-ext-layout-wrap __MSG_@@extension_id__-ext-sortable-links __MSG_@@extension_id__-ext-links">\
							___PROJECT/links___\
						</ul>\
					</div>\
				</div>'
	    );

	li.html(
		li.html()
			.replace( /___PROJECT_([0-9a-z_-]+)___/g,  function( match, p1 ) { return oProject[p1]; })
			.replace( /___PROJECT\/links___/g,         function() { return oProject.relationConstruct( 'links', 'project-partial' ) })
			.replace( /__MSG_@@extension_id__/g,       WattodooAdapter.getLocale( '@@extension_id' ) )
			.replace( /___project_([0-9a-z_]+)___/g,   function( match, p1 ) { return WattodooAdapter.getLocale( '___project_' + p1 + '___' ); })
	);

	return li;
};


/** @TODO : exporter HTML et facto replace **/
var constructLiSubproject2 = function( oProject )
{
	var li = $j('<li/>').html(
				'<a href="#" class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter __MSG_@@extension_id__-ext-show-subproject">\
					<i class="fa fa-play"></i>\
					<span>' + oProject.name + '</span>\
				</a>\
				<div>\
					<form action="#" method="post" class="__MSG_@@extension_id__-ext-form-update-project" data-idproject="___PROJECT_id___">\
						<div class="__MSG_@@extension_id__-ext-layout-row __MSG_@@extension_id__-ext-vcenter __MSG_@@extension_id__-ext-space-between">\
							<p>\
								<label for="projectname___PROJECT_id___">___projectconf_form_project_name___</label><br/>\
								<input type="text" name="name" required id="projectname___PROJECT_id___" value="___PROJECT_name___"/>\
							</p>\
							<p>\
								<label for="projectstart___PROJECT_id___">___projectconf_form_project_date_start___</label><br/>\
								<input type="text" name="date_start" placeholder="JJ/MM/AAAA" id="projectstart___PROJECT_id___" class="__MSG_@@extension_id__-ext-datepicker" value="___PROJECT_date_start___"/>\
								<select name="time_h_start">\
									<option value="00">00</option>\
									<option value="01">01</option>\
									<option value="02">02</option>\
									<option value="03">03</option>\
									<option value="04">04</option>\
									<option value="05">05</option>\
									<option value="06">06</option>\
									<option value="07">07</option>\
									<option value="08">08</option>\
									<option value="09">09</option>\
									<option value="10">10</option>\
									<option value="11">11</option>\
									<option value="12">12</option>\
									<option value="13">13</option>\
									<option value="14">14</option>\
									<option value="15">15</option>\
									<option value="16">16</option>\
									<option value="17">17</option>\
									<option value="18">18</option>\
									<option value="19">19</option>\
									<option value="20">20</option>\
									<option value="21">21</option>\
									<option value="22">22</option>\
									<option value="23">23</option>\
								</select>\
								h\
								<select name="time_i_start">\
									<option value="00">00</option>\
									<option value="10">10</option>\
									<option value="20">20</option>\
									<option value="30">30</option>\
									<option value="40">40</option>\
									<option value="50">50</option>\
								</select>\
							</p>\
							<p>\
								<label for="projectend___PROJECT_id___">___projectconf_form_project_date_end___</label><br/>\
								<input type="text" name="date_end" placeholder="JJ/MM/AAAA" id="projectend___PROJECT_id___" class="__MSG_@@extension_id__-ext-datepicker" value="___PROJECT_date_end___"/>\
								<select name="time_h_end">\
									<option value="00">00</option>\
									<option value="01">01</option>\
									<option value="02">02</option>\
									<option value="03">03</option>\
									<option value="04">04</option>\
									<option value="05">05</option>\
									<option value="06">06</option>\
									<option value="07">07</option>\
									<option value="08">08</option>\
									<option value="09">09</option>\
									<option value="10">10</option>\
									<option value="11">11</option>\
									<option value="12">12</option>\
									<option value="13">13</option>\
									<option value="14">14</option>\
									<option value="15">15</option>\
									<option value="16">16</option>\
									<option value="17">17</option>\
									<option value="18">18</option>\
									<option value="19">19</option>\
									<option value="20">20</option>\
									<option value="21">21</option>\
									<option value="22">22</option>\
									<option value="23">23</option>\
								</select>\
								h\
								<select name="time_i_end">\
									<option value="00">00</option>\
									<option value="10">10</option>\
									<option value="20">20</option>\
									<option value="30">30</option>\
									<option value="40">40</option>\
									<option value="50">50</option>\
								</select>\
							</p>\
							</div>\
						<p>\
							<input type="hidden" name="id" value="___PROJECT_id___"/>\
							<button type="submit" class="__MSG_@@extension_id__-ext-btn">___projectconf_form_project_btn___</button>\
							<i class="fa fa-check"></i>\
							<button type="button" class="__MSG_@@extension_id__-ext-btn __MSG_@@extension_id__-ext-btn-danger __MSG_@@extension_id__-ext-btn-del">___projectconf_form_project_btn_del___</button>\
						</p>\
					</form>\
				</div>'
			);

	li.html(
		li.html()
			.replace( /___PROJECT_([0-9a-z_-]+)___/g,     function( match, p1 ) { return oProject[p1]; })
			.replace( /__MSG_@@extension_id__/g,          Wattodoo.ID )
			.replace( /___projectconf_([0-9a-z_]+)___/g,  function( match, p1 ) { return WattodooAdapter.getLocale( '___projectconf_' + p1 + '___' ); })
	);

	return li;
};