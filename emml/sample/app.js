function T53724E00() {
    var $DocumentScope = new DocumentScope();
    $DocumentScope.$defineNode('T53724E00', 'DOCUMENTNODE', null, {});
    $DocumentScope.$defineNode('T59682F00', 'DIV', 'T53724E00', {
        'STYLE': 'color:${color}',
        'ONCLICK': 'color=\'blue\';'
    });
    $DocumentScope.$defineNode('T5F5E1000', 'TEXTNODE', 'T59682F00', { 'VALUE': 'Click Me! ${color}' });
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home', 'sidebar', T53724E00);
function T6B49D200() {
    var $DocumentScope = new DocumentScope();
    $DocumentScope.$defineNode('T6B49D200', 'DOCUMENTNODE', null, {});
    $DocumentScope.$defineNode('T713FB300', 'DIV', 'T6B49D200', {});
    var a = '1 ${test}';
    if (1 == 1) {
        $DocumentScope.$defineNode('T83215600', 'DIV', 'T7D2B7500', {});
        $DocumentScope.$defineNode('T89173700', 'TEXTNODE', 'T83215600', { 'VALUE': 'Hello World' });
    }
    for (var i = 0; i <= 10; i++) {
        $DocumentScope.$defineNode('T9502F900', 'TEXTNODE', 'T8F0D1800', { 'VALUE': '\n\t\t\t${i}\n\t\t' });
    }
    $DocumentScope.$defineNode('T9AF8DA00', 'DIV', 'T713FB300', {});
    $DocumentScope.$defineNode('TA0EEBB00', 'DIV', 'T9AF8DA00', {});
    $DocumentScope.$defineNode('TA6E49C00', 'DIV', 'TA0EEBB00', {});
    $DocumentScope.$defineNode('TACDA7D00', 'DIV', 'TA6E49C00', {});
    $DocumentScope.$defineNode('TB2D05E00', 'DIV', 'TACDA7D00', {});
    $DocumentScope.$defineNode('TB8C63F00', 'DIV', 'TB2D05E00', {});
    $DocumentScope.$defineNode('TBEBC2000', 'DIV', 'TB8C63F00', {});
    $DocumentScope.$defineNode('TC4B20100', 'DIV', 'TBEBC2000', {});
    $DocumentScope.$defineNode('TCAA7E200', 'DIV', 'TC4B20100', {});
    $DocumentScope.$defineNode('TD09DC300', 'DIV', 'TCAA7E200', {});
    $DocumentScope.$defineNode('TD693A400', 'DIV', 'TD09DC300', {});
    $DocumentScope.$defineNode('TDC898500', 'DIV', 'TD693A400', {});
    $DocumentScope.$defineNode('TE27F6600', 'DIV', 'TDC898500', {});
    $DocumentScope.$defineNode('TE8754700', 'TEXTNODE', 'TE27F6600', { 'VALUE': 'test' });
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home.button', 'sidebar', T6B49D200);