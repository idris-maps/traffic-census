module.exports = function(app, page) {
	var header = page.c('div').a({ id: 'header' })
	header.c('h1').d('Traffic census')
	if(app.state.mobile) {
		var btns = header.c('div').a({ id: 'header-btns' })
		btns.c('button').a({ id: 'header-btn-list' }).d('List')
		btns.c('button').a({ id: 'header-btn-graph' }).d('Graph')	
	}
}
