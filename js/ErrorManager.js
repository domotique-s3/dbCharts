/*jslint browser:true */
/*global
$
 */
function ErrorManager() {
    'use strict';
    var code = 'code',
        key = 'key',
        message = 'message',
        error_type = 'type';
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
        $(errors.errors).each(function () {
            var type;
            if(this[error_type] === undefined) {type = 'value';}
            else {type = this[error_type];}
            res += '<tr><td class="type">'+type+'</td><td class="code">' + this[code] + '</td><td class="key">' + this[key] + '</td><td class="message">' + this[message] + '</td></tr>';
        });
        var table = '<table class="table" id="error-table"><thead><th>Type</th><th>Code</th><th>Key</th><th>Message</th></thead>' + res + '</table>';
        div.innerHTML = '<div class="modal-dialog" role="document"><div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">;</span></button> <h4 class="modal-title myModalLabel" style="color: red;font-weight: bold">Errors</h4> </div> <div class="modal-body">' + table + '<br/> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">OK</button> </div> </div> </div>';
        $(div).modal('show');
    };
}

