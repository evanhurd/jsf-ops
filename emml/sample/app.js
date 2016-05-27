function T59682F00() {
    var $DocumentScope = new DocumentScope();
    $DocumentScope.$Template = function ($DocumentScope) {
        $DocumentScope.$defineNode('T59682F00', 'DOCUMENTNODE', null, {});
        var color = 'red';
        try {
            $DocumentScope.$defineNode('T6553F100', 'DIV', 'T59682F00', {
                'STYLE': 'color:' + color,
                'ONCLICK': 'color=\'blue\';'
            });
            $DocumentScope.$defineNode('T6B49D200', 'TEXTNODE', 'T6553F100', { 'VALUE': 'Click Me! ' + color });
        } catch (err) {
            $DocumentScope.throw(err, 5, 53);
        }
    };
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home', 'sidebar', T59682F00);
function T77359400() {
    var $DocumentScope = new DocumentScope();
    $DocumentScope.$Template = function ($DocumentScope) {
        $DocumentScope.$defineNode('T77359400', 'DOCUMENTNODE', null, {});
        try {
            $DocumentScope.$defineNode('T7D2B7500', 'DIV', 'T77359400', {});
            var a = '1 ' + test;
            if (1 == 1) {
                try {
                    $DocumentScope.$defineNode('T8F0D1800', 'DIV', 'T89173700', {});
                    $DocumentScope.$defineNode('T9502F900', 'TEXTNODE', 'T8F0D1800', { 'VALUE': 'Hello World' });
                } catch (err) {
                    $DocumentScope.throw(err, 12, 8);
                }
            }
            for (var i = 0; i <= 10; i++) {
                $DocumentScope.$defineNode('TA0EEBB00', 'TEXTNODE', 'T9AF8DA00', { 'VALUE': '\r\n\t\t\t' + i + '\r\n\t\t' });
            }
            try {
                $DocumentScope.$defineNode('TA6E49C00', 'DIV', 'T7D2B7500', {});
                try {
                    $DocumentScope.$defineNode('TACDA7D00', 'DIV', 'TA6E49C00', {});
                    try {
                        $DocumentScope.$defineNode('TB2D05E00', 'DIV', 'TACDA7D00', {});
                        try {
                            $DocumentScope.$defineNode('TB8C63F00', 'DIV', 'TB2D05E00', {});
                            try {
                                $DocumentScope.$defineNode('TBEBC2000', 'DIV', 'TB8C63F00', {});
                                try {
                                    $DocumentScope.$defineNode('TC4B20100', 'DIV', 'TBEBC2000', {});
                                    try {
                                        $DocumentScope.$defineNode('TCAA7E200', 'DIV', 'TC4B20100', {});
                                        try {
                                            $DocumentScope.$defineNode('TD09DC300', 'DIV', 'TCAA7E200', {});
                                            try {
                                                $DocumentScope.$defineNode('TD693A400', 'DIV', 'TD09DC300', {});
                                                try {
                                                    $DocumentScope.$defineNode('TDC898500', 'DIV', 'TD693A400', {});
                                                    try {
                                                        $DocumentScope.$defineNode('TE27F6600', 'DIV', 'TDC898500', {});
                                                        try {
                                                            $DocumentScope.$defineNode('TE8754700', 'DIV', 'TE27F6600', {});
                                                            try {
                                                                $DocumentScope.$defineNode('TEE6B2800', 'DIV', 'TE8754700', {});
                                                                $DocumentScope.$defineNode('TF4610900', 'TEXTNODE', 'TEE6B2800', { 'VALUE': 'test' });
                                                            } catch (err) {
                                                                $DocumentScope.throw(err, 21, 63);
                                                            }
                                                        } catch (err) {
                                                            $DocumentScope.throw(err, 21, 58);
                                                        }
                                                    } catch (err) {
                                                        $DocumentScope.throw(err, 21, 53);
                                                    }
                                                } catch (err) {
                                                    $DocumentScope.throw(err, 21, 48);
                                                }
                                            } catch (err) {
                                                $DocumentScope.throw(err, 21, 43);
                                            }
                                        } catch (err) {
                                            $DocumentScope.throw(err, 21, 38);
                                        }
                                    } catch (err) {
                                        $DocumentScope.throw(err, 21, 33);
                                    }
                                } catch (err) {
                                    $DocumentScope.throw(err, 21, 28);
                                }
                            } catch (err) {
                                $DocumentScope.throw(err, 21, 23);
                            }
                        } catch (err) {
                            $DocumentScope.throw(err, 21, 18);
                        }
                    } catch (err) {
                        $DocumentScope.throw(err, 21, 13);
                    }
                } catch (err) {
                    $DocumentScope.throw(err, 21, 8);
                }
            } catch (err) {
                $DocumentScope.throw(err, 19, 7);
            }
        } catch (err) {
            $DocumentScope.throw(err, 1, 6);
        }
    };
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home.button', 'sidebar', T77359400);