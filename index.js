var db = require('./models/db');
var Models = require('./models/models');

db.sync({force:true});