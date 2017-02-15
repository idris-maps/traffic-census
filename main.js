var EventEmitter = require('events').EventEmitter
var data = require('./data/months.json')
var render = require('./lib/render')

var evt = new EventEmitter()
var app = new App(evt, data, render)
window.onload = function() { app.evt.emit('resize') }
window.onresize = function() { app.evt.emit('resize') }

function App(evt, data, render) {
	var o = this
	o.evt = evt
	o.state = {
		screen: [],
		mobile: false,
		mobileView: 'list'
	}
	o.data = data
	o.colors = {
		darkBlue: '#003b5c',
		lightBlue: '#3f7397',
		red: '#ff5555',
		darkGray: '#666666',
		lightGray: '#bbbbbb'
	}
	o.render = function() {
		render(o)
	}
	o.evt.on('resize', function() {
		console.log('EVENT resize')
		o.state.screen = [window.innerWidth, window.innerHeight]
		if(o.state.screen[0] < 600) { o.state.mobile = true }
		else { o.state.mobile = false }
		o.render()
	})
	o.evt.on('toggle-mobile-view', function() {
		console.log('EVENT toggle-mobile-view')
		if(o.state.mobileView === 'list') { o.state.mobileView = 'graph' }
		else { o.state.mobileView = 'list' }
		o.render()
	})
}
