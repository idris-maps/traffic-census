module.exports = function(app, svg, icon, data) {
	var leg = svg.c('g').a({ 
		id: 'legend',
		transform: 'translate(' + data.svg.width/2 + ',50)',
		'font-size': 12
	})
	var bike = leg.c('g').a({
		id: 'legend-bike',
		fill: app.color.lightBlue,
		transform: 'translate(-80,0)'
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
