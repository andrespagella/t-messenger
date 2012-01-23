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
 * @summary Real-time Text parser, optimized for performance
 * @dependecy TM.locale, TM.settings, TM.string, TM.services.bitly
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.parser) TM.parser = {};

/**
 * TM.parser.parse
 * @summary Parses the text and shrinks URLs
 * @param object input text / textbox
 * @return void
 */
TM.parser.parse = function(objectID)
{
	text = objectID.value.split(" ");

	if (text.length > 0) {
		for (i = 0; i < text.length; i++) {
			if (TM.string.isUrl(text[i])) {
				if (text[i].length > 22 && 
					text[i].search('/bit\.ly/') == -1 && // Don't shorten already shortened URLs
					text[i].search('/twitpic\.com/') == -1) { // Don't shorten Twitpic URLs
					//shortenedURL = TM.services.bitly.shorten(text[i]);
					TM.services.bitly.shorten(objectID, text[i]); // Shorten URL if possible.
					//objectID.value.replace(text[i], shortenedURL);
				}
			}
		}
	}
}

/**
 * TM.parser.count
 * @summary Parses the text and shrinks URLs
 * @param object sourceID The source textbox
 * @param string screen_name (optional) 
 * @return integer with the number of characters left
 */
TM.parser.count_chars = function(sourceID, screen_name)
{
	if (screen_name == undefined) {
		var screen_name = '';
	}
	
	var sourceText = sourceID.value;
	
	return (sourceText.length != 0) ? ((140 - parseInt(screen_name.length)) - sourceText.length) : 140;
}
