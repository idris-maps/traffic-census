var icon = require('../../data/icons.json')
var getData = require('./graph/get-data')
var icons = require('./graph/icons')
var points = require('./graph/points')
var lines = require('./graph/lines')

module.exports = function(app, page) {
	var div = page.c('div').a({ id: 'graph' })
	var data = getData(app)
	var svg = div.c('svg').a({
		width: data.svg.width,
		height: data.svg.height
	})
	icons(app, svg, icon, data)
	points(svg, data.xy.bike, 'bike', app.color.lightBlue)
	points(svg, data.xy.walk, 'walk', app.color.red)
	lines(svg, data.xy.bike, 'bike', app.color.lightBlue)
	lines(svg, data.xy.walk, 'walk', app.color.red)
}




