var icon = require('../../data/icons.json')
var getData = require('./graph/get-data')
var icons = require('./graph/icons')
var points = require('./graph/points')
var lines = require('./graph/lines')
var grid = require('./graph/grid')

module.exports = function(app, page) {
	var div = page.c('div').a({ id: 'graph' })
	var data = getData(app)
	var svg = div.c('svg').a({
		width: data.svg.width,
		height: data.svg.height
	})
	icons(app, svg, icon, data)
	grid(svg, data.svg.width, data.scale.y, app.color.lightGray)
	points(svg, data.xy.bike, 'bike', app.color.lightBlue)
	points(svg, data.xy.walk, 'walk', app.color.red)
	lines(svg, data.xy.bike, 'bike', app.color.lightBlue)
	lines(svg, data.xy.walk, 'walk', app.color.red)
}




