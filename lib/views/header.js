module.exports = function(app, page) {
	var header = page.c('div').a({ id: 'header' })
	header.c('h1').d('Traffic census')
	if(app.state.mobile) {
		var btns = header.c('div').a({ id: 'header-btns' })
		var clList = 'current'
		var clGraph = ''
		if(app.state.mobileView === 'graph') { var clList = ''; var clGraph = 'current' }
		btns.c('button').a({ id: 'header-btn-list', 'class': clList }).d('List')
		btns.c('button').a({ id: 'header-btn-graph', 'class': clGraph }).d('Graph')	
	}
}
