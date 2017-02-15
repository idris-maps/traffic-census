var xml = require('xml-string')
var header = require('./views/header')


module.exports = function(app) {
	var page = xml.create('div')
	page.a({id: 'page'})

}
