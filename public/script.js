(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
module.exports={
	"calendar": "m 4.5148419,-4.5622183 -1,0 c 0,0 0,-1 -1,-1 -1,0 -1,1 -1,1 l -2.00000003,0 c 0,0 0,-1 -0.99999997,-1 -1,0 -1,1 -1,1 l -1,0 c -0.5,0 -1,0.5 -1,1 l 0,7 c 0,0.5 0.5,1 1,1 l 8,0 c 0.5,0 1,-0.5 1,-1 l 0,-7 c 0,-0.5 -0.5,-1 -1,-1 z m 0,8 -8,0 0,-5 8,0 0,5 z",
	"bike": "M 4.425,1.4392713 3,-4.9357287 c -0.075,-0.375 -0.375,-0.6 -0.75,-0.6 l -3,0 0,1.5 2.4,0 0.525,2.25 -5.175,0 c -0.45,0 -0.75,0.3 -0.75,0.75 l 0,1.57499998 c -1.275,0.3 -2.25,1.50000002 -2.25,2.92500002 0,1.65 1.35,3 3,3 1.65,0 3,-1.35 3,-3 0,-1.425 -0.975,-2.55000002 -2.25,-2.92500002 l 0,-0.825 4.725,0 0.375,1.57500002 c -1.2,0.225 -2.1,1.275 -2.1,2.55 0,1.425 1.2,2.625 2.625,2.625 1.425,0 2.625,-1.2 2.625,-2.625 0,-1.05 -0.675,-2.025 -1.575,-2.4 z m -5.925,2.025 c 0,0.825 -0.675,1.5 -1.5,1.5 -0.825,0 -1.5,-0.675 -1.5,-1.5 0,-0.825 0.675,-1.5 1.5,-1.5 0.825,0 1.5,0.675 1.5,1.5 z m 4.875,1.5 c -0.6,0 -1.125,-0.525 -1.125,-1.125 0,-0.6 0.525,-1.125 1.125,-1.125 0.6,0 1.125,0.525 1.125,1.125 0,0.6 -0.525,1.125 -1.125,1.125 z m -8.625,-9 3,0 0,1.5 -3,0 0,-1.5 z",
	"walk": "m -4.6823126,2.6576438 c 0,0 -0.7896778,-2.03525582 -0.7896778,-3.8044866 0,-1.7692307 1.0214286,-2.9230769 2.2785714,-2.9230769 1.257143,0 2.27857159,1.1538462 2.27857159,2.9230769 0,1.38461548 -0.62460799,1.57371738 -0.62460799,3.8044866 l -3.1428572,0 z m 1.7246079,3.733975 c -1.1785714,0 -2.1214285,-1 -1.8857142,-2.153846 l 0.1571428,-0.615385 3.1428572,0 c 0.3928572,1.615385 -0.078571,2.769231 -1.4142858,2.769231 z m 7.4099905,-5.0599799 -3.1428571,0 c 0,-2.23076926 -0.33856196,-2.6323279 -0.33856196,-4.0169432 0,-1.7692307 1.02142856,-2.9230769 2.27857146,-2.9230769 1.2571428,0 2.2785714,1.1538462 2.2785714,2.9230769 0,1.76923074 -1.0757238,4.0169432 -1.0757238,4.0169432 z M 2.6002517,5.3007098 c -1.2701697,0 -1.71846476,-1.363636 -1.3448855,-3.2727274 l 2.9886344,0 0.1494317,0.7272724 c 0.2241473,1.363637 -0.6724427,2.545455 -1.7931806,2.545455 z"
}

},{}],3:[function(require,module,exports){
module.exports=[{"month_id":12,"month_name":"December","walk":186,"bike":6453},{"month_id":11,"month_name":"November","walk":199,"bike":6503},{"month_id":10,"month_name":"October","walk":321,"bike":7524},{"month_id":9,"month_name":"September","walk":752,"bike":8626},{"month_id":8,"month_name":"August","walk":1614,"bike":10348},{"month_id":7,"month_name":"July","walk":1863,"bike":9335},{"month_id":6,"month_name":"June","walk":1080,"bike":8321},{"month_id":5,"month_name":"May","walk":1063,"bike":10029},{"month_id":4,"month_name":"April","walk":636,"bike":8515},{"month_id":3,"month_name":"March","walk":353,"bike":7562},{"month_id":2,"month_name":"February","walk":296,"bike":5936},{"month_id":1,"month_name":"January","walk":170,"bike":7446}]

},{}],4:[function(require,module,exports){
var xml = require('xml-string')
var header = require('./views/header')
var table = require('./views/table')


module.exports = function(app) {
	var page = xml.create('div')
	header(app, page)
	if(!app.state.mobile) {
		table(app, page)
	} else if(app.state.mobileView === 'list') {
		table(app, page)
	}

	document.getElementById('root').innerHTML = page.outer()
}

},{"./views/header":5,"./views/table":6,"xml-string":8}],5:[function(require,module,exports){
module.exports = function(app, page) {
	var header = page.c('div').a({ id: 'header' })
	header.c('h1').d('Traffic census')
	if(app.state.mobile) {
		var btns = header.c('div').a({ id: 'header-btns' })
		btns.c('button').a({ id: 'header-btn-list' }).d('List')
		btns.c('button').a({ id: 'header-btn-graph' }).d('Graph')	
	}
}

},{}],6:[function(require,module,exports){
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

},{"../../data/icons.json":2}],7:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter
var data = require('./data/months.json')
var render = require('./lib/render')

var evt = new EventEmitter()
var app = new App(evt, data, render)
window.onload = function() { app.evt.emit('resize') }
window.onresize = function() { app.evt.emit('resize') }

function App(evt, data, render) {
	var o = this
	o.evt = evt
	o.state = {
		screen: [],
		mobile: false,
		mobileView: 'list'
	}
	o.data = data
	o.colors = {
		darkBlue: '#003b5c',
		lightBlue: '#3f7397',
		red: '#ff5555',
		darkGray: '#666666',
		lightGray: '#bbbbbb'
	}
	o.render = function() {
		render(o)
	}
	o.evt.on('resize', function() {
		console.log('EVENT resize')
		o.state.screen = [window.innerWidth, window.innerHeight]
		if(o.state.screen[0] < 600) { o.state.mobile = true }
		else { o.state.mobile = false }
		o.render()
	})
	o.evt.on('toggle-mobile-view', function() {
		console.log('EVENT toggle-mobile-view')
		if(o.state.mobileView === 'list') { o.state.mobileView = 'graph' }
		else { o.state.mobileView = 'list' }
		o.render()
	})
}

},{"./data/months.json":3,"./lib/render":4,"events":1}],8:[function(require,module,exports){
var El = require('./lib/El')

exports.create = function(el) {
	var element = new El(el)
	return element
}

},{"./lib/El":9}],9:[function(require,module,exports){
module.exports = function(el) {
	var element = new El(el)
	return element
}

function El(el) {
	var self = this
	self.el = el

	self.childs = []
	self.child = function(childEl) {
		var newChild = new El(childEl)
		self.childs.push(newChild)
		return newChild
	}
	self.c = function(childEl) {
		return self.child(childEl)
	}

	self.attrs = {}
	self.attr = function(o) { 
		self.attrs = o
	 return self 
	}
	self.a = function(o) {
		return self.attr(o)
	}

	self.content = undefined
	self.data = function(x) {
		self.content = x
	}
	self.d = function(x) {
		self.content = x
	}

	self.inner = function() {
		var str = ''
		self.childs.forEach(function(child) {
			str = str + child.outer()
		})	
		return str	
	}
	self.outer = function() {
		var str = '<' + self.el + attrString(self.attrs) + '>'
		if(self.content !== undefined) {
			str = str + self.content
		}
		str = str	+ self.inner() + '</' + self.el + '>'
		return str
	}
	return self
}

function attrString(o) {
	var str = ''
	for(k in o) {
		str = str + ' ' + k + '="' + o[k] + '"'
	}
	return str
}

},{}]},{},[7]);
