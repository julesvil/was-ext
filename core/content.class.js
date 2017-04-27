"use strict";


class Content
{
	static reg( key, prefixLocale )
	{
		var oReg = {
			color               : '___MAJOR_COLOR___',
			user                : '___USER_([0-9a-z_-]+)___',
			userRelationships   : '___USER/([0-9a-z_-]+)___', 
			project             : '___PROJECT_([0-9a-z_-]+)___',
			projectRelationships: '___PROJECT/([0-9a-z_-]+)___',
			link                : '___LINK_([0-9a-z_-]+)___',
			linkRelationships   : '___LINK/([0-9a-z_-]+)___',
			comment             : '___COMMENT_([0-9a-z_-]+)___',
			commentRelationships: '___COMMENT/([0-9a-z_-]+)___',
			partials            : '___PARTIALS/([0-9a-z_-]+)___',
			extID               : '__MSG_@@extension_id__',
			extURL              : '___EXT_URL___',
			locale              : '___%locale%_([0-9a-z_]+)___',
			defaultProject      : '___project_default___'
		};

		return new RegExp( oReg[key].replace('%locale%', prefixLocale), 'g' );
	}


	static replace( data, template, oParams )
	{
		data = Content.replaceUser   ( data, template, oParams, Wattodoo.USER );
		data = Content.replaceProject( data, template, oParams, Wattodoo.PROJECT );
		data = Content.replaceLink   ( data, template, oParams, Wattodoo.LINK );
		data = Content.replaceComment( data, template, oParams, Wattodoo.COMMENT );
		data = Content.replaceGlobal ( data, template );

		return data;
	}


	static replaceUser( data, template, oParams, oUser )
	{
		if ( isset( oUser ) ) {
			data = data
				.replace( Content.reg('user'), function( match, p1 ) { return escapeHTML( oUser[p1] ); })
				.replace( Content.reg('userRelationships'), function( match, p1 ) { return oUser.relationConstruct( p1, template, oParams ); });
		}

		return data;
	}


	static replaceProject( data, template, oParams, oProject )
	{
		if ( isset( oProject ) ) {
			data = data
				.replace( Content.reg('project'), function( match, p1 ) { return escapeHTML( oProject[p1] ); })
				.replace( Content.reg('projectRelationships'), function( match, p1 ) { return oProject.relationConstruct( p1, template, oParams ); });
		}

		return data;
	}


	static replaceLink( data, template, oParams, oLink )
	{
		if ( isset( oLink ) ) {
			data = data
				.replace( Content.reg('link'), function( match, p1 ) { return escapeHTML( oLink[p1] ); })
				.replace( Content.reg('linkRelationships'), function( match, p1 ) { return oLink.relationConstruct( p1, template, oParams ); });
		}

		return data;
	}


	static replaceComment( data, template, oParams, oComment )
	{
		if ( isset( oComment ) ) {
			data = data
				.replace( Content.reg('comment'), function( match, p1 ) {
					if ( p1 === 'comment' ) {
						return escapeHTML( oComment[p1], 'br' );
					}
					else {
						return escapeHTML( oComment[p1] );
					}
				})
				.replace( Content.reg('commentRelationships'), function( match, p1 ) { return oComment.relationConstruct( p1, template, oParams ); });
		}

		return data;
	}


	static replaceGlobal( data, template )
	{
		return data
			.replace( Content.reg('extID'), WattodooAdapter.getLocale( '@@extension_id' ) )
			.replace( Content.reg('extURL'), Wattodoo.domain_url )
			.replace( Content.reg('locale',  template), function( match, p1 ) { return WattodooAdapter.getLocale( '___' + template + '_' + p1 + '___' ); })
			.replace( Content.reg('defaultProject'), WattodooAdapter.getLocale( '___project_default___' ));
	}
}