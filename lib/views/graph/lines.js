module.exports = function(svg, coords, cl, color) {
	var g = svg.c('g').a({ 
		id: 'lines-' + cl,
		stroke: color
	})

	coords.forEach(function(d,i) {
		if(i !== 0) {
			var prev = coords[i-1]
			g.c('line').a({
				x1: prev[0], y1: prev[1],
				x2: d[0], y2: d[1]
			})
		}
	})
}
