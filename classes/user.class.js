"use strict";



var newUser = function()
{
	return {
		id    : 'id_user_lambda',
		avatar: WattodooAdapter.getURL( 'img/no-avatar.png' ),
		name  : 'No Name',
		email : 'not@logged.com'
	}
};




class User
{
	get avatar()      { return this._avatar || WattodooAdapter.getURL( 'img/no-avatar.png' ); }
	set avatar(value) { this._avatar = value; }


	get name()        { return this._name; }
	set name(value)   { this._name = value; }

	get name2()       { return this.name || this.firstname + ' ' + this.lastname || 'No Name'; }

	get email()       { return this._email || 'not@logged'; }
	set email(value)  { this._email = value; }

	get myprojects()      { return this._myprojects || [newProject()]; }
	set myprojects(value) { this._myprojects = value; }


	get myprojects_default() {
		var idDefault   = '0',
		    nameDefault = '',
		    k;

		for ( k in this.myprojects )
		{
			if ( this.myprojects.hasOwnProperty(k) && this.myprojects[k].by_default === '1' )
			{
				idDefault   = this.myprojects[k].id;
				nameDefault = this.myprojects[k].name;
				break;
			}
		}

		if ( idDefault === '0' )
		{
			for ( k in this.myprojects )
			{
				if ( this.myprojects.hasOwnProperty(k) )
				{
					idDefault   = this.myprojects[k].id;
					nameDefault = this.myprojects[k].name;
					break;
				}
			}
		}

		return { id: idDefault, name: nameDefault };
	}
	get myprojects_default_id()   { return this.myprojects_default.id; }
	get myprojects_default_name() { return this.myprojects_default.name; }

	get myrate () { return Wattodoo.LINK.rates[this.id] || 0; }



	constructor( oInfos )
	{
		if ( isset( oInfos ) ) {
			for ( var carac in oInfos ) {
				if ( oInfos.hasOwnProperty(carac) ) {
					this[carac] = oInfos[carac];
				}
			}
		}
	}


	relationConstruct( name, page, oParams )
	{
		oParams = $j.extend( {}, oParams, {type: name} );

		return UserRelationships[name].constructHTML( this, name, page, oParams );
	}


	static load( type, sendResponse )
	{
		if ( type === 'no_auth' )
		{
			WattodooAdapter.getStorage(['User', 'Users'], function(result) {
				if ( isset( result.User ) )
				{
					Wattodoo.USER = new User( result.User );
				}
				else {
					Wattodoo.USER = new User( newUser() );
					Wattodoo.USER.myprojects = {'new': newProject()};
				}

				Wattodoo.USER._type_in_app = type;

				Wattodoo.USERS = {};
				Wattodoo.USERS[Wattodoo.USER.id] = Wattodoo.USER;

				sendResponse();
			});
		}
		else if ( type === 'auth' )
		{
			WattodooAdapter.getStorage(['User', 'Users'], function(result) {
				Wattodoo.USER = new User( result.User );
				Wattodoo.USER._type_in_app = type;

				Wattodoo.USERS = result.Users;
				
				sendResponse();
			});
		}
	}

	static constructHTML( oCaller, relation, page, oParams )
	{
		var aDatas = oCaller[relation], ul, li, k, oUser, avatar;
		
		switch ( page )
		{
			case 'project' :
				//console.log(Wattodoo.USERS);
				//console.log(aDatas);
				ul = $j('<ul/>').addClass('__MSG_@@extension_id__-ext-participants __MSG_@@extension_id__-ext-layout-row');

				for ( k in aDatas )
				{
					if ( aDatas.hasOwnProperty(k) )
					{
						oUser  = new User( Wattodoo.USERS[aDatas[k]] );
						li     = $j('<li/>').html( '<img src="' + oUser.avatar + '" width="45" height="45" alt="' + oUser.name2 + '" title="' + oUser.name2 + '"/>' );

						ul.append(li);
					}
				}

				li = $j('<li/>').html( '<a href="#" class="__MSG_@@extension_id__-ext-layout-column __MSG_@@extension_id__-ext-hcenter __MSG_@@extension_id__-ext-vcenter __MSG_@@extension_id__-ext-btn-add-participants">+</a>' );
				ul.append(li);

				return ul.get(0).outerHTML;
			break;

			case 'projectconf' :
				ul = $j('<ul/>').addClass('__MSG_@@extension_id__-ext-participants __MSG_@@extension_id__-ext-layout-row');

				for ( k in aDatas )
				{
					if ( aDatas.hasOwnProperty(k) )
					{
						oUser = Wattodoo.USERS[aDatas[k]];

						avatar = ( oUser.avatar !== null ) ? oUser.avatar : WattodooAdapter.getURL('img/no-avatar.png');

						li = $j('<li/>').html(
								'<a href="#" data-id="' + oUser.id + '">\
							<i class="fa fa-minus"></i>\
							<img src="' + avatar + '" width="45" height="45" alt="' + oUser.name + '" title="' + oUser.name + '"/>\
						</a>'
						);

						ul.append(li);
					}
				}

				return ul.get(0).outerHTML;
			break;
		}
	}
}