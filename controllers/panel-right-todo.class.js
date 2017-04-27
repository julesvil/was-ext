"use strict";



class PanelRightTodo extends PanelRight
{
	get view()          { return 'views/todo.html'; }
	get prefix_locale() { return 'home'; }



	constructor()
	{
		super();
	}

	addEvents()
	{
		var self = this;

		$j.get( WattodooAdapter.getURL('scripts.json') , function(data )
		{
			var container = $j('.' + self.elementClass + '-list-todo'),
			    aScripts  = JSON.parse(data),
			    reg       = /\/\*\* @TODO : (.*) \*\*\//g,
			    aMatches,
			    div;

			for ( let i in aScripts )
			{
				if ( aScripts.hasOwnProperty(i) )
				{
					$j.get( WattodooAdapter.getURL( aScripts[i] ) , function(content )
					{
						if ( aMatches = content.match( reg ) )
						{
							div = $j('<div/>').css({marginTop:'10px', fontWeight:'bold', fontSize:'14px'}).text( aScripts[i] );
							container.append( div );

							for ( var j in aMatches )
							{
								if ( aMatches.hasOwnProperty(j) )
								{
									div = $j('<div/>').html( '&bull; ' + aMatches[j].replace('/** @TO', '').replace('DO : ', '').replace(' **/', '') );
									container.append( div );
								}
							}
						}
					});
				}
			}
		});
	}
}