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
 * @summary TM.CORE Callback handlers
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

if (!TM.core.callback) TM.core.callback = {};

TM.core.callback.login = function(username, password, data)
{
	var conf = TM.settings.defaultConfig;			
	TM.settings.save(username, password, conf);
	
	window.location = 'app:/html/' + TM.settings.current.locale + '/main.html';
}

TM.core.callback.friends_timeline = function(data, since)
{
	var newUpdates = 0;
	try {
		data = eval('(' + data + ')');
	} catch(e) { }

	for (i = 0; i < data.length; i++) {
		in_reply_to_screen_name = (data[i].in_reply_to_screen_name == undefined || data[i].in_reply_to_screen_name.length == '') ? '' : data[i].in_reply_to_screen_name;
		
		if (data[i].id > since) {
			newUpdates++;
			TM.db.tweet.set(data[i].id, 
							data[i].user.id, 
							data[i].user.screen_name,
							data[i].user.profile_image_url,
							data[i].source, 
							data[i].text,
							data[i].created_at,
							in_reply_to_screen_name,
							data[i].favorited,
							false);
		}
	}
	
	if (newUpdates > 0) {
		TM.core.sound.receive();
	}
	
	try {
		if (CURRENT_TAB == 2) {
			TM.core.display.friends_timeline();
		}
	} catch(e) { }
}

TM.core.callback.mentions = function(data, since)
{
	var newUpdates = 0;
	
	try {
		data = eval('(' + data + ')');
	} catch(e) { }

	for (i = 0; i < data.length; i++) {
		in_reply_to_screen_name = (data[i].in_reply_to_screen_name == undefined || data[i].in_reply_to_screen_name.length == '') ? '' : data[i].in_reply_to_screen_name;
		
		if (data[i].id > since) {
			newUpdates++;
			
			if (!FIRST_OPEN) {
				if (since != 0 && TM.settings.current.openRepliesNewWindow && (data[i].user.screen_name != TM.settings.current.username)) {
					TM.core.open.IM(data[i].user.screen_name);
				}
			}
			
			TM.db.tweet.set(data[i].id, 
							data[i].user.id, 
							data[i].user.screen_name,
							data[i].user.profile_image_url,
							data[i].source, 
							data[i].text,
							data[i].created_at,
							in_reply_to_screen_name,
							data[i].favorited,
							true);
		}
	}
	
	FIRST_OPEN = false;
	
	if (newUpdates > 0) {
		TM.core.sound.reply();
	}
	
	try {
		if (CURRENT_TAB == 3) {
			TM.core.display.mentions();
		}
	} catch(e) { }
}

TM.core.callback.profile_info = function(data)
{
	try {
		data = eval('(' + data + ')');
	} catch(e) { }

	try {
		$('.num_friends').html(data.friends_count);
		$('.num_followers').html(data.followers_count);
		TM.core.display.get_groups();
		
		TM.services.twitter.get_followers(TM.settings.current.username, TM.settings.current.password, data.followers_count);
		TM.services.twitter.get_friends(TM.settings.current.username, TM.settings.current.password, data.friends_count);
	} catch(e) { }
}

// Used in html/LANG/profile.html
TM.core.callback.contact_profile_info = function(data)
{
	try {
		data = eval('(' + data + ')'); 
	} catch(e) { }

	// Left column
	protectedProfile = (data['protected'] == 'true') ? TM.locale[TM.settings.current.locale].yes : TM.locale[TM.settings.current.locale].no;
	
	$('#userImage').attr('src', data.profile_image_url);
	$('#followers').text(data.followers_count);
	$('#friends').text(data.friends_count);
	$('#updates').text(data.statuses_count);
	$('#favorites').text(data.favourites_count);
	$('#protected').text(protectedProfile);
	
	// Right column
	$('#nickname').text(data.screen_name);
	$('#display_name').text(data.name);
	$('#description').text(data.description);
	$('#location').text(data.location);
	$('#time_zone').text(data.time_zone);
	$('#last_tweet_text').text(data.status.text);
	$('#last_tweet_date').text(TM.date.parse(data.status.created_at));
	$('#last_tweet_source').text(data['status']['source'].replace(/<\/?[^>]+(>|$)/g, ""));
	
	$('#profile_body div:first').removeClass('dn');
}

TM.core.callback.get_friends = function(data)
{
	try {
		data = eval('(' + data + ')');
	} catch(e) { }
	
	for (i = 0; i < data.length; i++) {
		if (TM.db.contacts.get(data[i].id) == null) {
			// Add new contact
			try {
				TM.db.contacts.set(data[i].id, 
								   data[i].screen_name, 
								   true,
								   data[i].status.text, 
								   data[i].name,
								   data[i].profile_image_url);
			} catch(e) { }
		} else {
			// Update existing
			try {
				TM.db.contacts.change(data[i].id, 
								      true,
								      data[i].status.text, 
								      data[i].name,
									  data[i].profile_image_url);
			} catch(e) { }
		}
	}
	
	if ($('#showFriends').hasClass('active')) {
		TM.core.display.get_friends();
	}
}

TM.core.callback.get_followers = function(data)
{
	try {
		data = eval('(' + data + ')');
	} catch(e) { }
	
	for (i = 0; i < data.length; i++) {
		var lastTweet = '';
		var real_name = '';
		
		try { lastTweet = data[i].status.text; } catch(e) {}
		try { real_name = data[i].name; } catch(e) {}
		
		var real_name = data[i].name;
		
		if (TM.db.contacts.get(data[i].id) == null) {
			// Add new contact
			TM.db.contacts.set(data[i].id, 
							   data[i].screen_name, 
							   false,
							   lastTweet, 
							   real_name,
							   data[i].profile_image_url);
		} else {
			// Update existing
			TM.db.contacts.change(data[i].id, 
							      false,
							      lastTweet, 
							      real_name,
								  data[i].profile_image_url);
		}
	}
	
	if ($('#showFollowers').hasClass('active')) {
		TM.core.display.get_followers();
	}
}

TM.core.callback.rate = function(data)
{
	try {
		data = eval('(' + data + ')');
	} catch(e) { }
	
	if (data.remaining_hits > 0) {
		$('#rate_ok').removeClass('dn');
		$('#rate_error').addClass('dn');
		$('#api_calls_left').text(data.remaining_hits);
		$('#api_calls_limit').text(data.hourly_limit);
	} else {
		$('#rate_ok').addClass('dn');
		$('#rate_error').removeClass('dn');
	}
}

TM.core.callback.bitly = function(objectID, targetURL, data)
{
	var shortenedURL = targetURL;

	try {
		shortenedURL =  data.results[targetURL].shortUrl;
	} catch(e) {
		try {
			shortenedURL =  data.results[encodeURIComponent(targetURL)].shortUrl;
		} catch(e) { }
	}
	
	objectID.value = objectID.value.replace(targetURL, shortenedURL);
}

TM.core.callback.delete_status = function(statusID)
{
	TM.db.tweet.del(statusID);
}

// Taken as-is from Spaz (http://code.google.com/p/spaz/)
TM.core.callback.fileUpload = function(event)
{
	var droppedFile = event.dataTransfer.getData("text/uri-list");
	
	// The user dropped a file here! Check if it is an image
	if (droppedFile.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
		alert(TM.locale[TM.settings.current.locale]['error-dropping-image']);
		
		return false;
	} else {
		// Upload the image
		
		// Disable the textbox.
		$('#twtText').attr("disabled", true); 
		$('#twtText').addClass('picLoading');
		$('#twtText').css("background-color", "#CCC");
		
		try {
			var request = new air.URLRequest('http://twitpic.com/api/upload');
			var loader = new air.URLLoader();

			var file = new air.File(event.dataTransfer.getData("text/uri-list")); //use file.browseForOpen() on ur wish
			var stream = new air.FileStream();
			var buf = new air.ByteArray();

			stream.open(file, air.FileMode.READ);
			stream.readBytes(buf);

			var contentType = GetContentType(file.extension.toUpperCase());

			objTM = {
				username: TM.settings.current.username,
				password: TM.settings.current.password,
				source: 'T-Messenger'
			}

			TM.services.PrepareMultipartRequest(request, buf, contentType, 'media', file.nativePath, objTM);

			loader.addEventListener(air.Event.COMPLETE, function(event) {
				var loader = event.target;
				var parser=new DOMParser();
	
				xmldoc = parser.parseFromString(loader.data,"text/xml");
				var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
	
				if (rspAttr.getNamedItem("stat").nodeValue == 'ok') {
			    	var mediaurl = $(xmldoc).find('mediaurl').text();
					var texto = document.getElementById('twtText');
					texto.value = texto.value + ' ' + mediaurl;
					$('#twtText').attr("disabled", false); 
					$('#twtText').removeClass('picLoading');
					$('#twtText').css("background-color", "#FFF");
				} else {
					var errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
					errMsg = errAttributes.getNamedItem("msg").nodeValue;
					
					alert(errMsg);
					
					$('#twtText').attr("disabled", false); 
					$('#twtText').removeClass('picLoading');
					$('#twtText').css("background-color", "#FFF");
				}
			});

			loader.load(request);
		} catch(e) { 
			alert(e);
			$('#twtText').attr("disabled", false); 
			$('#twtText').removeClass('picLoading');
			$('#twtText').css("background-color", "#FFF");
		}
	}
}

function GetContentType(fileType){
	switch (fileType) {
		case "JPG": return "image/jpeg";
		case "JPEG": return "image/jpeg";
		case "PNG": return "image/png";
		case "GIF": return "image/gif";
		default: return "image/jpeg";
	}
}