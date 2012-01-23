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
 * @summary TM.CORE Display/Output
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

if (!TM.core.display) TM.core.display = {};

TM.core.display.friends_timeline = function()
{
	if (CURRENT_GROUP_SELECTION == 0) {
		// Bring all tweets
		var completeTimeline = TM.db.tweet.all(false);
		var pageData = TM.db.tweet.all(false, CURRENT_TWEET_PAGE);
	} else {
		// Get all contacts from this group inside an array
		var myGroup = TM.db.groups.contacts.get(CURRENT_GROUP_SELECTION);
		var arrContactID = new Array();
		
		if (myGroup != null && myGroup.length > 0) {
			for (i = 0; i < myGroup.length; i++) {
				arrContactID.push(myGroup[i].contactid);
			}
			
			var completeTimeline = TM.db.tweet.filter(arrContactID);
			var pageData = TM.db.tweet.filter(arrContactID, CURRENT_TWEET_PAGE);
		}
	}

	try {
		var checkForIntegrity = pageData.length;
	} catch(e) {
		$('.tweetlist').html('<span style="color: white; font-weight: bold" class="s12">' + TM.locale[TM.settings.current.locale]['timeline-empty'] + '</span>');
		return false;
	} 

	if (CURRENT_TAB == 2) {
		$('.tweetlist').html('');
		
		for (i = 0; i < pageData.length; i++) {
			try {
				htmlFinal = TM.core.display.tweetHTML(pageData[(pageData.length-1)-i].profile_image_url,
													  pageData[(pageData.length-1)-i].screen_name,
													  pageData[(pageData.length-1)-i].source,
													  pageData[(pageData.length-1)-i].tweet,
													  pageData[(pageData.length-1)-i].created_at,
													  pageData[(pageData.length-1)-i].statusid);

				$('.tweetlist').prepend(htmlFinal);
			} catch(e) { }
		}
	
		// Pagination
		if (CURRENT_TWEET_PAGE != 1 || (CURRENT_TWEET_PAGE * TM.settings.current.tweetCount) < parseInt(completeTimeline.length)) {
			htmlFinal = '<div>';
			htmlFinal += (CURRENT_TWEET_PAGE != 1) ? '<div class="button3 fll" id="btnTweets_prev" style="width: 80px">' + TM.locale[TM.settings.current.locale]['previous-page'] + '</div>' : '';
			htmlFinal += ((CURRENT_TWEET_PAGE * TM.settings.current.tweetCount) < parseInt(completeTimeline.length)) ? '<div class="button3 flr" id="btnTweets_next" style="width: 80px">' + TM.locale[TM.settings.current.locale]['next-page'] + '</div>' : '';
			htmlFinal += '<div class="clb"></div>';
			htmlFinal += '</div>';
			$('.tweetlist').append(htmlFinal);
		}
	}
}

TM.core.display.mentions = function()
{
	var completeTimeline = TM.db.tweet.all(true);
	var pageData = TM.db.tweet.all(true, CURRENT_MENTIONS_PAGE);

	try {
		var checkForIntegrity = pageData.length;
	} catch(e) {
		$('.mentions').html('<span style="color: white; font-weight: bold" class="s12">' + TM.locale[TM.settings.current.locale]['mentions-empty'] + '</span>');
		return false;
	} 

	if (CURRENT_TAB == 3) {
		$('.mentions').html('');
		
		for (i = 0; i < pageData.length; i++) {
			try {
				//alert(pageData[(pageData.length-1)-i].tweet);
				htmlFinal = TM.core.display.tweetHTML(pageData[(pageData.length-1)-i].profile_image_url,
													  pageData[(pageData.length-1)-i].screen_name,
													  pageData[(pageData.length-1)-i].source,
													  pageData[(pageData.length-1)-i].tweet,
													  pageData[(pageData.length-1)-i].created_at,
													  pageData[(pageData.length-1)-i].statusid);

				$('.mentions').prepend(htmlFinal);
			} catch(e) { }
		}
	
		// Pagination
		if (CURRENT_MENTIONS_PAGE != 1 || (CURRENT_MENTIONS_PAGE * TM.settings.current.mentionsCount) < parseInt(completeTimeline.length)) {
			htmlFinal = '<div>';
			htmlFinal += (CURRENT_MENTIONS_PAGE != 1) ? '<div class="button3 fll" id="btnMentions_prev" style="width: 80px">' + TM.locale[TM.settings.current.locale]['previous-page'] + '</div>' : '';
			htmlFinal += ((CURRENT_MENTIONS_PAGE * TM.settings.current.mentionsCount) < parseInt(completeTimeline.length)) ? '<div class="button3 flr" id="btnMentions_next" style="width: 80px">' + TM.locale[TM.settings.current.locale]['next-page'] + '</div>' : '';
			htmlFinal += '<div class="clb"></div>';
			htmlFinal += '</div>';
			$('.mentions').append(htmlFinal);
		}
	}
}

TM.core.display.tweetHTML = function(profile_image_url, screen_name, source, text, created_at, statusid) 
{
	var htmlCode = '';
	
	profile_image_url = TM.db.SQLUnEscape(profile_image_url);
	source = TM.db.SQLUnEscape(source);
	source = source.replace(/<\/?[^>]+(>|$)/g, "");
	
	text = TM.db.SQLUnEscape(text);
	
	// Primero parseo el 'tweet' en si. 
	text = text.split(" ");
	txtProcesado = '';
	
	for (j = 0; j < text.length; j++) {
		var rest = '';
		
		// Todo este quilombo de aca abajo es para arreglar cuando es @Fokker680! <- Ultimo caracter, caga el perfil
		if (text[j].substr(-1) == '.' || 
			text[j].substr(-1) == ':' || 
			text[j].substr(-1) == ',' || 
			text[j].substr(-1) == '?' ||
			text[j].substr(-1) == '!' ||
			text[j].substr(-1) == '"' ||
			text[j].substr(-1) == ';' ||
			text[j].substr(-1) == '/' ||
			text[j].substr(-1) == '\\' ||
			text[j].substr(-1) == '-' ||
			text[j].substr(-1) == '+' ||
			text[j].substr(-1) == '\'') {
			
			rest = text[j].substr(-1);
			text[j] = text[j].substr(0, text[j].length-1);
		}
		
		if (text[j].substr(0, 1) == '@') {
			texto = TM.string.divide(text[j], 39);
			text[j] = '<a href="#profile" target="_blank" class="tdu view_profile">' + texto + '</a>';
		} else if (TM.string.isUrl(text[j])) {
			texto = TM.string.divide(text[j], 39);
			text[j] = '<a href="' + text[j] + '" target="_blank" onclick="return false;" class="tdu url_link">' + texto + '</a>';
		} else {
			text[j] = TM.string.divide(text[j], 39);
		}
		
		text[j] += rest;
		
		txtProcesado += text[j];
		txtProcesado += (j != text.length-1) ? ' ' : '';
	}
	
	// Luego parseo la fecha	
	fecha = TM.date.parse(created_at);
	
	htmlCode = '<table style="margin-bottom: 10px; width: 100%"><tr><td style="width: 60px" class="pic" valign="top"><div><img src="' + profile_image_url + '" /></div></td>'
	htmlCode += '<td class="tweet p5" valign="top"><div style="position: relative">';
	htmlCode += '<input type="hidden" class="statusid" id="' + statusid + '" />';
	htmlCode += '<p class="s11 pt5 type" style="color: #666;"><span class="nick">@<span class="twitter_user s11" style="color: #305294">' + screen_name + '</span></span> ' + TM.locale[TM.settings.current.locale]['says'] + ':</p>';
	htmlCode += '<h2>' + txtProcesado + '</h2>';
	htmlCode += '<p class="s11 pt5 src">' + TM.locale[TM.settings.current.locale]['posted-on'] + ' ' + fecha + ' ' + TM.locale[TM.settings.current.locale]['with'] + ' ' +  source + '</p>';
	htmlCode += '<p class="s11 pt5 b tools dn">';
	htmlCode += '<a href="#rtwt" class="s11 retweet-button button" style="color: black">' + TM.locale[TM.settings.current.locale]['retweet'] + '</a>';
	htmlCode += '&nbsp;&nbsp;&nbsp;';
	htmlCode += '<a href="#reply" class="s11 reply-button button" style="color: black">' + TM.locale[TM.settings.current.locale]['reply'] + '</a>';
	htmlCode += (screen_name.toLowerCase() == TM.settings.current.username.toLowerCase()) ? '&nbsp;&nbsp;&nbsp;<a href="#delete" class="s11 button delete-status-button" style="color: #CC0000">' + TM.locale[TM.settings.current.locale]['delete'] + '</a>' : '';
	
	htmlCode += '</p>';
	htmlCode += '</div></td></tr></table>';
	
	return htmlCode;
}

TM.core.display.get_groups = function()
{
	var groups = TM.db.groups.all();
	try {
		$('.num_groups').html(groups.length);
	} catch(e) { 
		$('.num_groups').html('0');
	}
	
	if ($('#showGroups').hasClass('active')) {
		$('.contact').html('');
	
		if (groups != null && groups.length > 0) {		
			for (i = 0; i < groups.length; i++) {
				var contacts = TM.db.groups.contacts.get(groups[i].idx);
				name = TM.db.SQLUnEscape(groups[i].name);
			
				htmlFinal = '<div id="groupId_' + groups[i].idx + '" style="width: 100%"><table style="width: 100%"><tr>'
				htmlFinal += '<td class="group p3" valign="middle">';
				htmlFinal += '<h1><strong>' + name + '</strong> (' + contacts.length + ' ' + TM.locale[TM.settings.current.locale].contacts + ')</h1>';
				htmlFinal += '</td>';
				htmlFinal += '<td class="group" valign="middle" style="width: 50px; text-align: center"><a href="#delete" class="s11 delete-group-button button" style="color: #CC0000"><strong>Delete</strong></a></td>';
				htmlFinal += '</tr></table></div>';
			
				$('.contact').append(htmlFinal);

			}
		} else {
			$('.contact').html('<span class="s11" style="color: black">' + TM.locale[TM.settings.current.locale]['groups-empty'] + '</span>');
			return false;
		}
	}
}

TM.core.display.get_friends = function()
{
	var pageData = TM.db.contacts.all(true, CURRENT_FRIENDS_PAGE);
	
	if ($('#showFriends').hasClass('active')) {
		try {
			var checkForIntegrity = pageData.length;
		} catch(e) {
			$('.contact').html('<span style="color: black" class="s11">' + TM.locale[TM.settings.current.locale]['friends-empty'] + '</span>');
			return false;
		} 
	
		if (CURRENT_TAB == 1) {
			$('.contact').html('');	
		
			for (i = 0; i < pageData.length; i++) {
				try {
					var name = TM.db.SQLUnEscape(pageData[i].real_name);
					var lasttweet = TM.db.SQLUnEscape(pageData[i].lasttweet);
					var profile_image_url = TM.db.SQLUnEscape(pageData[i].profile_image_url);
					var screen_name = pageData[i].screen_name;

					htmlFinal = '<table><tr><td style="width: 25px" valign="top" class="p3"><img src="' + profile_image_url + '" style="width: 20px; height: 20px" /></td>'
					htmlFinal += '<td class="friend" id="friendId_' + screen_name + '" valign="middle">';
					htmlFinal += '<div class="friend_default_view">';
					htmlFinal += '<h1>' + name + ' (@' + screen_name + ')' +'</h1>';
					htmlFinal += '</div>';
					htmlFinal += '<div class="friend_extended_view pr dn">';
					htmlFinal += '<div style="background-color: #F2F2F2; -webkit-border-radius: 5px; border: 1px solid #CCC" class="p5">';
					htmlFinal += '<h1>' + name + ' (@' + screen_name + ')' +'</h1>';

					if (lasttweet != null) {
						htmlFinal += '<h2><strong>' + TM.locale[TM.settings.current.locale]['what-he-doing'] +  '</strong> ' + lasttweet +'</h2>';
					}

					htmlFinal += '<br />';

					htmlFinal += '<p class="s11 pt5 b tools">';
					htmlFinal += '<a href="#viewprofile" class="s11 view-contact-button button" style="color: black"><img src="app:/img/icnViewInfo.png" /></a>';
					htmlFinal += '&nbsp;&nbsp;&nbsp;';
					htmlFinal += '<a href="#delete" class="s11 delete-contact-button button" style="color: black"><img src="app:/img/icnDelete.png" /></a>';
					htmlFinal += '&nbsp;&nbsp;&nbsp;';
					htmlFinal += '<a href="#block" class="s11 block-contact-button button" style="color: black"><img src="app:/img/icnBlock.png" /></a>';
					htmlFinal += '</p>';

					htmlFinal += '</div>';
					htmlFinal += '</div>';
					htmlFinal += '</td><td style="width: 5px" class="tac" valign="middle"></td></tr></table>';

					$('.contact').append(htmlFinal);
				} catch(e) { }
			}
		
			// Pagination
			if (CURRENT_FRIENDS_PAGE != 1 || (CURRENT_FRIENDS_PAGE * 30) < parseInt($('.num_friends').html())) {
				htmlFinal = '<div class="pt10">';
				htmlFinal += (CURRENT_FRIENDS_PAGE != 1) ? '<div class="button3 fll" id="btnFriends_prev" style="width: 80px">' + TM.locale[TM.settings.current.locale]['previous-page'] + '</div>' : '';
				htmlFinal += ((CURRENT_FRIENDS_PAGE * 30) < parseInt($('.num_friends').html())) ? '<div class="button3 flr" id="btnFriends_next" style="width: 80px">' + TM.locale[TM.settings.current.locale]['next-page'] + '</div>' : '';
				htmlFinal += '<div class="clb"></div>';
				htmlFinal += '</div>';
				$('.contact').append(htmlFinal);
			}
		}
	}
}

TM.core.display.get_followers = function()
{	
	var pageData = TM.db.contacts.all(false, CURRENT_FOLLOWERS_PAGE);

	if ($('#showFollowers').hasClass('active')) {
		try {
			var checkForIntegrity = pageData.length;
		} catch(e) {
			$('.contact').html('<span style="color: black" class="s11">' + TM.locale[TM.settings.current.locale]['followers-empty'] + '</span>');
			return false;
		}

		if (CURRENT_TAB == 1) {
			$('.contact').html('');	
		
			for (i = 0; i < pageData.length; i++) {
				try {
					var name = TM.db.SQLUnEscape(pageData[i].real_name);
					var lasttweet = TM.db.SQLUnEscape(pageData[i].lasttweet);
					var screen_name = pageData[i].screen_name;
					var profile_image_url = TM.db.SQLUnEscape(pageData[i].profile_image_url);
			
					htmlFinal = '<table><tr><td style="width: 25px" valign="top" class="p3"><img src="' + profile_image_url + '" style="width: 20px; height: 20px" /></td>'
					htmlFinal += '<td class="friend" id="friendId_' + screen_name + '" valign="middle">';
					htmlFinal += '<div class="friend_default_view">';
					htmlFinal += '<h1>' + name + ' (@' + screen_name + ')' +'</h1>';
					htmlFinal += '</div>';
					htmlFinal += '<div class="friend_extended_view pr dn">';
					htmlFinal += '<div style="background-color: #F2F2F2; -webkit-border-radius: 5px; border: 1px solid #CCC" class="p5">';
					htmlFinal += '<h1>' + name + ' (@' + screen_name + ')' +'</h1>';

					if (lasttweet != null) {
						htmlFinal += '<h2><strong>' + TM.locale[TM.settings.current.locale]['what-he-doing'] +  '</strong> ' + lasttweet +'</h2>';
					}

					htmlFinal += '<br />';

					htmlFinal += '<p class="s11 pt5 b tools">';
					htmlFinal += '<a href="#viewprofile" class="s11 view-contact-button button" style="color: black"><img src="app:/img/icnViewInfo.png" /></a>';
					htmlFinal += '&nbsp;&nbsp;&nbsp;';
					htmlFinal += '<a href="#add" class="s11 add-contact-button button" style="color: black"><img src="app:/img/icnAddFriend.png" /></a>';
					htmlFinal += '&nbsp;&nbsp;&nbsp;';
					htmlFinal += '<a href="#block" class="s11 block-contact-button button" style="color: black"><img src="app:/img/icnBlock.png" /></a>';
					htmlFinal += '</p>';

					htmlFinal += '</div>';
					htmlFinal += '</div>';
					htmlFinal += '</td><td style="width: 5px" class="tac" valign="middle"></td></tr></table>';

					$('.contact').append(htmlFinal);
				} catch(e) { }
			}
		
			// Pagination
		
			if (CURRENT_FOLLOWERS_PAGE != 1 || (CURRENT_FOLLOWERS_PAGE * 30) < parseInt($('.num_followers').html())) {
				htmlFinal = '<div class="pt10">';
				htmlFinal += (CURRENT_FOLLOWERS_PAGE != 1) ? '<div class="button3 fll" id="btnFollowers_prev" style="width: 80px">' + TM.locale[TM.settings.current.locale]['previous-page'] + '</div>' : '';
				htmlFinal += ((CURRENT_FOLLOWERS_PAGE * 30) < parseInt($('.num_followers').html())) ? '<div class="button3 flr" id="btnFollowers_next" style="width: 80px">' + TM.locale[TM.settings.current.locale]['next-page'] + '</div>' : '';
				htmlFinal += '<div class="clb"></div>';
				htmlFinal += '</div>';
				$('.contact').append(htmlFinal);
			}
		}
	}
}

TM.core.display.initIM = function(screen_name)
{
	$('#nickname').html(screen_name);
	$('#charsleft').text(TM.parser.count_chars(document.getElementById('twtText'), TM.string.gup('screen_name')));
	
	var conversation = TM.db.tweet.getIM(screen_name);
	
	try {
		var checkForIntegrity = conversation.length;
	} catch(e) {
		conversation = new Array();
	}
	
	if (conversation.length != null && conversation.length > 0) {
		for (i = 0; i < conversation.length; i++) {
			htmlFinal = '';
			try {
				htmlFinal = TM.core.display.tweetHTML(conversation[(conversation.length-1)-i].profile_image_url,
													  conversation[(conversation.length-1)-i].screen_name,
													  conversation[(conversation.length-1)-i].source,
													  conversation[(conversation.length-1)-i].tweet,
													  conversation[(conversation.length-1)-i].created_at,
													  conversation[(conversation.length-1)-i].statusid);
			} catch(e) { }
			
			$('#im_body').append(htmlFinal);
		}
	}
}