module.exports = function(app) {
	var list = document.getElementById('header-btn-list')
	var graph = document.getElementById('header-btn-graph')
	list.onclick = function() { app.evt.emit('toggle-mobile-view', 'list') }
	graph.onclick = function() { app.evt.emit('toggle-mobile-view', 'graph') }
}
