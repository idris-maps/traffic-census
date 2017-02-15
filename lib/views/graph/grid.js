module.exports = function(svg, svgWidth, yScale, color) {
	var data = [3000, 6000, 9000, 12000]
	var gLines = svg.c('g').a({ 
		id: 'grid-lines',
		stroke: color,
		'stroke-dasharray': '1,4',
	})
	var gText = svg.c('g').a({
		id: 'grid-text',
		fill: color,
		'font-size': 12,
		transform: 'translate(5, -2)'
	})
	
	data.forEach(function(d) {
		var y = yScale(d)
		gLines.c('line').a({
			x1: 0, x2: svgWidth,
			y1: y, y2: y
		})
		gText.c('text').a({
			x: 0, y: y
		}).d(toText(d))
	})
}

function toText(n) {
	var t = n.toString().split('000')[0]
	return t + '\'000'
}
