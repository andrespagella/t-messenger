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
 * @summary User Configuration
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.settings) TM.settings = {};

TM.settings.info = {
	'file': air.File.applicationStorageDirectory.resolvePath("config.json")
}

/**
 * TM.settings.defaultConfig
 * @summary default user values
 */
TM.settings.defaultConfig = {
    'username': '',
	'password': '',
	'openRepliesNewWindow': true,
	'enableSounds': true,
	'tweetCount': 30,
	'mentionsCount':30,
	'refreshTime': 60,
	'ajaxRequestTimeout': 20,
	'locale': 'en',
	'theme': 'default'
}

/**
 * TM.settings.load
 * @param null
 * @returns boolean, indicating success or error on loading the configuration file
 */
TM.settings.load = function() {	
    if (TM.settings.info.file.exists) {
		var fileHandler = new air.FileStream();
		TM.settings.current = {};

        fileHandler.open(TM.settings.info.file, air.FileMode.READ);
        var config = fileHandler.readUTFBytes(TM.settings.info.file.size);

        data = JSON.parse(config);
        for (key in data) TM.settings.current[key] = data[key];

		var username = air.EncryptedLocalStore.getItem('username');
		var password = air.EncryptedLocalStore.getItem('password');

		username = username.readUTFBytes(username.bytesAvailable);
		password = password.readUTFBytes(password.bytesAvailable);

		TM.settings.current.username = username;
		TM.settings.current.password = password;

		fileHandler.close();

		if (TM.settings.current.locale == undefined) {
			alert('Your configuration file needs to be updated.\n\nPlease, restart the application.');
			TM.settings.reset();

			return false;
		}

		return true;
    } else {
		TM.settings.current = TM.settings.defaultConfig;

		return false;
	}
};

/**
 * TM.settings.save
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @param object newValues, based on TM.settings.default
 * @returns boolean, indicating success or error on saving the configuration file
 */
TM.settings.save = function(username, password, newValues) {
	try {
		var fileHandler = new air.FileStream();

	    fileHandler.open(TM.settings.info.file, air.FileMode.WRITE);
	    fileHandler.writeUTFBytes(JSON.stringify(newValues));
	    TM.settings.current = newValues;

		data = new air.ByteArray();
	    data.writeUTFBytes(username);
	    air.EncryptedLocalStore.setItem('username', data);

	    data = new air.ByteArray();
	    data.writeUTFBytes(password);
	    air.EncryptedLocalStore.setItem('password', data);

		fileHandler.close();

		return true;
	} catch(e) {
		return false;
	}
};

/**
 * TM.settings.reset
 * @param null
 * @returns boolean, indicating success or error on saving the configuration file
 */
TM.settings.reset = function() {	
    if (TM.settings.info.file.exists) {
		TM.settings.info.file.deleteFile(); // Delete the configuration files.

		try {
			TM.db.reset();  // Delete the database.
		} catch(e) { }

		air.EncryptedLocalStore.reset(); // Delete both encrypted files for the username/password

		air.NativeApplication.nativeApplication.exit(); // Exit the App.

		return true;
	} else {
		return false;
	}
};

/*
 * @summary User Configuration
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.settings) TM.settings = {};

TM.settings.info = {
	'file': air.File.applicationStorageDirectory.resolvePath("config.json")
}

/**
 * TM.settings.defaultConfig
 * @summary default user values
 */
TM.settings.defaultConfig = {
    'username': '',
	'password': '',
	'openRepliesNewWindow': true,
	'enableSounds': true,
	'tweetCount': 30,
	'mentionsCount':30,
	'refreshTime': 60,
	'ajaxRequestTimeout': 20,
	'locale': 'en',
	'theme': 'default'
}

/**
 * TM.settings.load
 * @param null
 * @returns boolean, indicating success or error on loading the configuration file
 */
TM.settings.load = function() {	
    if (TM.settings.info.file.exists) {
		var fileHandler = new air.FileStream();
		TM.settings.current = {};
		
        fileHandler.open(TM.settings.info.file, air.FileMode.READ);
        var config = fileHandler.readUTFBytes(TM.settings.info.file.size);

        data = JSON.parse(config);
        for (key in data) TM.settings.current[key] = data[key];

		var username = air.EncryptedLocalStore.getItem('username');
		var password = air.EncryptedLocalStore.getItem('password');
	
		username = username.readUTFBytes(username.bytesAvailable);
		password = password.readUTFBytes(password.bytesAvailable);
	
		TM.settings.current.username = username;
		TM.settings.current.password = password;

		fileHandler.close();
		
		if (TM.settings.current.locale == undefined) {
			alert('Your configuration file needs to be updated.\n\nPlease, restart the application.');
			TM.settings.reset();
			
			return false;
		}

		return true;
    } else {
		TM.settings.current = TM.settings.defaultConfig;

		return false;
	}
};

/**
 * TM.settings.save
 * @param string username (plaintext)
 * @param string password (plaintext)
 * @param object newValues, based on TM.settings.default
 * @returns boolean, indicating success or error on saving the configuration file
 */
TM.settings.save = function(username, password, newValues) {
	try {
		var fileHandler = new air.FileStream();
	
	    fileHandler.open(TM.settings.info.file, air.FileMode.WRITE);
	    fileHandler.writeUTFBytes(JSON.stringify(newValues));
	    TM.settings.current = newValues;

		data = new air.ByteArray();
	    data.writeUTFBytes(username);
	    air.EncryptedLocalStore.setItem('username', data);

	    data = new air.ByteArray();
	    data.writeUTFBytes(password);
	    air.EncryptedLocalStore.setItem('password', data);
	
		fileHandler.close();
		
		return true;
	} catch(e) {
		return false;
	}
};

/**
 * TM.settings.reset
 * @param null
 * @returns boolean, indicating success or error on saving the configuration file
 */
TM.settings.reset = function() {	
    if (TM.settings.info.file.exists) {
		TM.settings.info.file.deleteFile(); // Delete the configuration files.
		
		try {
			TM.db.reset();  // Delete the database.
		} catch(e) { }
		
		air.EncryptedLocalStore.reset(); // Delete both encrypted files for the username/password
		
		air.NativeApplication.nativeApplication.exit(); // Exit the App.

		return true;
	} else {
		return false;
	}
};
