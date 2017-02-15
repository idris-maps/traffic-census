var d3 = require('d3-scale')
var icon = require('../../data/icons.json')

module.exports = function(app, page) {
	var div = page.c('div').a({ id: 'graph' })
	var data = getData(app)
	var svg = div.c('svg').a({
		width: data.svg.width,
		height: data.svg.height
	})
	icons(app, svg, icon, data)
	console.log(data)
}

function getData(app) {
	// SVG size
	if(app.state.mobile) { var headerHeight = 102 } else { var headerHeight = 73 }
	var svgWidth = app.state.screen[0] - 320
	var svgHeight = app.state.screen[1] - headerHeight

	// Scales
	var marginX = 10
	var marginTop = 70
	var marginBottom = 50
	var y = d3.scaleLinear()
		.domain([0, 13000])
		.range([svgHeight - marginBottom, marginTop])
	var x = d3.scaleLinear()
		.domain([1,12])
		.range([marginX, svgWidth-marginX])

	// Coordinates
	var bikeXY = []
	var walkXY = []
	app.data.forEach(function(d) {
		bikeXY.push([x(d.month_id), y(d.bike)])
		walkXY.push([x(d.month_id), y(d.walk)])
	})


	return {
		svg: { width: svgWidth, height: svgHeight },
		xy: { bike: bikeXY, walk: walkXY }
	}
}

function icons(app, svg, icon, data) {
	var leg = svg.c('g').a({ 
		id: 'legend',
		transform: 'translate(' + data.svg.width/2 + ',50)',
		'font-size': 12
	})
	var bike = leg.c('g').a({
		id: 'legend-bike',
		fill: app.color.lightBlue,
		transform: 'translate(-100,0)'
	})
	bike.c('path').a({ 
		d: icon.bike,
		transform: 'translate(0,-6)'
	})
	bike.c('text').a({
		x: 10,
		y: 0
	}).d('Cyclists')

	var walk = leg.c('g').a({
		id: 'legend-walk',
		fill: app.color.red
	})
	walk.c('path').a({ 
		d: icon.walk,
		transform: 'translate(0,-6)'
	})
	walk.c('text').a({
		x: 10,
		y: 0
	}).d('Pedestrians')
}
