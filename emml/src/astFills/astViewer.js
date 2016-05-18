var esprima = require('esprima');
var astMap = require('./astMap.js');

var js = `
function test(){ return [DOM.DIV(test + test)]};
`;

var ast = esprima.parse(js);
console.log(JSON.stringify(ast, null, 4));

var map = new astMap(ast);

//console.log(JSON.stringify(map.map.paths, null, 4));

