"use strict";


class Comment
{
	get comment()      { return this._comment.replace(/\n/g, '<br/>'); }
	set comment(value) { return this._comment = value; }



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
		return CommentRelationships[name].constructHTML( this, name, page, oParams );
	}


	static constructHTML( oCaller, relation, page, oParams )
	{
		if ( isset(oCaller[relation]) )
		{
			switch ( page )
			{
				case 'link' :
					var oComment,
					    oUser;

					$j.get( WattodooAdapter.getURL( 'views/partials/link-comment.html' ), function(data )
					{
						var newData;

						for ( var k in oCaller.comments )
						{
							if ( oCaller.comments.hasOwnProperty(k) )
							{
								oComment = new Comment(oCaller.comments[k]);
								oUser    = new User(Wattodoo.USERS[oCaller.comments[k].id_user]);

								if (isset(Wattodoo.USERS[oCaller.comments[k].id_user])) {
									newData = Content.replaceComment(data, page, oParams, oComment);
									newData = Content.replaceUser   (newData, page, oParams, oUser);
									newData = Content.replaceGlobal (newData, page);

									$j('.' + Wattodoo.ID + '-ext-partial-' + page + '-comments ul').append(newData);
								}
							}
						}
					});

					return '';
				break;
			}
		}
		else {
			return '';
		}
	}
}