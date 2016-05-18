function T77359400() {
    var $DocumentScope = new DocumentScope();
    $DocumentScope.$defineNode('T77359400', 'DOCUMENTNODE', null, {});
    $DocumentScope.$defineNode('TB2D05E00', 'DIV', 'T77359400', {
        'STYLE': 'color:${color}',
        'ONCLICK': 'color=\'blue\';'
    });
    $defineNode('TEE6B2800', 'TEXTNODE', 'TB2D05E00', { 'VALUE': 'Click Me! ${color}' });
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home', 'sidebar', T77359400);
function T165A0BC00() {
    var $DocumentScope = new DocumentScope();
    $DocumentScope.$defineNode('T165A0BC00', 'DOCUMENTNODE', null, {});
    $DocumentScope.$defineNode('T1A13B8600', 'DIV', 'T165A0BC00', {});
    var a = '1 ${test}';
    if (1 == 1) {
        $DocumentScope.$defineNode('T3B9ACA00', 'DIV', 'T218711A00', {});
        $defineNode('T4190AB00', 'TEXTNODE', 'T3B9ACA00', { 'VALUE': 'Hello World' });
    }
    for (var i = 0; i <= 10; i++) {
        $defineNode('T4D7C6D00', 'TEXTNODE', 'T47868C00', { 'VALUE': '\n\t\t\t${i}\n\t\t' });
    }
    $DocumentScope.$defineNode('T53724E00', 'DIV', 'T1A13B8600', {});
    $DocumentScope.$defineNode('T59682F00', 'DIV', 'T53724E00', {});
    $DocumentScope.$defineNode('T5F5E1000', 'DIV', 'T59682F00', {});
    $DocumentScope.$defineNode('T6553F100', 'DIV', 'T5F5E1000', {});
    $DocumentScope.$defineNode('T6B49D200', 'DIV', 'T6553F100', {});
    $DocumentScope.$defineNode('T713FB300', 'DIV', 'T6B49D200', {});
    $DocumentScope.$defineNode('T77359400', 'DIV', 'T713FB300', {});
    $DocumentScope.$defineNode('T7D2B7500', 'DIV', 'T77359400', {});
    $DocumentScope.$defineNode('T83215600', 'DIV', 'T7D2B7500', {});
    $DocumentScope.$defineNode('T89173700', 'DIV', 'T83215600', {});
    $DocumentScope.$defineNode('T8F0D1800', 'DIV', 'T89173700', {});
    $DocumentScope.$defineNode('T9502F900', 'DIV', 'T8F0D1800', {});
    $DocumentScope.$defineNode('T9AF8DA00', 'DIV', 'T9502F900', {});
    $defineNode('TA0EEBB00', 'TEXTNODE', 'T9AF8DA00', { 'VALUE': 'test' });
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home.button', 'sidebar', T165A0BC00);