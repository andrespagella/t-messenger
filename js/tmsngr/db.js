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
 * @summary Database operations
 * @dependecy TM.locale, TM.settings
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.db) TM.db = {}; // Main DB class
if (!TM.db.contacts) TM.db.contacts = {}; // Contacts
if (!TM.db.groups) TM.db.groups = {}; // Groups
if (!TM.db.groups.contacts) TM.db.groups.contacts = {}; // Association between contacts and groups
if (!TM.db.tweet) TM.db.tweet = {}; // Tweets and mentions

var TMSNGR_DATABASE = new air.SQLConnection(); 

/**
 * TM.db.SQLEscape
 * @summary Escapes an string for safe SQL input
 * @param string text
 * @returns string
 */
TM.db.SQLEscape = function(text)
{
	return escape(text);
}

/**
 * TM.db.SQLUnEscape
 * @summary (Un)Escapes an string for HTML Output
 * @param string text
 * @returns string
 */
TM.db.SQLUnEscape = function(text)
{
	return unescape(text);
}

/**
 * TM.db.init
 * @summary Check if the app database exists or create it if it doesn't
 * @returns void
 */
TM.db.init = function()
{
	dbFile = air.File.applicationStorageDirectory.resolvePath("tmsngr.db");

	// Disable only for debugging purposes.
	//if (dbFile.exists) { dbFile.deleteFile(); }

	if (!dbFile.exists) {
		var dbTemp = air.File.applicationDirectory.resolvePath("tmsngr.db"); 
		dbTemp.copyTo(dbFile, true);
	}
	
	try {
		TMSNGR_DATABASE.open(dbFile);
	} catch(e) { 
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
	}
}

/**
 * TM.db.reset
 * @summary Deletes the database from the hard disk.
 * @returns void
 */
TM.db.reset = function()
{
	dbFile = air.File.applicationStorageDirectory.resolvePath("tmsngr.db");
	if (dbFile.exists) { dbFile.deleteFile(); }
}

/**
 * TM.db.contacts.set
 * @summary Create a new contact
 * @param integer contactID The contact's Twitter user ID
 * @param string screen_name The contact's screen name
 * @param char is_friend (Y/N) if the contact is a friend
 * @param string lasttweet The contact's last tweet
 * @param string real_name The contact's real name
 * @param string profile_image_url The contact's 'avatar'
 * @returns bool with the status of the operation
 */

TM.db.contacts.set = function(contactID, screen_name, is_friend, lasttweet, real_name, profile_image_url) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 	
	
	is_friend = (is_friend == true) ? 'Y' : 'N';
	
	screen_name = TM.db.SQLEscape(screen_name);
	lasttweet = TM.db.SQLEscape(lasttweet);
	real_name = TM.db.SQLEscape(real_name);
	profile_image_url = encodeURIComponent(profile_image_url);
	
	query.text = "INSERT INTO contacts (contactid, screen_name, is_friend, lasttweet, real_name, profile_image_url) "; 
	query.text += "VALUES (";
	query.text += contactID + ", ";
	query.text += '"' + screen_name + '", ';
	query.text += '"' + is_friend + '", ';
	query.text += '"' + lasttweet + '", ';
	query.text += '"' + real_name + '", ';
	query.text += '"' + profile_image_url + '") ';

	try { 
		query.execute();
		
		return true;	
	} catch (e) { 
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);		
		return false;
	} 
}

/**
 * TM.db.contacts.change
 * @summary Modify an existing contact
 * @param integer contactID The contact's Twitter user ID
 * @param char is_friend (Y/N) if the contact is a friend
 * @param string lasttweet The contact's last tweet
 * @param string real_name The contact's real name
 * @param string profile_image_url The contact's 'avatar'
 * @returns bool with the status of the operation
 */

TM.db.contacts.change = function(contactID, is_friend, lasttweet, real_name, profile_image_url) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 	
	
	is_friend = (is_friend == true) ? 'Y' : 'N';
		
	lasttweet = TM.db.SQLEscape(lasttweet);
	real_name = TM.db.SQLEscape(real_name);
	profile_image_url = encodeURIComponent(profile_image_url);
	
	query.text = "UPDATE contacts SET "; 
	query.text += 'lasttweet = "' + lasttweet + '", ';
	query.text += 'real_name = "' + real_name + '", ';
	query.text += 'profile_image_url = "' + profile_image_url + '" ';
	query.text += "WHERE contactid = " + contactID;

	try { 
		query.execute();
		
		return true;	
	} catch (e) { 
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);		
		return false;
	} 
}

/**
 * TM.db.contacts.get
 * @summary Get the information of an existing contact
 * @param integer contactID The contact's Twitter user ID
 * @returns array
 */
TM.db.contacts.get = function(contactID) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	query.text = "SELECT * FROM contacts "; 
	query.text += "WHERE contactid = " + contactID;

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) {
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.contacts.del
 * @summary Delete the information of an existing contact
 * @param string screen_name The contact's screen_name
 * @returns array
 */
TM.db.contacts.del = function(screen_name) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	query.text = "DELETE FROM contacts "; 
	query.text += "WHERE screen_name = " + screen_name;

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) {
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.contacts.all
 * @summary Get all contacts
 * @param bool friend Indicates if it needs to bring friends or followers only
 * @param integer (optional) page_number The page to bring, 100 contacts at a time
 * @returns array
 */
TM.db.contacts.all = function(friend, page_number) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	friend = (friend) ? 'Y' : 'N';
	page_number = (page_number == undefined) ? 0 : page_number;
	
	query.text = "SELECT * FROM contacts ";
	query.text += 'WHERE is_friend = "' + friend + '" ';
	query.text += (page_number != 0) ? "LIMIT " + ((page_number * 30)-30) + ', 30 ' : '';

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) {
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.set
 * @summary Create a new group
 * @param string name The group's name
 * @returns bool with the status of the operation
 */

TM.db.groups.set = function(name) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	name = TM.db.SQLEscape(name);	
	
	query.text = "INSERT INTO groups (name) "; 
	query.text += "VALUES (";
	query.text += '"' + name + '") ';

	try { 
		query.execute();
		
		return true;	
	} catch (e) {
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.get
 * @summary Get the information of an existing group
 * @param string name The group's name
 * @returns array
 */
TM.db.groups.get = function(name) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	name = TM.db.SQLEscape(name);
	
	query.text = "SELECT * FROM groups WHERE "; 
	query.text += 'name LIKE "' + name + '" ';

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) { 
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.all
 * @summary Get all groups
 * @returns array
 */
TM.db.groups.all = function() {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	query.text = "SELECT * FROM groups ";

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) { 
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.del
 * @summary Delete a group
 * @param integer groupID The group's ID
 * @returns bool with the status of the operation
 */

TM.db.groups.del = function(groupID) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	// Delete the group
	query.text = "DELETE FROM groups "; 
	query.text += "WHERE idx = " + groupID;

	try { 
		query.execute();
		
		return true;	
	} catch (e) {
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.contacts.set
 * @summary Create a new association between a contact and a group
 * @param integer groupID The group's ID
 * @param integer contactID The contact's ID
 * @returns bool with the status of the operation
 */

TM.db.groups.contacts.set = function(groupID, contactID) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	query.text = "INSERT INTO groups_contacts (groupid, contactid) "; 
	query.text += "VALUES (";
	query.text += groupID + ", ";
	query.text += contactID + ") ";

	try { 
		query.execute();
		
		return true;	
	} catch (e) {
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.contacts.get
 * @summary Return all the contacts for a given group
 * @param integer groupID The group's ID
 * @returns array
 */
TM.db.groups.contacts.get = function(groupID) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	query.text = "SELECT * FROM groups_contacts ";
	query.text += "WHERE groupid = " + groupID;

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) { 
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.groups.contacts.del
 * @summary Delete the association between a group and its contacts
 * @param integer groupID The group's ID
 * @returns bool with the status of the operation
 */

TM.db.groups.contacts.del = function(groupID) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	// Delete the group
	query.text = "DELETE FROM groups_contacts "; 
	query.text += "WHERE groupid = " + groupID;

	try { 
		query.execute();
		
		return true;	
	} catch (e) {
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.tweet.set
 * @summary Adds a tweet
 * @param integer statusID
 * @param integer userID
 * @param string screen_name
 * @param string profile_image_url
 * @param string source
 * @param string tweet
 * @param string created_at
 * @param string in_reply_to
 * @param bool favorited 
 * @param bool mention
 * @returns bool with the status of the operation
 */

TM.db.tweet.set = function(statusID, userID, screen_name, profile_image_url, source, tweet, created_at, in_reply_to, favorited, mention) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	profile_image_url = TM.db.SQLEscape(profile_image_url);
	tweet = TM.db.SQLEscape(tweet);
	source = TM.db.SQLEscape(source);
	mention = (mention) ? 'Y' : 'N';
	favorited = (favorited) ? 'Y' : 'N';
	
	query.text = "INSERT INTO tweets (statusid, userid, screen_name, profile_image_url, source, tweet, created_at, in_reply_to_screen_name, favorited, mention) "; 
	query.text += "VALUES (";
	query.text += statusID + ", ";
	query.text += userID + ", ";
	query.text += "'" + screen_name + "', ";
	query.text += "'" + profile_image_url + "', ";
	query.text += "'" + source + "', ";
	query.text += "'" + tweet + "', ";
	query.text += "'" + created_at + "', ";
	query.text += "'" + in_reply_to_screen_name + "', ";
	query.text += "'" + favorited + "', ";
	query.text += "'" + mention + "') ";

	try {
		query.execute();
		
		return true;	
	} catch (e) {
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	}
}

/**
 * TM.db.tweet.del
 * @summary Deletes a tweet
 * @param integer statusID The tweet's status ID
 * @returns bool with the status of the operation
 */

TM.db.tweet.del = function(statusID) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 

	// Delete the group
	query.text = "DELETE FROM tweets "; 
	query.text += "WHERE statusid = " + statusID;

	try { 
		query.execute();

		return true;	
	} catch (e) {
		air.trace('Error: ' + e.message);  		
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.tweet.all
 * @summary Get all tweets
 * @param bool mention Indicates if it needs to bring 'common' tweets or mentions only
 * @param integer (optional) page_number The page to bring
 * @returns array
 */

TM.db.tweet.all = function(mention, page_number) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	mention = (mention) ? 'Y' : 'N';
	page_number = (page_number == undefined) ? 0 : page_number;
	
	query.text = "SELECT DISTINCT * FROM tweets ";
	query.text += 'WHERE mention = "' + mention + '" ';
	query.text += 'ORDER BY statusid DESC ';
	query.text += (page_number != 0) ? "LIMIT " + ((page_number * 30)-30) + ', 30 ' : '';

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) {
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
		return false;
	} 
}


/**
 * TM.db.tweet.filter
 * @summary Get all tweets made by contacts of an specified group
 * @param array arrContactsIDs Array containing the user ids of the group members
 * @param integer (optional) page_number The page to bring
 * @returns array
 */

TM.db.tweet.filter = function(arrContactsIDs, page_number) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	page_number = (page_number == undefined) ? 0 : page_number;
	
	query.text = "SELECT DISTINCT * FROM tweets ";
	query.text += 'WHERE mention = "N" '; // I just want to see my friends tweets.
	query.text += (arrContactsIDs.length > 0) ? 'AND ' : '';
	
	for (i = 0; i < arrContactsIDs.length; i++) {
		query.text += 'userid = ' + arrContactsIDs[i] + ' ';
		query.text += (i != arrContactsIDs.length-1) ? 'OR ' : '';
	}
	
	query.text += 'ORDER BY statusid DESC ';
	query.text += (page_number != 0) ? "LIMIT " + ((page_number * 30)-30) + ', 30 ' : '';

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) {
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
		return false;
	} 
}

/**
 * TM.db.tweet.getIM
 * @summary Get the conversation between the user and other contacts
 * @param string screen_name The contact's screen name to get
 * @returns array
 */

TM.db.tweet.getIM = function(screen_name) {
	query = new air.SQLStatement(); 
	query.sqlConnection = TMSNGR_DATABASE; 
	
	query.text = "SELECT DISTINCT * FROM tweets WHERE ";
	query.text += '(screen_name LIKE "' + TM.settings.current.username + '" AND in_reply_to_screen_name LIKE "' + screen_name + '" AND mention LIKE "N") OR ';
	query.text += '(screen_name LIKE "' + screen_name + '" AND mention LIKE "Y") ';
	
	query.text += 'ORDER BY statusid DESC ';
	query.text += 'LIMIT 100';

	try {
		query.execute();
		
		return query.getResult().data;	
	} catch (e) {
		air.trace('Error: ' + e.message);
		air.trace('Details: ' + e.details);
		return false;
	} 
}

