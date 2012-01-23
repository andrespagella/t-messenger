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
 * @summary Services and Requests
 * @dependecy TM.locale, TM.settings
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.services) TM.services = {};
if (!TM.services.twitter) TM.services.twitter = {};
if (!TM.services.twitpic) TM.services.twitpic = {};
if (!TM.services.bitly) TM.services.bitly = {};

TM.services.twitter.info = {
	'profile-info': 'http://twitter.com/users/show.json?screen_name=',
	'friends-list': 'http://twitter.com/statuses/friends.json?screen_name=',
	'followers-list': 'http://twitter.com/statuses/followers.json?screen_name=',
	'create-friendship': 'http://twitter.com/friendships/create/', // Needs .json
	'destroy-friendship': 'http://twitter.com/friendships/destroy/', // Needs .json
	'destroy-status': 'http://twitter.com/statuses/destroy/', // Needs .json
	'create-block': 'http://twitter.com/blocks/create/', // Needs .json
	'friends-timeline': 'http://twitter.com/statuses/friends_timeline.json',
	'mentions': 'http://twitter.com/statuses/mentions.json',
	'api-status': 'http://twitter.com/account/rate_limit_status.json',
	'send-tweet': 'http://twitter.com/statuses/update.json',
	'login': 'http://twitter.com/account/verify_credentials.json'
}

TM.services.twitpic.info = {
	'requestURL': 'http://twitpic.com/api/upload' 
}

TM.services.bitly.info = {
	'username': '<yourbitlyusernamegoeshere>',
	'apiKey': '<yourapikeygoeshere>',
	'requestURL': 'http://api.bit.ly/shorten?version=2.0.1'
}

/**
 * TM.services.twitter.login
 * @summary Login to the Twitter service
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns bool
 */
TM.services.twitter.login = function(username, password)
{
	req = $.ajax({
		success: function(data) { TM.core.callback.login(username, password, data); },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
	    },
		processData: false,
        type: "POST",
        url: TM.services.twitter.info['login']
	});
}

/**
 * TM.services.twitter.get_friends
 * @summary Get a list with the user's friends
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @param integer count Number of friends
 * @returns bool
 */
TM.services.twitter.get_friends = function(username, password, count)
{
	
	var pages = 0;
	
	while (count > 0) {
		pages++;
		count = count - 100;
	}
	
	for (i = 0; i < pages; i++) {
		req = $.ajax({
			success: function(data) { TM.core.callback.get_friends(data); },
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
	            req.setRequestHeader('Cookie', '');
		    },
			processData: false,
	        type: "GET",
	        url: TM.services.twitter.info['friends-list'] + username + '&page=' + (i+1)
		});
	}
}

/**
 * TM.services.twitter.get_followers
 * @summary Get a list with the user's followers
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @param integer count Number of followers
 * @returns bool
 */
TM.services.twitter.get_followers = function(username, password, count)
{
	var pages = 0;
	
	while (count > 0) {
		pages++;
		count = count - 100;
	}
	
	for (i = 0; i < pages; i++) {
		req = $.ajax({
			success: function(data) { TM.core.callback.get_followers(data); },
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
	            req.setRequestHeader('Cookie', '');
		    },
			processData: false,
	        type: "GET",
	        url: TM.services.twitter.info['followers-list'] + username + '&page=' + (i+1)
		});
	}
}

/**
 * TM.services.twitter.send
 * @summary Post an update
 * @param string text
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns bool
 */
TM.services.twitter.send = function(text, username, password)
{
	req = $.ajax({
		success: function(data) { 
			TM.core.refresh();
			
			try {
				if (IS_CONVERSATION_WINDOW) {
					TM.core.callback.send(data);
				}
				
				TM.core.sound.send();
			} catch(e) { }
			
			$('#twtText').val('');
		},
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
	    },
		processData: false,
        type: "POST",
		data: "&status=" + encodeURIComponent(text),
        url: TM.services.twitter.info['send-tweet']
	});
}

/**
 * TM.services.twitter.rate
 * @summary Get the current rate limit of the Twitter.com API
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns JSON object with the remaining hits
 */
TM.services.twitter.rate = function(username, password)
{
	req = $.ajax({
		success: function(data) { TM.core.callback.rate(data); },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
	    },
		processData: false,
        type: "GET",
        url: TM.services.twitter.info['api-status']
	});
}

/**
 * TM.services.twitter.friends_imeline
 * @summary Get the friends timeline
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @param integer limit (default 30)
 * @param integer (optional) since Since what Twitter status ID we should get the updates.
 * @returns JSON object with the timeline
 */
TM.services.twitter.friends_timeline = function(username, password, limit, since)
{
	limit = (limit == undefined) ? 30 : limit;
	var timelineURL = TM.services.twitter.info['friends-timeline'] + '?count=' + limit;
	since = (since == undefined) ? 0 : since;
	
	req = $.ajax({
		success: function(data) { TM.core.callback.friends_timeline(data, since); },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
	    },
		processData: false,
        type: "GET",
        url: timelineURL
	});
}

/**
 * TM.services.twitter.mentions
 * @summary Get the mentions timeline
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @param integer limit (default 30)
 * @param integer (optional) since Since what Twitter status ID we should get the updates.
 * @returns JSON object with the timeline
 */
TM.services.twitter.mentions = function(username, password, limit, since)
{
	limit = (limit == undefined) ? 30 : limit;
	var mentionsURL = TM.services.twitter.info['mentions'] + '?count=' + limit;
	since = (since == undefined) ? 0 : since;
	
	req = $.ajax({
		success: function(data) { TM.core.callback.mentions(data, since); },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
	    },
		processData: false,
        type: "GET",
        url: mentionsURL
	});
}

/**
 * TM.services.twitter.delete_status
 * @summary Delete an udpate
 * @param integer statusID
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns bool with the success/failure of the operation
 */
TM.services.twitter.delete_status = function(statusID, username, password)
{
	req = $.ajax({
		success: function(data) { return true; },
		error: function(data) { return false; },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
			req.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
	    },
		processData: false,
        type: "POST",
		data: "&id=" + statusID,
        url: TM.services.twitter.info['destroy-status'] + statusID + '.json'
	});
	
	TM.core.callback.delete_status(statusID);
}

/**
 * TM.services.twitter.block_contact
 * @summary Block a contact and destroy the friendship (if it exists)
 * @param screen_name The contact's screen name in Twitter
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns void
 */
TM.services.twitter.block_contact = function(screen_name, username, password)
{
	req = $.ajax({
		success: function(data) { return true; },
		error: function(data) { return false; },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
			//req.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
	    },
		processData: false,
        type: "POST",
		data: "&id=" + screen_name,
        url: TM.services.twitter.info['create-block'] + screen_name + '.json'
	});
}

/**
 * TM.services.twitter.create_friendship
 * @summary Create a friendship with the target screen_name
 * @param screen_name The contact's screen name in Twitter
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns void
 */
TM.services.twitter.create_friendship = function(screen_name, username, password)
{
	req = $.ajax({
		success: function(data) { return true; }, 
		error: function(data) { return false; },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
			//req.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
	    },
		processData: false,
        type: "POST",
		data: "&id=" + screen_name,
        url: TM.services.twitter.info['create-friendship'] + screen_name + '.json'
	});
}

/**
 * TM.services.twitter.destroy_friendship
 * @summary Destroy the friendship with the target screen_name
 * @param screen_name The contact's screen name in Twitter
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns void
 */
TM.services.twitter.destroy_friendship = function(screen_name, username, password)
{
	req = $.ajax({
		success: function(data) { return true; }, 
		error: function(data) { return false; },
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
			//req.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
	    },
		processData: false,
        type: "POST",
		data: "&id=" + screen_name,
        url: TM.services.twitter.info['destroy-friendship'] + screen_name + '.json'
	});
}

/**
 * TM.services.twitter.profile_info
 * @summary Get the user's profile information.
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @returns void
 */
TM.services.twitter.profile_info = function(username, password)
{
	req = $.ajax({
		success: function(data) { TM.core.callback.profile_info(data); },
		error: function(data) {
			$('.num_friends').html(TM.db.contacts.all(true).length);
			$('.num_followers').html(TM.db.contacts.all(false).length);
			TM.core.display.get_groups();
			
			// If something went wrong, get whatever we have on the DB
			TM.core.display.get_friends();
		},
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + Base64.encode(username + ":" + password));
            req.setRequestHeader('Cookie', '');
	    },
		processData: false,
        type: "GET",
        url: TM.services.twitter.info['profile-info'] + username
	});
}

/**
 * TM.services.twitter.contact_profile_info
 * @summary Get the specified username's profile information, used in html/LANG/profile.html
 * @param string username (plaintext)
 * @returns void
 */
TM.services.twitter.contact_profile_info = function(username)
{
	req = $.ajax({
		success: function(data) { TM.core.callback.contact_profile_info(data); },
		error: function(data) {	},
		processData: false,
        type: "GET",
        url: TM.services.twitter.info['profile-info'] + username
	});
}

/**
 * TM.services.bitly.shorten
 * @summary Shrink a URL
 * @param object objectID The checkbox where the text should be replaced.
 * @param string targetURL The URL that's going to be shrinked
 * @returns void
 */
TM.services.bitly.shorten = function(objectID, targetURL)
{
	var requestURL = TM.services.bitly.info['requestURL'];
	requestURL += '&longUrl=' + encodeURIComponent(targetURL);
	requestURL += '&apiKey=' + TM.services.bitly.info['apiKey'];
	requestURL += '&login=' + TM.services.bitly.info['username'];
	
	req = $.ajax({
		success: function(data) { 
			data = eval('(' + data + ')');
			TM.core.callback.bitly(objectID, targetURL, data); 
		},
		error: function(data) { return targetURL; },
		processData: false,
        type: "GET",
        url: requestURL
	}); 
}

/**
 * Multipart File Upload Request Helper Function
 *
 * A function to help prepare URLRequest object for uploading.
 * The script works without FileReference.upload().
 *
 * @author FreeWizard
 *
 * Function Parameters:
 * void PrepareMultipartRequest(URLRequest request, ByteArray file_bytes,
 *                                                              string field_name = "file", string native_path = "C:\FILE",
 *                                                              object data_before = {}, object data_after = {});
 *
 * Sample JS Code:
 * <script>
 * var request = new air.URLRequest('http://example.com/upload.php');
 * var loader = new air.URLLoader();
 * var file = new air.File('C:\\TEST.TXT'); //use file.browseForOpen() on ur wish
 * var stream = new air.FileStream();
 * var buf = new air.ByteArray();
 * var extra = {
 *         "id": "abcd"
 *         };
 * stream.open(file, air.FileMode.READ);
 * stream.readBytes(buf);
 * MultipartRequest(request, buf, 'myfile', file.nativePath, extra);
 * loader.load(request);
 * @link http://rollingcode.org/blog/2007/11/file-upload-with-urlrequest-in-air.html
 */
TM.services.PrepareMultipartRequest = function(request, file_bytes, file_type, field_name, native_path, data_before, data_after) {
	 var boundary = '---------------------------1076DEAD1076DEAD1076DEAD';
	 var header1 = '';
	 var header2 = '\r\n';
	 var header1_bytes = new air.ByteArray();
	 var header2_bytes = new air.ByteArray();
	 var body_bytes = new air.ByteArray();
	 var n;
	 if (!field_name) field_name = 'file';
	 if (!file_type) file_type = 'application/octet-stream';
	 if (!native_path) native_path = 'C:\FILE';
	 if (!data_before) data_before = {};
	 if (!data_after) data_after = {};
	 for (n in data_before) {
	         header1 += '--' + boundary + '\r\n'
	                         + 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
	                         + data_before[n] + '\r\n';
	 }
	 header1 += '--' + boundary + '\r\n'
	                 + 'Content-Disposition: form-data; name="' + field_name + '"; filename="' + native_path + '"\r\n'
	                 + 'Content-Type: ' + file_type + '\r\n\r\n';
	 for (n in data_after) {
	         header2 += '--' + boundary + '\r\n'
	                         + 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
	                         + data_after[n] + '\r\n';
	 }
	 header2 += '--' + boundary + '--';
	 header1_bytes.writeMultiByte(header1, "ascii");
	 header2_bytes.writeMultiByte(header2, "ascii");
	 body_bytes.writeBytes(header1_bytes, 0, header1_bytes.length);
	 body_bytes.writeBytes(file_bytes, 0, file_bytes.length);
	 body_bytes.writeBytes(header2_bytes, 0, header2_bytes.length);
	 request.method = air.URLRequestMethod.POST;
	 request.contentType = 'multipart/form-data; boundary='+boundary;
	 request.data = body_bytes;
}