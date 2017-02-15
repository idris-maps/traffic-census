var xml = require('xml-string')
var header = require('./views/header')
var table = require('./views/table')
var graph = require('./views/graph')
var ctrl = require('./ctrl')

module.exports = function(app) {
	var page = xml.create('div')
	header(app, page)

	if(!app.state.mobile) {
		var content = page.c('div').a({ id: 'content' })
		table(app, content)
		graph(app, content)
	} else if(app.state.mobileView === 'list') {
		table(app, page)
	} else if(app.state.mobileView === 'graph') {
		graph(app, page)
	}

	document.getElementById('root').innerHTML = page.inner()
	if(app.state.mobile) {
		ctrl(app)
	}
}
