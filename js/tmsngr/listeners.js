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
 * @summary Input listeners
 * @author Andres Pagella (andres.pagella@gmail.com)
 * @dependency TM.locale, TM.settings
 */

var TM;
if (!TM) TM = {};

if (!TM.listener) TM.listener = {};
if (!TM.listener.drag) TM.listener.drag = {};

/**
 * TM.listener.dragndrop
 * @summary starts listening for drags and drops
 * @param null
 * @returns void
 */
TM.listener.dragndrop = function()
{
	// Only activate the drag and drop functionality if the textbox element is present.
	if (document.getElementById('twtText')) {
		var dragTarget = document.getElementById('twtText'); 
	    dragTarget.addEventListener("dragenter", TM.listener.drag.enter); 
	    dragTarget.addEventListener("dragover", TM.listener.drag.over); 
	    dragTarget.addEventListener("drop", TM.listener.drag.drop);
	}
}

/**
 * TM.listener.keyboard
 * @summary starts listening for keyboard inputs
 * @param null
 * @returns void
 */
TM.listener.keyboard = function()
{	
	$('body').intercept('keydown', 
	{
		'#twtText': function(e) {
			if (e.which == 13) {
				return false;
			}
		}
	});
	
	$('body').intercept('keyup', 
	{
		'#twtText': function(e) {
			if (e.which == 32 || e.which == 13) {
				// Parse the text if the guy pressed space (0x032) or enter (0x013)
				TM.parser.parse(document.getElementById('twtText'));
			}
			
			try {
				if (IS_CONVERSATION_WINDOW) {
					var charsLeft = TM.parser.count_chars(document.getElementById('twtText'), '@' + TM.string.gup('screen_name') + ' ');
				}
			} catch(e) {
				var charsLeft = TM.parser.count_chars(document.getElementById('twtText'));
			}
			
			$('#charsleft').text(charsLeft);
			
			if (parseInt(charsLeft) < 0) {
				$('#twtText').addClass('multi');
			} else {
				$('#twtText').removeClass('multi');
			}
			
			// SEND TWEET
			if (e.which == 13) {
				var tweetText = '';
				
				try {
					if (IS_CONVERSATION_WINDOW) {
						tweetText += '@' + TM.string.gup('screen_name') + ' ';
											
						// Scroll to the bottom
						$(".bodyContent").attr({ scrollTop: $(".bodyContent").attr("scrollHeight") });
					}
				} catch(e) { }
				
				tweetText += $('#twtText').val();
				
				if (tweetText.length > 0) {
					if (tweetText.length > 140) { // Multitweet

						var originalTweet = tweetText;
						tweetText = new Array();
						
						while (originalTweet.length > 140) {
							tweetText.push(originalTweet.substr(0, 140));
							originalTweet = originalTweet.substr(140);
							
							// Add the @USER automatically if it's an IM window.
							try {
								originalTweet = (IS_CONVERSATION_WINDOW) ? ('@' + TM.string.gup('screen_name') + ' ' + originalTweet) : originalTweet;
							} catch(e) { }
						}
						
						// Add the @USER automatically if it's an IM window.
						try {
							originalTweet = (IS_CONVERSATION_WINDOW) ? ('@' + TM.string.gup('screen_name') + ' ' + originalTweet) : originalTweet;
						} catch(e) { }
						
						// Push the "rest"
						tweetText.push(originalTweet.substr(0, 140));
						
						for (i = 0; i < tweetText.length; i++) {
							TM.services.twitter.send(tweetText[i], TM.settings.current['username'], TM.settings.current['password']);
						}
					} else { // Single tweet
						TM.services.twitter.send(tweetText, TM.settings.current['username'], TM.settings.current['password']);
					}
				}
				
				$(this).attr("disabled", true);
				$('#twtText').css("background-color", "#CCC");
			}
		}
	});
}

/**
 * TM.listener.mouse
 * @summary starts listening for mouse inputs
 * @param null
 * @returns void
 */
TM.listener.mouse = function()
{	
	// MOUSEOVER
	$('.tweet').livequery('mouseover', function() {
		$(this).find('.tools').removeClass('dn');
	});

	// MOUSEOUT
	$('.tweet').livequery('mouseout', function() {
		$(this).find('.tools').addClass('dn');
	});
	
	
	// MOUSEDOWN
	$('body').intercept('mousedown', 
	{
		'.enable-move-window': function() { window.nativeWindow.startMove(); },
		
		'.bodyContent2': function() { return false; },
		
		'.tweet': function() { return true; },
		
		//'#btnResizeapp': function() { window.nativeWindow.startResize(); return false; },
		
		'.friend': function() { return false; }
	});
	
	$('#btnResizeapp').livequery('mousedown', function() {
		window.nativeWindow.startResize(); 
		return false;
	});
	
	// CLICK
	$('body').intercept('click', 
	{
		
		// Open the Settings panel
		'#btnSettings': function() { 
			TM.core.open.settings();
		},
		
		
		// Refresh the content
		'#btnRefresh': function() {
			TM.core.refresh();
		},
		
		
		// 'Minimize' button
		'#btnMinimizeApp': function() { 
			// Does the OS support minimizing the app to the tray bar?
			if(air.NativeApplication.supportsSystemTrayIcon) {
				try {
					air.NativeApplication.nativeApplication.icon.tooltip = "T-Messenger";

		            var systray = new air.Loader();
		            systray.load(new air.URLRequest("app:/icons/tmsngr-16.png"));
		            air.NativeApplication.nativeApplication.icon.addEventListener('click', window.nativeWindow.restore());
				} catch(e) {
					// Crap, it failed miserably. Just minimize it.
					window.nativeWindow.minimize();
				}
			} else {
				window.nativeWindow.minimize();
			}
		},
		
		// 'Close' button
		'#btnCloseApp': function() {
			// Is it an IM window?
			try {
				if (IS_CONVERSATION_WINDOW) {
					window.nativeWindow.close(); // Just close the window
				}
			} catch(e) {
				// Variable not defined, it's not an IM window
				air.NativeApplication.nativeApplication.exit(); // Quit the app
			}
		},
		
		
		// Change tabs
		'.tabBtn p': function()	{
			$('.tabBtn').removeClass('active');
			$('.contact').html(''); // Clean all DOM markup present inside the contact list tab.
			$('.tweetlist').html(''); // Clean all DOM markup present inside the tweets tab.
			$('.mentions').html(''); // Clean all DOM markup present inside the mentions tab.
			
			$('#tab1').addClass('dn');
			$('#tab2').addClass('dn');
			$('#tab3').addClass('dn');
			
			$('.optionset').addClass('dn');
			
			$(this).parent().addClass('active');
			
			CURRENT_TAB = $(this).parent().attr('id').substr(6);
			
			switch($(this).parent().attr('id').substr(6)) {
				case '1': // CONTACT LIST
					
					$('.textingArea').hide();
					$('#twtText').html('');
					$('.bodyContent2').css('top', '98px');
					$('#shadow').css('top', '98px');
					
					$('#opt1').removeClass('dn');
					$('#tab1').removeClass('dn');
					$('#showFriends').addClass('active');
					$('#showFollowers').removeClass('active');
					$('#showGroups').removeClass('active');

					TM.core.display.get_friends();
					break;
				case '2': // TWEETS
					$('#opt2').removeClass('dn');
					$('#tab2').removeClass('dn');

					$('#group_filter').removeOption(/./);
					
					$('#group_filter').addOption(0, TM.locale[TM.settings.current.locale]['selectbox-groups-all']);
					
					// Get all the available groups
					var myGroups = TM.db.groups.all();
					
					if (myGroups != null && myGroups.length > 0) {
						for (i = 0; i < myGroups.length; i++) {
							myOptions = {};
							
							// Add the groups to the box
							myOptions[myGroups[i].idx] = TM.locale[TM.settings.current.locale]['selectbox-groups-only'] + ' "' + myGroups[i].name + '"';
							
							if (CURRENT_GROUP_SELECTION == myGroups[i].idx) {
								$('#group_filter').addOption(myOptions, true);
							} else {
								$('#group_filter').addOption(myOptions, false);
							}
							
							myOptions = '';
						}
					}

					TM.core.display.friends_timeline();
					break;
				case '3': // MENTIONS
					$('#opt2').removeClass('dn');
					$('#tab3').removeClass('dn');
					
					TM.core.display.mentions();
					break;
			}
		},
		
		
		// Create a new tweet
		'.toolbar_options .newtweet div': function() {
			if ($('.textingArea').is(":hidden")) {
				$('.textingArea').show();
				$('#twtText').html('');
				$('#charsleft').text('140');
				$('.bodyContent2').css('top', '230px');
				$('#shadow').css('top', '230px');
				$('#twtText').focus();
			} else {
				$('.textingArea').hide();
				$('#twtText').html('');
				$('.bodyContent2').css('top', '98px');
				$('#shadow').css('top', '98px');
			}
		},
		
		
		// Close 'tweet bar' button
		'.textingArea .close': function() {
			$('.textingArea').hide();
			$('.bodyContent2').css('top', '98px');
			$('#shadow').css('top', '98px');
			$('#morethan140').addClass('dn');
			$('#twtText').val('');

			//calcularLargoTexto();
		},
		
		
		// Send Tweet
		'.sendtweet': function() {
			TM.services.twitter.send($('#twtText').val(), TM.settings.current['username'], TM.settings.current['password']);
			
			$('#twtText').attr("disabled", true);
			$('#twtText').css("background-color", "#CCC");
		},
		
		
		// View friend/follower information on the contact list
		'.friend h1': function() {
			$('.friend_default_view').removeClass('dn');
			$('.friend_extended_view').addClass('dn');

			$(this).parent().parent().find('.friend_default_view').addClass('dn');
			$(this).parent().parent().find('.friend_extended_view').removeClass('dn');
		},
				
		
		// RE Tweet
		'.retweet-button': function() {
			if ($('.textingArea').is(":hidden")) {
				$('.textingArea').show();
				$('#twtText').html('');
				$('#charsleft').text('140');
				$('.bodyContent2').css('top', '230px');
				$('#shadow').css('top', '230px');
				$('#twtText').focus();
			}
			contenido = 'RT @' + $(this).parent().parent().find('.twitter_user').text() + ': ';
			contenido += $(this).parent().parent().find('h2').text();

			$('#twtText').html(contenido);

			try {
				if (IS_CONVERSATION_WINDOW) {
					var charsLeft = TM.parser.count_chars(document.getElementById('twtText'), document.getElementById('twitterUser').value);
				}
			} catch(e) {
				var charsLeft = TM.parser.count_chars(document.getElementById('twtText'));
			}
			
			$('#charsleft').text(charsLeft);
			
			if (parseInt(charsLeft) < 0) {
				$('#twtText').addClass('multi');
			} else {
				$('#twtText').removeClass('multi');
			}
		},
		
		
		// Reply
		'.reply-button': function() {
			if ($('.textingArea').is(":hidden")) {
				$('.textingArea').show();
				$('#twtText').html('');
				$('#charsleft').text('140');
				$('.bodyContent2').css('top', '230px');
				$('#shadow').css('top', '230px');
				$('#twtText').focus();		
			}

			contenido = '@' + $(this).parent().parent().find('.twitter_user').text() + ' ';

			$('#twtText').html(contenido);

			try {
				if (IS_CONVERSATION_WINDOW) {
					var charsLeft = TM.parser.count_chars(document.getElementById('twtText'), document.getElementById('twitterUser').value);
				}
			} catch(e) {
				var charsLeft = TM.parser.count_chars(document.getElementById('twtText'));
			}
			
			$('#charsleft').text(charsLeft);
			
			if (parseInt(charsLeft) < 0) {
				$('#twtText').addClass('multi');
			} else {
				$('#twtText').removeClass('multi');
			}
		},
		
		
		
		// Clean the Tweet/Mention list
		'.clean-tweetlist-button': function() {
			// Not implemented
		},
		
		
		// Create new group
		'.new-group-button': function() {
			TM.core.open.new_group();
		},
		
		// Add contact
		'.add-contact-button img': function() {
			if (confirm(TM.locale[TM.settings.current.locale]['add-contact'])) {
				try {
					var contactID = $(this).parent().parent().parent().parent().parent().attr('id').substr(9);
					TM.services.twitter.create_friendship(contactID, TM.settings.current.username, TM.settings.current.password);
				} catch(e) {}
			}
		},
		
		
		// Delete contact
		'.delete-contact-button img': function() {
			if (confirm(TM.locale[TM.settings.current.locale]['delete-contact'])) {
				try {
					var contactID = $(this).parent().parent().parent().parent().parent().attr('id').substr(9);
					TM.services.twitter.destroy_friendship(contactID, TM.settings.current.username, TM.settings.current.password);
					TM.db.contacts.del(contactID);
					
					$(this).parent().parent().parent().parent().parent().parent().fadeOut('medium');
				} catch(e) {}
			}

			if ($('#showFriends').hasClass('active')) {
				TM.core.display.get_friends();
			}
		},
		
		
		// Block contact
		'.block-contact-button img': function() {
			if (confirm(TM.locale[TM.settings.current.locale]['block-contact'])) {
				try {
					var contactID = $(this).parent().parent().parent().parent().parent().attr('id').substr(9);
					TM.services.twitter.block_contact(contactID, TM.settings.current.username, TM.settings.current.password);
					TM.db.contacts.del(contactID);
					
					$(this).parent().parent().parent().parent().parent().parent().fadeOut('medium');				
				} catch(e) {}
			}

			if ($('#showFriends').hasClass('active')) {
				TM.core.display.get_friends();
			} else if ($('#showFollowers').hasClass('active')) {
				TM.core.display.get_followers();
			}
		},
		
		
		// Delete group
		'.delete-group-button strong': function() {
			if (confirm(TM.locale[TM.settings.current.locale]['delete-group'])) {
				var groupID = $(this).parent().parent().parent().parent().parent().parent().attr('id').substr(8);
				TM.db.groups.contacts.del(groupID);
				TM.db.groups.del(groupID);
				$(this).parent().parent().parent().parent().parent().parent().fadeOut('medium');
				TM.core.display.get_groups();
			}
		},
		
		
		// Delete status
		'.delete-status-button': function() {
			if (confirm(TM.locale[TM.settings.current.locale]['delete-status'])) {
				var statusID = $(this).parent().parent().find('.statusid').attr('id');
				
				TM.services.twitter.delete_status(statusID, TM.settings.current.username, TM.settings.current.password);
				$(this).parent().parent().parent().parent().parent().parent().fadeOut('medium');
			}
		},
		
		
		// View the contact's profile (from the Contact List)
		'.view-contact-button img': function() {
			TM.core.open.profile(escape($(this).parent().parent().parent().parent().parent().attr('id').substr(9)));
		},
		
		
		// View the contact's profile (from the Tweet or mention list) BLUE LINK
		'.twitter_user': function() {
			TM.core.open.profile(escape($(this).text()));
		},
		
		
		// View the contact's profile (from the Tweet or mention list) GRAY LINK
		'.view_profile': function() {
			TM.core.open.profile(escape($(this).text().substr(1)));
			return false;
		},
		
		// Link that should be opened in a browser
		'.url_link': function() {
			air.navigateToURL( new air.URLRequest($(this).attr('href'))); 
			return false;
		},
		
		'#showFriends span': function() {
			$('#showFriends').addClass('active');
			$('#showFollowers').removeClass('active');
			$('#showGroups').removeClass('active');
			TM.core.display.get_friends();			
		},
		
		'#showFollowers span': function() {
			$('#showFollowers').addClass('active');
			$('#showFriends').removeClass('active');
			$('#showGroups').removeClass('active');
			TM.core.display.get_followers();			
		},
		
		'#showGroups span': function() {
			$('#showGroups').addClass('active');
			$('#showFollowers').removeClass('active');
			$('#showFriends').removeClass('active');
			TM.core.display.get_groups();
		},
		
		/**
		 * Pagination routines
		 */
		
		'#btnFriends_prev': function() {
			if (CURRENT_FRIENDS_PAGE > 1) {
				CURRENT_FRIENDS_PAGE--;
				TM.core.display.get_friends();
			}
		},
		
		'#btnFriends_next': function() {
			if ((CURRENT_FRIENDS_PAGE * 30) < parseInt($('.num_friends').html())) {
				CURRENT_FRIENDS_PAGE++;
				TM.core.display.get_friends();
			}
		},
		
		'#btnFollowers_prev': function() {
			if (CURRENT_FOLLOWERS_PAGE > 1) {
				CURRENT_FOLLOWERS_PAGE--;
				TM.core.display.get_followers();
			}
		},
		
		'#btnFollowers_next': function() {
			if ((CURRENT_FOLLOWERS_PAGE * TM.settings.current.tweetCount) < parseInt($('.num_followers').html())) {
				CURRENT_FOLLOWERS_PAGE++;
				TM.core.display.get_followers();
			}
		},
		
		'#btnTweets_prev': function() {
			if (CURRENT_TWEET_PAGE > 1) {
				CURRENT_TWEET_PAGE--;
				TM.core.display.friends_timeline();
			}
		},
		
		'#btnTweets_next': function() {
			CURRENT_TWEET_PAGE++;
			TM.core.display.friends_timeline();
		},
		
		'#btnMentions_prev': function() {
			if (CURRENT_MENTIONS_PAGE > 1) {
				CURRENT_MENTIONS_PAGE--;
				TM.core.display.mentions();
			}
		},
		
		'#btnMentions_next': function() {
			CURRENT_MENTIONS_PAGE++;
			TM.core.display.mentions();
		}
	});
	
	// DOUBLE CLICK
	$('.friend').livequery('dblclick', function() {
		// Open IM conversation with friend/follower
		var friendID = $(this).attr('id').substr(9);

		TM.core.open.IM(friendID);
		
		return false;
	});
}

$('#group_filter').livequery('change', function() {
	CURRENT_GROUP_SELECTION = $(this).val();
	
	TM.core.display.friends_timeline();
});

/**
 * Drag and Drop event listeners. Used for drag n' drop image uploads to TwitPic.  
 */
TM.listener.drag.enter = function(event) { event.dataTransfer.effectAllowed = "copy"; }
TM.listener.drag.over = function(event) { event.preventDefault(); }
TM.listener.drag.drop = function(event) { TM.core.callback.fileUpload(event); }