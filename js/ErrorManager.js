/*jslint browser:true */
/*global
$
 */
function ErrorManager() {
    'use strict';
    var code = 'code',
        field = 'field',
        message = 'message',
        error_type = 'type';

    this.createModal = function(content){
        var div = document.createElement('div');
        div.classList.add('modal', 'fade');
        div.setAttribute('id', 'error-modal');
        div.setAttribute('tabindex', '-1');
        div.setAttribute('role', 'dialog');
        div.setAttribute('aria-labelledby', 'myModalLabel');   

        div.innerHTML = '<div class="modal-dialog" role="document"><div class="modal-content"> <div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>' +
                        '<h4 class="modal-title myModalLabel" style="color: red;font-weight: bold">Errors</h4> ' + 
                        ' </div> <div style="word-wrap: break-word;" class="modal-body">' + 
                        content + 
                        '<br/> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">OK</button> </div> </div> </div>';
        
        $(div).modal('show');
    };


    /**
     * Display error(s) provide(s) in parameter
     * @errors {Object - Array}
     * @return {void}
     */
    this.display = function (errors) {
        if(errors !== null && errors !== undefined){
            var res = '';
            $(errors).each(function () {
                var type;
                var key;
                if(this[error_type] === undefined) {type = 'value';}
                else {type = this[error_type];}

                if(this[field] === undefined) {key = '';}
                else {key = this[field];}

                res += '<tr><td class="type">'+type+'</td><td class="code">' + this[code] + '</td><td class="key">' + key + '</td><td class="message">' + this[message] + '</td></tr>';
            });

            var table = '<table class="table" id="error-table"><thead><th>Type</th><th>Code</th><th>Field</th><th>Message</th></thead>' + res + '</table>';

            this.createModal(table);
        }
    };

}

