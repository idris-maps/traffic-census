module.exports = function(svg, coords, cl, color) {
	var r = 3
	var g = svg.c('g').a({ 
		id: 'points-' + cl,
		fill: color
	})
	coords.forEach(function(d) {
		g.c('circle').a({
			cx: d[0],
			cy: d[1],
			r: r
		})
	})
}
