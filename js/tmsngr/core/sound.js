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
 * @summary TM.CORE Sounds and notifications
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

if (!TM.core.sound) TM.core.sound = {};

TM.core.sound.send = function() {
	TM.core.sound.play('app:/sounds/sent.mp3');
	
}

TM.core.sound.error = function() {
	TM.core.sound.play('app:/sounds/sent.mp3');
}

TM.core.sound.receive = function() {
	TM.core.sound.play('app:/sounds/received.mp3');
}

TM.core.sound.reply = function() {
	TM.core.sound.play('app:/sounds/newreply.mp3');
}

TM.core.sound.play = function(path)
{
	var mp3File = new air.Sound(new air.URLRequest(path));
	
	if (TM.settings.current.enableSounds) {
		mp3File.play();
	}
}