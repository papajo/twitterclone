var nconf = require('nconf');

var path = require('path');


nconf.env()
if (nconf.get('NODE_ENV') === 'prod') {
	nconf.file(path.join(__dirname, 'config-prod.json'));
} else if (nconf.get('NODE_ENV') === 'dev') {
	nconf.file(path.join(__dirname, 'config-dev.json'));	
} else if (nconf.get('NODE_ENV') === 'test') {
	nconf.file(path.join(__dirname, 'config-test.json'));	
}




module.exports = nconf;