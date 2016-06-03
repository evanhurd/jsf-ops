function T6553F100() {
    $DocumentScope.$Template = function ($DocumentScope) {
        {
            $DocumentScope.$defineNode('T6553F100', 'DOCUMENTNODE', null, {});
        }
        try {
            {
                $DocumentScope.$defineNode('T6B49D200', 'APPENDTO', 'T6553F100', { 'ELEMENT': 'body' });
            }
            $DocumentScope.$setValue('color', 'red');
            try {
                {
                    function T77359400_EVENT_ONCLICK() {
                        $DocumentScope.$setValue('color', 'blue');
                    }
                    $DocumentScope.$defineNode('T77359400', 'DIV', 'T6B49D200', {
                        'STYLE': 'color:' + color,
                        'ONCLICK': T77359400_EVENT_ONCLICK
                    });
                }
                {
                    $DocumentScope.$defineNode('T7D2B7500', 'TEXTNODE', 'T77359400', { 'VALUE': 'Click Me!' });
                }
            } catch (err) {
                $DocumentScope.throw(err, 4, 56);
            }
            try {
                {
                    $DocumentScope.$defineNode('T83215600', 'DIV', 'T6B49D200', {});
                }
                {
                    $DocumentScope.$defineNode('T89173700', 'TEXTNODE', 'T83215600', { 'VALUE': '\n\t\t\tHello World\t\t\n\t\t' });
                }
            } catch (err) {
                $DocumentScope.throw(err, 6, 7);
            }
        } catch (err) {
            $DocumentScope.throw(err, 1, 26);
        }
    };
    return $DocumentScope;
}
DocumentScope.$NameSpace('app.views.home', 'sidebar', T6553F100);