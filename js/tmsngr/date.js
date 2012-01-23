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
 * @summary Date utils
 * @dependency TM.locale, TM.settings
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.date) TM.date = {};

/**
 * TM.date.parse
 * @param string date
 * @returns string
 */
TM.date.parse = function(date)
{
	date = date.split(' ');
	finalTime = date[3].split(':')

	finalDate = TM.date.getWeekdayString(date[0]) + ' ';
	finalDate += TM.date.getMonthString(date[1]) + ', ';
	finalDate += Math.round(date[2]) + ' ' + TM.locale[TM.settings.current.locale]['at-time'] + ' ';
	finalDate += finalTime[0] + ':' + finalTime[1];
	
	return finalDate;
}

/**
 * TM.date.getWeekdayString
 * @param string weekDay 3-char string with the week day
 * @returns string (The complete name)
 */
TM.date.getWeekdayString = function(weekDay)
{
	switch(weekDay) {
		default:
		case 'Mon':	return TM.locale[TM.settings.current.locale].Mon; break;
		case 'Tue': return TM.locale[TM.settings.current.locale].Tue; break;
		case 'Wed': return TM.locale[TM.settings.current.locale].Wed; break;
		case 'Thu': return TM.locale[TM.settings.current.locale].Thu; break;
		case 'Fri': return TM.locale[TM.settings.current.locale].Fri; break;
		case 'Sat': return TM.locale[TM.settings.current.locale].Sat; break;
		case 'Sun': return TM.locale[TM.settings.current.locale].Sun; break;
	}
}

/**
 * TM.date.getMonthString
 * @param string month 3-char string with the month
 * @returns string (The complete name)
 */
TM.date.getMonthString = function(month)
{
	switch(month) {
		default:
		case 'Jan':	return TM.locale[TM.settings.current.locale].Jan; break;
		case 'Feb': return TM.locale[TM.settings.current.locale].Feb; break;
		case 'Mar': return TM.locale[TM.settings.current.locale].Mar; break;
		case 'Apr': return TM.locale[TM.settings.current.locale].Apr; break;
		case 'May': return TM.locale[TM.settings.current.locale].May; break;
		case 'Jun': return TM.locale[TM.settings.current.locale].Jun; break;
		case 'Jul': return TM.locale[TM.settings.current.locale].Jul; break;
		case 'Aug': return TM.locale[TM.settings.current.locale].Aug; break;
		case 'Sep': return TM.locale[TM.settings.current.locale].Sep; break;
		case 'Oct': return TM.locale[TM.settings.current.locale].Oct; break;
		case 'Nov': return TM.locale[TM.settings.current.locale].Nov; break;
		case 'Dec': return TM.locale[TM.settings.current.locale].Dec; break;
	}
}