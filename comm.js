/**
 * Description: Handles AJAX, XDR, WS & WSS protocols
 *
 * Fork me @ https://www.github.com/jas-/comm.js
 *
 * Author: Jason Gerfen <jason.gerfen@gmail.com>
 * License: GPL (see LICENSE)
 */

(function(window, undefined){

  'use strict';

  var comm = comm || function(o){

		/**
		 * @object defaults
		 * @abstract Default set of options for plug-in
		 *
		 * @param {String} appID Unique identifier
		 * @param {String} url Specified URL param
		 * @param {Mixed} data String/Boolean/Object
		 * @param {Boolean} debug Enable or disable debugging options
		 * @param {Object} bind Element to which this plug-in is bound
		 * @param {Boolean} async Default to async communication
		 * @param {String} method Method of communication (GET, PUT, POST, DELETE)
		 * @param {Function} callback Callback function for success
		 * @param {Object} precallback Callback prior to send
		 * @param {Object} errcallback Callback on errors
		 */
		var defaults = {
			appID: 'comm.js',
			url: '',
			data: false,
			debug: false,
			async: true,
			method: 'get',
			logID: '',
			callback: function(){},
			precallback: function(){},
			errcallback: function(){}
		};

		/**
		 * @method _setup
		 * @scope private
		 * @abstract Initial setup routines
		 */
		var _setup = _setup || {

			/**
			 * @function save
			 * @scope private
			 * @abstract Primary initialization of window.crypto API
			 *
			 * @param {Object} o Plug-in option object
			 * @returns {Boolean} true/false
			 */
			init: function(o){
				this.go(o);
			},

			/**
			 * @function go
			 * @scope private
			 * @abstract Initializes request if data present
			 *
			 * @param {Object} o Plug-in option object
			 * @returns {Object}
			 */
			go: function(o){
				if (_comm.online()){
					_comm.decide(o, o.url);
				} else {
					return '{error:"Network connectivity not present"}';
				}
				return o.data;
			}
		};

		/**
		 * @method _comm
		 * @scope private
		 * @abstract Communication methods
		 */
		var _comm = _comm || {

			/**
			 * @function online
			 * @scope private
			 * @abstract Detect current connection status
			 *
			 * @returns {Boolean}
			 */
			online: function(){
				return navigator.onLine;
			},

			/**
			 * @function retry
			 * @scope private
			 * @abstract Attempts to send any non-sent requests when online status is true
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 * @param {String} c Command to send to remote storage proxy service
			 * @param {String} e The remote protocol to execute
			 *
			 * @returns {Boolean}
			 */
			retry: function(o, d, c){
				var _c = 10, _i = 0;
				var id = setInterval(function(o, d, c){
					(this.online) ? this.decide(o, d, c) : false;
				}, 3600);
				clearInterval(id);
				return true;
			},

			/**
			 * @function decide
			 * @scope private
			 * @abstract Determine mode of communication based on browser type and options
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 * @param {String} c Command to send to remote storage proxy service
			 *
			 * @returns {Function}
			 */
			decide: function(o, c){
				var _reg = new RegExp(document.location.href);

				if ((/msie/i.test(navigator.userAgent)) && (/^(http|https):\/\//i.test(o.url)) &&
						(!_reg.test(o.url))) {
					return (this.online) ? this.xdr(o, o.data, c) : this.retry(o, o.data, c);
				}

				if (/^(ws|wss):\/\//i.test(o.url)) {
					return (this.online) ? this.websocket(o, o.data, c) : this.retry(o, o.data, c);
				}

				return (this.online) ? this.ajax(o, o.data, c) : this.retry(o, o.data, c);
			},

			/**
			 * @function websocket
			 * @scope private
			 * @abstract Perform get/send of remote objects using websockets
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 *
			 * @returns {String|Object}
			 */
			websocket: function(o){
				var _r = false
					,	socket = new WebSocket(o.url);

				(o.debug) ? _log.debug(o.logID, '_comm.websocket: Status: '+socket.readyState) : false;

				socket.onopen = function() {
					try {
						socket.send(o.data);
						(o.debug) ? _log.debug(o.logID, '_comm.websocket: Sent: '+o.data) : false;
					} catch(exception) {
						_log.error(o.logID, '_comm.websocket: Error => '+exception);
					}
				}

				socket.onmessage = function(msg) {
					(o.debug) ? _log.debug(o.logID, '_comm.websocket: Receieved: '+msg.data) : false;
					_r = msg.data;
					socket.close();
				}

				socket.onclose = function() {
					(o.debug) ? _log.debug(o.logID, '_comm.websocket: Status: '+socket.readyState) : false;
				}

				return _r;
			},

			/**
			 * @function xdr
			 * @scope private
			 * @abstract Perform get/send of remote objects using MS XDR
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 * @param {String} c Command to send to remote storage proxy service (Save|Retrieve)
			 *
			 * @returns {String|Object}
			 */
			xdr: function(o, d, c){
				var _r = false;

				if (!window.XDomainRequest) {
					_log.error(o.logID, '_comm.xdr: Error => The XDR functionality for your browser was not found.');
					return false;
				}

				var xdr = new XDomainRequest();
				xdr.timeout = 100;
				xdr.open('post', o.url+'?cmd='+c);

				xdr.onsuccess = function(response){
					(o.debug) ? _log.debug(o.logID, '_libs.xdr: '+xdr.responseText) : false;
					_r = xdr.responseText;
				};

				xdr.onerror = function(exception){
					_log.error(o.logID, '_libs.xdr: Error => '+exception);
				};

				xdr.send(d);

				return _r;
			},

			/**
			 * @function ajax
			 * @scope private
			 * @abstract Perform get/send of remote objects
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 * @param {String} c Command to send to remote storage proxy service (Save|Retrieve)
			 *
			 * @returns {String|Object}
			 */
			ajax: function(o, d, c){
				var _r = false
					, _h = false
					, _xhr = false
					,	_reg = new RegExp(document.location.href);

				function _response(data) {
					_r = data.responseText;
				}

				function _error(err) {
					_r = err.status;
				}

				function _handler() {
					if (this.readyState == this.DONE && this.status == 200) {
						_response(this.responseText);
					}
				}

				function _headers(o) {
					(o.async) ?
						_xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest') :
						false;

					if (!_reg.test(o.url))
						_xhr.withCredentials = true;

					((o.precallback) && (/function/.test(typeof(o.precallback)))) ?
						o.precallback(this) : false;

					(o.debug) ?
						_log.debug(o.logID, '_comm.ajax: Set request headers') :
						false;
				}

				_xhr = new XMLHttpRequest();
				_xhr.onreadystatechange = _handler;
				_xhr.open(o.method, o.url, o.async);
				_headers(o);
				_xhr.send(/post|put/i.test(o.method)?o.data:null);

				return _r;
			}
		}

		/**
		 * @method _libs
		 * @scope private
		 * @abstract Miscellaneous helper libraries
		 */
		var _libs = _libs || {

      /**
  		 * @function merge
  		 * @scope private
  		 * @abstract Perform preliminary option/default object merge
  		 *
  		 * @param {Object} o Plug-in option object
  		 * @param {Object} d Default plug-in option object
       *
  		 * @returns {Object}
  		 */
  		merge: function(d, o){
				d = d || {};

  			for (var p in d) {
          if (d.hasOwnProperty(p)) {
            o[p] = (/object/.test(typeof(d[p]))) ?
							this.merge(o[p], d[p]) : d[p];
          }
          o[p] = d[p];
        }

				o.logID = o.appID;

        (o.debug) ? _log.debug(o.logID, '_libs.merge: Merged options') : false;

        return o;
  		}
		};

		/**
		 * @method _log
		 * @scope private
		 * @abstract Logging methods for
		 *  - debug
		 *  - info
		 *  - warn
		 *  - error
		 */
		var _log = _log || {

			/**
			 * @function debug
			 * @scope private
			 * @abstract Debugging _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 */
			debug: function(i, t){
				(/function/i.test(typeof(console.debug))) ?
					console.debug('['+i+'] (DEBUG) '+t) : false;
			},

			/**
			 * @function info
			 * @scope private
			 * @abstract Information _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 */
			info: function(i, t){
				(/function/i.test(typeof(console.info))) ?
					console.info('['+i+'] (DEBUG) '+t) : false;
			},

			/**
			 * @function warn
			 * @scope private
			 * @abstract Warning _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 */
			warn: function(i, t){
				(/function/i.test(typeof(console.warn))) ?
					console.warn('['+i+'] (DEBUG) '+t) : false;
			},

			/**
			 * @function error
			 * @scope private
			 * @abstract Error _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 */
			error: function(i, t){
				(/function/i.test(typeof(console.error))) ?
					console.error('['+i+'] (DEBUG) '+t) : false;
			}
		};

		/**
		 * @function init
		 * @scope public
		 * @abstract
		 */
		var init = function(){

			/* Merge user supplied options with defaults */
			var opts = _libs.merge(o, defaults);

			/* Initialize setup */
			if (!_setup.init(opts)) {
				return false;
			}

			return true;
		}();

	}

	/* comm.js, do work */
	window.comm = comm;

})(window);
