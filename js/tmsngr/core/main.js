/** 
 * Copyright (c) 2009, M. Andrés Pagella <andres.pagella@gmail.com>
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *    This product includes software developed by the <organization>.
 * 4. Neither the name of the <organization> nor the
 *    names of its contributors may be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY M. ANDRES PAGELLA ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL M. ANDRES PAGELLA BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @dependency ALL TM CHILD FUNCTION DEFINITIONS.
 * @summary Application Core, Main methods
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.core) TM.core = {};

/**
 * TM.core.init
 * @param null
 * @returns void
 */
TM.core.init = function() 
{
	$.ajaxSetup({
		timeout: 1000 * TM.core.ajax.parameters.timeout, // 20 second timeout
		async: TM.core.ajax.parameters.async,
		cache: TM.core.ajax.parameters.cache
	});
	
	TM.settings.load();
	TM.db.init();
	
	// Define which DOM elements will be able to move the window
	$('img').addClass('enable-move-window');
	$('div').addClass('enable-move-window');
	$('.bodyContent2').removeClass('enable-move-window');
	$('strong').addClass('enable-move-window');
	$('a').addClass('enable-move-window');
	$('p').addClass('enable-move-window');
	$('li').addClass('enable-move-window');
	$('span').addClass('enable-move-window');
	
	// Handle the start of AJAX requests
	$('body').ajaxStart(function() {
		TM.core.ajax.start('loader');
	});
	
	// Handle the end of AJAX requests
	$('body').ajaxComplete(function() {
		TM.core.ajax.end('loader');
	});
	
	// Handle AJAX errors
	$('body').ajaxError(function() {
		TM.core.ajax.error('loader');
	});
	
	// Initiate main application loop
	TM.core.loop();
}

/**
 * TM.core.loop
 * @param null
 * @returns void
 */
TM.core.loop = function()
{
	try {
		if (IS_CONVERSATION_WINDOW) {}
	} catch(e) {
		TM.core.refresh();
	}	
	
	setTimeout(function() {
		TM.core.loop();
	}, (1000 * parseInt(TM.settings.current.refreshTime)));
}

/**
 * TM.core.refresh
 * @param null
 * @returns void
 */
TM.core.refresh = function()
{
	var timeline = TM.db.tweet.all(false);
	var mentions = TM.db.tweet.all(true);
	
	try {
		if (CURRENT_TAB == 1) {
			TM.services.twitter.profile_info(TM.settings.current.username, TM.settings.current.password);
			TM.core.display.get_groups();
		}
	} catch(e) { }
	
	// Get the friends timeline
	if (timeline == null || timeline.length == 0) {
		TM.services.twitter.friends_timeline(TM.settings.current.username, TM.settings.current.password, 200);
	} else {
		TM.services.twitter.friends_timeline(TM.settings.current.username, TM.settings.current.password, 200, timeline[0].statusid);
	}
	
	// Get all the mentions but only display them if the tab is active
	if (mentions == null || mentions.length == 0) {
		TM.services.twitter.mentions(TM.settings.current.username, TM.settings.current.password, 200);
	} else {
		TM.services.twitter.mentions(TM.settings.current.username, TM.settings.current.password, 200, mentions[0].statusid);
	}
	
	TM.services.twitter.rate(TM.settings.current.username, TM.settings.current.password);
}

/**
 * TM.core.login
 * @param null
 * @returns void
 */
TM.core.login = function()
{
	// Basic validation logic
	var username = document.getElementById('usuario').value;
	var password = document.getElementById('passwd').value;
	
	if (username.length == 0) {
		$('#errorMsg').text(TM.locale[TM.settings.current.locale]['invalid-username']);
		$('#errorMsg').removeClass('dn');
	} else if (password.length == 0) {
		$('#errorMsg').text(TM.locale[TM.settings.current.locale]['invalid-password']);
		$('#errorMsg').removeClass('dn');
	} else {
		TM.services.twitter.login(username, password);
	}
}