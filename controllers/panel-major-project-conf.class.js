"use strict";


class PanelMajorProjectConf extends PanelMajor
{
	get view()          { return 'views/project-conf.html'; }
	get prefix_locale() { return 'projectconf'; }



	constructor()
	{
		super();
	}



	addEvents()
	{
		var self  = this,
		    doc   = '.' + self.elementClassSup;


		super.addEvents();


		$j(document).ready(function()
		{
			$j(doc + ' .' + self.elementClass + '-datepicker').datepicker({dateFormat: 'dd/mm/yy'});

			var oProject;

			$j(doc + ' form').each(function()
			{
				oProject = new Project( {type: Wattodoo.PROJECT.__type, id: $j(this).data('idproject')} );

				$j(this).find('select[name="time_h_start"] option[value="' + oProject.time_h_start + '"]').prop('selected', true);
				$j(this).find('select[name="time_i_start"] option[value="' + oProject.time_i_start + '"]').prop('selected', true);
				$j(this).find('select[name="time_h_end"]   option[value="' + oProject.time_h_end   + '"]').prop('selected', true);
				$j(this).find('select[name="time_i_end"]   option[value="' + oProject.time_i_end   + '"]').prop('selected', true);
			});
		});


		// Clic sur un participant
		$j(doc).on('click', '.' + self.elementClass + '-participants a', function()
		{
			var self = $j(this);

			if ( self.data('id') == Wattodoo.PROJECT.id_user_project ) {
				alert( WattodooAdapter.getLocale('___projectconf_impossible_delete___') );
				return false;
			}

			if ( confirm( WattodooAdapter.getLocale('___projectconf_confirm_delete_participant___') ) )
			{
				WattodooAdapter.$emit('delete_user', {id_user: self.data('id'), id_project: Wattodoo.PROJECT.id} );
			}

			return false;
		});


		// Affiche les sous-projets
		$j(doc).on('click', '.' + self.elementClass + '-project-list-subprojects a', function()
		{
			$j(this).siblings('div').toggle();
			$j(this).children('.fa').toggleClass('rotate');

			return false;
		});


		// Soumission formulaire modification projet
		$j(doc).on('submit',  '.' + self.elementClass + '-form-update-project', function()
		{
			var name           = $j(this).find('input[name="name"]').val(),
					id_project     = $j(this).find('input[name="id"]').val(),

					aDateStart     = $j(this).find('input[name="date_start"]').val().split('/'),
					aDateEnd       = $j(this).find('input[name="date_end"]').val().split('/'),

					date_start     = aDateStart[2] + '-' + aDateStart[1] + '-' + aDateStart[0],
					date_end       = aDateEnd[2]   + '-' + aDateEnd[1]   + '-' + aDateEnd[0],
					time_start     = $j(this).find('select[name="time_h_start"]').val() + ':' + $j(this).find('select[name="time_i_start"]').val() + ':00',
					time_end       = $j(this).find('select[name="time_h_end"]').val()   + ':' + $j(this).find('select[name="time_i_end"]').val()   + ':00',

					the_date_start = date_start + ' ' + time_start,
					the_date_end   = date_end   + ' ' + time_end;

			Wattodoo.USER[Wattodoo.PROJECT.__type][id_project]['name']       = name;
			Wattodoo.USER[Wattodoo.PROJECT.__type][id_project]['date_start'] = the_date_start;
			Wattodoo.USER[Wattodoo.PROJECT.__type][id_project]['date_end']   = the_date_end;

			WattodooAdapter.setStorage( {'User': Wattodoo.USER} );

			var check = $j(this).find('button[type="submit"] + .fa');
			check.css({
				transition: 'none',
				opacity   : 1
			});

			setTimeout(function()
			{
				check.css({
					transition: 'all ease 2s',
					opacity   : 0
				});
			}, 1000);

			WattodooAdapter.$emit('update_project', {name: name, date_start: the_date_start, date_end: the_date_end, id_project: id_project} );

			return false;
		});


		// Archivage du projet
		$j(doc).on('click',  '.' + self.elementClass + '-form-update-project .' + self.elementClass + '-btn-del', function()
		{
			//layers.splice( key, 1 ); myarchivedprojects
			var id_project = $j(this).parents('form').find('input[name="id"]').val();

			Wattodoo.USER[Wattodoo.PROJECT.__type][id_project]['archive'] = '1';
			Wattodoo.USER['myarchivedprojects'][id_project]               = Wattodoo.USER[Wattodoo.PROJECT.__type][id_project];

			delete Wattodoo.USER[Wattodoo.PROJECT.__type][id_project];

			WattodooAdapter.setStorage( {'User': Wattodoo.USER} );

			var check = $j(this).find('+ .fa');
			check.css({
				transition: 'none',
				opacity   : 1
			});

			setTimeout(function()
			{
				check.css({
					transition: 'all ease 2s',
					opacity   : 0
				});
			}, 1000);

			//WattodooAdapter.$emit('archive_project', {id_project: Wattodoo.PROJECT.id} );

			$j('.' + self.elementClass + '-head-close').click();

			return false;
		});
	}
}