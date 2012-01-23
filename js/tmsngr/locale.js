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
 * @summary Locale, Phrases, etc.
 * @author Andres Pagella (andres.pagella@gmail.com)
 */

var TM;
if (!TM) TM = {};

if (!TM.locale) TM.locale = {};

// English
TM.locale.en = {
	'yes': 'Yes',
	'no': 'No',
	
	'delete-contact': 'Are you sure that you want to delete this contact?\n\nWARNING: There is no "undo" for this operation!',
	'block-contact': 'Are you sure that you want to block this contact?\n\nWARNING: There is no "undo" for this operation!',
	'add-contact': 'Are you sure that you want to add this contact as a friend?',
	'delete-status': 'Are you sure that you want to delete this status update?\n\nWARNING: There is no "undo" for this operation!',
	'delete-group': 'Are you sure that you want to delete this group?\n\nWARNING: There is no "undo" for this operation!',
	
	// Weekdays
	'Mon': 'Monday',
	'Tue': 'Tuesday',
	'Wed': 'Wednesday',
	'Thu': 'Thursday',
	'Fri': 'Friday',
	'Sat': 'Saturday',
	'Sun': 'Sunday',
	
	// Months
	'Jan': 'January',
	'Feb': 'February',
	'Mar': 'March',
	'Apr': 'April',
	'May': 'May',
	'Jun': 'June',
	'Jul': 'July',
	'Aug': 'August',
	'Sep': 'September',
	'Oct': 'October',
	'Nov': 'November',
	'Dec': 'December',
	
	'at-time': 'at',
	
	'error-dropping-image': 'Choose a valid image file and try again.',
	
	'invalid-username': 'Please, insert a valid Twitter.com username',
	'invalid-password': 'Please, insert a valid Twitter.com password',
	
	'what-he-doing': 'What is he up to?',
	
	'groups-empty': '<br /><center><strong><span style="font-size: 12px; color: black">You haven\'t created any groups yet.</span></strong><br /> Use the "New Group" button on the toolbar above or click<br /> the button below to create a new group of friends.<br /><br /><div class="button3 new-group-button" style="width: 80px">New Group</div></center><br />',
	'friends-empty': 'You haven\'t added any friends or an error ocurred while loading the data.',
	'followers-empty': 'You don\'t have any followers or an error ocurred while loading the data.',
	'timeline-empty': 'The timeline cache is emtpy or an error ocurred while loading the data.',
	'mentions-empty': 'The mentions cache is emtpy or an error ocurred while loading the data.',
	
	'contacts': 'Contacts',
	
	'selectbox-groups-all': 'See tweets from all your friends',
	'selectbox-groups-only': 'See tweets only from the group ',
	
	'chatting-with': 'Chatting with',
	
	'previous-page': 'Previous Page',
	'next-page': 'Next Page',
	
	'reply': 'Reply',
	'retweet': 'Retweet',
	'delete': 'Delete',
	'says': 'says',
	'posted-on': 'Posted on',
	'with': 'with'
}

// Spanish
TM.locale.es = {
	'yes': 'Si',
	'no': 'No',
	
	'delete-contact': '¿Está seguro de querer borrar este contacto?\n\nADVERTENCIA: ¡No hay "deshacer" para esta operación!',
	'block-contact': '¿Está seguro de querer bloquear este contacto?\n\nADVERTENCIA: ¡No hay "deshacer" para esta operación!',
	'add-contact': '¿Está seguro de querer agregar a este contacto como amigo?',
	'delete-status': '¿Está seguro de querer borrar esta actualización?\n\nADVERTENCIA: ¡No hay "deshacer" para esta operación!',
	'delete-group': '¿Está seguro de querer borrar este grupo?\n\nADVERTENCIA: ¡No hay "deshacer" para esta operación!',
	
	// Weekdays
	'Mon': 'Lunes',
	'Tue': 'Martes',
	'Wed': 'Miércoles',
	'Thu': 'Jueves',
	'Fri': 'Viernes',
	'Sat': 'Sábado',
	'Sun': 'Domingo',
	
	// Months
	'Jan': 'Enero',
	'Feb': 'Febrero',
	'Mar': 'Marzo',
	'Apr': 'Abril',
	'May': 'Mayo',
	'Jun': 'Junio',
	'Jul': 'Julio',
	'Aug': 'Agosto',
	'Sep': 'Septiembre',
	'Oct': 'Octubre',
	'Nov': 'Noviembre',
	'Dec': 'Deciembre',
	
	'at-time': 'a las',
	
	'error-dropping-image': 'Elija un formato válido de imágen e inténtelo nuevamente',
	
	'invalid-username': 'Por favor, inserte un usuario válido de Twitter.com',
	'invalid-password': 'Por favor, inserte una contraseña válida de Twitter.com',
	
	'what-he-doing': '¿Qué está haciendo?',
	
	'groups-empty': '<br /><center><strong><span style="font-size: 12px; color: black">No has creado ningún grupo todavía.</span></strong><br /> Utiliza el botón "Nuevo Grupo" en la barra de herramientas superior<br /> o haz click en el botón de abajo para crear un nuevo grupo de amigos.<br /><br /><div class="button3 new-group-button" style="width: 80px">Nuevo Grupo</div></center><br />',
	'friends-empty': 'No has agregado amigos u ocurrió un error intentando cargar la información.',
	'followers-empty': 'No tienes seguidores u ocurrió un error intentando cargar la información.',
	'timeline-empty': 'El caché de la línea de tiempo se encuentra vacía u ocurrió un error intentando cargar la información.',
	'mentions-empty': 'El caché de menciones se encuentra vacía u ocurrió un error intentando cargar la información.',
	
	'contacts': 'Contactos',
	
	'selectbox-groups-all': 'Ver actualizaciones de todos mis amigos',
	'selectbox-groups-only': 'Mostrar solo actualizaciones del grupo ',
	
	'chatting-with': 'Conversación con',
	
	'previous-page': 'Pag. Previa',
	'next-page': 'Pag. Siguiente',
	
	'reply': 'Responder',
	'retweet': 'Retweet',
	'delete': 'Borrar',
	'says': 'dice',
	'posted-on': 'Hecho el día',
	'with': 'con'
}

// Portugese
TM.locale.pr = {
	'yes': 'Se',
	'no': 'Não',
	
	'delete-contact': 'Tem certeza de que deseja excluir este contato?\n\nAVISO: Esta operação não pode ser desfeito!',
	'block-contact': 'Tem certeza de que deseja ignorar este contato?\n\nAVISO: Esta operação não pode ser desfeito!',
	'add-contact': 'Tem certeza de que deseja adicionar o contato como um amigo?',
	'delete-status': 'Tem certeza de que deseja excluir esta atualização?\n\nAVISO: Esta operação não pode ser desfeito!',
	'delete-group': 'Tem certeza de que deseja excluir este grupo?\n\nAVISO: Esta operação não pode ser desfeito!',
	
	// Weekdays
	'Mon': 'Segunda',
	'Tue': 'Terça',
	'Wed': 'Quarta',
	'Thu': 'Quinta',
	'Fri': 'Sexta',
	'Sat': 'Sábado',
	'Sun': 'Domingo',
	
	// Months
	'Jan': 'Janeiro',
	'Feb': 'Fevereiro',
	'Mar': 'Março',
	'Apr': 'Abril',
	'May': 'Maio',
	'Jun': 'Junho',
	'Jul': 'Julho',
	'Aug': 'Agosto',
	'Sep': 'Setembro',
	'Oct': 'Outubro',
	'Nov': 'Novembro',
	'Dec': 'Dezembro',
	
	'at-time': 'a',
	
	'error-dropping-image': 'Escolha um formato de imagem válido e tente novamente',
	
	'invalid-username': 'Digite um usuário válido Twitter.com',
	'invalid-password': 'Digite uma senha válida Twitter.com',
	
	'what-he-doing': 'O que você está fazendo?',
	
	'groups-empty': '<br /><center><strong><span style="font-size: 12px; color: black">Você não criou nenhum grupo ainda.</span></strong><br /> Use o "Novo Grupo", na barra superior<br /> ou clique no botão abaixo para criar um novo grupo de amigos.<br /><br /><div class="button3 new-group-button" style="width: 80px">Novo Grupo</div></center><br />',
	'friends-empty': 'Você não adicionou amigos ou um erro ocorreu ao tentar importar informações.',
	'followers-empty': 'Você não tem fãs ou um erro ocorreu ao tentar importar informações.',
	'timeline-empty': 'O cache do cronograma está vazio ou um erro ocorreu ao tentar importar informações.',
	'mentions-empty': 'O cache entradas estão vazias ou um erro ocorreu ao tentar importar informações.',
	
	'contacts': 'Contactos',
	
	'selectbox-groups-all': 'Atualizações de todos os meus amigos',
	'selectbox-groups-only': 'Mostrar apenas atualizações do grupo ',
	
	'chatting-with': 'Conversa com',
	
	'previous-page': 'Pag. Anterior',
	'next-page': 'Próxima Pag.',
	
	'reply': 'Responder',
	'retweet': 'Retweet',
	'delete': 'Excluir',
	'says': 'diz',
	'posted-on': 'Feito em',
	'with': 'com'
}