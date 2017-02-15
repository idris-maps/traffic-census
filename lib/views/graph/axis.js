module.exports = function(svg, app, svgSize, scale, color) {
	var g = svg.c('g').a({ 
		id: 'x-axis',
		transform: 'translate(0, ' + scale.y(-500) + ')'
	})
	g.c('line').a({
		x1: 0, x2: svgSize.width, y1: 0, y2: 0, stroke: color
	})
	app.data.forEach(function(d, i) {
		var n = d.month_name[0] + d.month_name[1] + d.month_name[2]
		var x = scale.x(d.month_id)
		var y = 5
		g.c('line').a({
			x1: x, x2: x, y1: 0, y2: y, stroke: color
		})
		if(app.state.mobile) {
			if(i === 0 || i === app.data.length-1) { text(g, x, y, n, color) }
		} else {
			text(g, x, y, n, color)
		}
	})
}

function text(g, x, y, n, color) {
	g.c('text').a({
		x: x, y: y + 10, fill: color, 'font-size': 10, 'text-anchor': 'middle'
	}).d(n)
}
