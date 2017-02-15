var xml = require('xml-string')
var header = require('./views/header')


module.exports = function(app) {
	var page = xml.create('div')
	header(app, page)

	document.getElementById('root').innerHTML = page.outer()
}
