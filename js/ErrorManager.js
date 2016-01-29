/*jslint browser:true */
/*global
$
 */
function ErrorManager() {
    'use strict';
    var code = 'error_code',
        mess = 'message',
        where = 'where';
    /**
     * Display error(s) provide(s) in parameter
     * @errors {Object - Array}
     * @return {void}
     */
    this.display = function (errors) {

        var div = document.createElement('div'), res = '';
        div.classList.add('modal', 'fade');
        div.setAttribute('id', 'error-modal');
        div.setAttribute('tabindex', '-1');
        div.setAttribute('role', 'dialog');
        div.setAttribute('aria-labelledby', 'myModalLabel');
        $(errors.error).each(function () {
            res += '<tr><td>' + this[code] + '</td><td>' + this[mess] + '</td><td>' + this[where] + '</td></tr>';
        });
        var table = '<table class="table" id="error-table"><thead><th>Code</th><th>Message</th><th>Where</th></thead>' + res + '</table>';
        div.innerHTML = '<div class="modal-dialog" role="document"><div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">;</span></button> <h4 class="modal-title myModalLabel">Errors</h4> </div> <div class="modal-body">' + table + '<br/> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">OK</button> </div> </div> </div>';
        $(div).modal('show');
    };
}

