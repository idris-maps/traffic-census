var icon = require('../../data/icons.json')

module.exports = function(app, page) {
	var table = page.c('div').a({ id: 'table' })
	head(table, icon)
	body(table, app.data)
}

function body(table, data) {
	data.forEach(function(d) {
		var tr = table.c('div').a({ 'class': 'table-line' })
		tr.c('div').a({ 'class': 'table-cell table-cell-0' }).d(d.month_name)
		tr.c('div').a({ 'class': 'table-cell table-cell-1' }).d(d.bike)
		tr.c('div').a({ 'class': 'table-cell table-cell-2' }).d(d.walk)
	})

}

function head(table, icon) {
	var tr = table.c('div').a({ id: 'table-head' })
	var data = [
		[icon.calendar, 'DATE'],
		[icon.bike, 'CYCLISTS'],
		[icon.walk, 'PEDESTRIANS']
	]
	data.forEach(function(d) {
		var td = tr.c('div').a({ 'class': 'table-cell table-cell-head' })
		var svgSpan = td.c('span').a({ 'class': 'table-head-icon' })
		var svg = svgSpan.c('svg').a({ width: 12, height: 12 })
		svg.c('path').a({ transform: 'translate(6,6)', d: d[0] })
		td.c('span').a({ 'class': 'table-head-title' }).d(d[1])
	})
}
