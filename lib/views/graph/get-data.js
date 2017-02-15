var d3 = require('d3-scale')

module.exports = function(app) {
	// SVG size
	if(app.state.mobile) { 
		var headerHeight = 102
		var listWidth = 2 
	} else { 
		var headerHeight = 73 
		var listWidth = 320
	}
	var svgWidth = app.state.screen[0] - listWidth
	var svgHeight = app.state.screen[1] - headerHeight - 5

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
		xy: { bike: bikeXY, walk: walkXY },
		scale: { x: x, y: y }
	}
}
