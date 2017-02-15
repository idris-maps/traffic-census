var xml = require('xml-string')
var header = require('./views/header')
var table = require('./views/table')


module.exports = function(app) {
	var page = xml.create('div')
	header(app, page)
	if(!app.state.mobile) {
		table(app, page)
	} else if(app.state.mobileView === 'list') {
		table(app, page)
	}

	document.getElementById('root').innerHTML = page.outer()
}
