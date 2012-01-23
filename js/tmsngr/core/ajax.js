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
 * @summary TM.CORE AJAX Request handler
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

if (!TM.core.ajax) TM.core.ajax = {};

TM.core.ajax.parameters = {
	'timeout': 20, // Request timeout (in seconds)
	'async': true,
	'cache': false
}

/**
 * TM.core.ajax.start
 * @param string Loader image objectID
 * @returns bool
 */
TM.core.ajax.start = function(objectID) {
	$('#' + objectID).attr('src', 'app:/img/loader.gif');
	
	// Disable the twtText box, if present
	// DISABLED, BOTHERS TOO MUCH. COUNTER-INTUITIVE.
	/*$('#twtText').attr("disabled", true);
	$('#twtText').css("background-color", "#CCC");*/
	
	return true;
}

/**
 * TM.core.ajax.end
 * @param string Loader image objectID
 * @returns bool
 */
TM.core.ajax.end = function(objectID) {
	$('#' + objectID).attr('src', 'app:/img/loader-static.png');
	
	// Enable the twtText box, if present
	$('#twtText').removeAttr("disabled");
	$('#twtText').removeClass('multi');
	$('#twtText').removeClass('picLoading');
	$('#twtText').css("background-color", "#FFF");
	
	return true;
}

/**
 * TM.core.ajax.error
 * @param string Loader image objectID
 * @returns bool
 */
TM.core.ajax.error = function(objectID) {
	$('#' + objectID).attr('src', 'app:/img/loader-error.gif');
	
	return false;
}