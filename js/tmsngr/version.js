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
 * @summary Application Updater / Version Check
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.version) TM.version = {};

/**
 * TM.version.update
 * @param null
 * @returns boolean, indicating success or error on the update operation
 */
TM.version.update = function() 
{
	try {
		var appUpdater = new runtime.air.update.ApplicationUpdaterUI();
	
		appUpdater.isInstallUpdateVisible = true;
		appUpdater.isFileUpdateVisible = true;
		appUpdater.configurationFile = new air.File('app:/updateConfig.xml');	
		appUpdater.addEventListener( air.ErrorEvent.ERROR, TM.version.errorHandler );
		appUpdater.initialize();
		appUpdater.checkNow();
		
		return true;
	} catch(e) { 
		return false;
	}
}

/**
 * TM.version.errorHandler
 * @param null
 * @returns void
 */
TM.version.errorHandler = function()
{
	alert('An error ocurred trying to update the Application.');
}

/**
 * TM.version.get
 * @param null
 * @returns string, with the current application version
 */
TM.version.get = function()
{
	// Not implemented
}