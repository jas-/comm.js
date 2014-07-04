/**
 * Description: Handles AJAX, XDR, WS & WSS protocols
 *
 * Fork me @ https://www.github.com/jas-/comm.js
 *
 * Author: Jason Gerfen <jason.gerfen@gmail.com>
 * License: GPL (see LICENSE)
 */
(function (window, undefined) {

  'use strict';

  var comm = comm || function (obj, cb) {

    /**
     * @object defaults
     * @abstract Default set of options for plug-in
     *
     * @param {Boolean} async Default to async communication
     * @param {Mixed} data String/Boolean/Object
     * @param {Integer} interval Seconds before connection retry
     * @param {String} method Method of communication (GET, PUT, POST, DELETE)
     * @param {Integer} timeout Timeout in miliseconds
     * @param {String} url Specified URL param
     */
    var defaults = {
      async: true,
      data: false,
      interval: 3600,
      method: 'get',
      timeout: 10,
      url: ''
    };

    /**
     * @method setup
     * @scope private
     * @abstract Initial setup routines
     */
    var setup = setup || {

      /**
       * @function init
       * @scope private
       * @abstract Push to decision maker
       *
       * @param {Object} obj Plug-in option object
       * @param {Object} cb Callback function
       *
       */
      init: function (obj, cb) {
        comm.handle(obj, cb);
      }
    };

    /**
     * @method comm
     * @scope private
     * @abstract Communication methods
     */
    var comm = comm || {

      /**
       * @function online
       * @scope private
       * @abstract Detect current connection status
       *
       * @returns {Boolean}
       */
      online: function () {
        return navigator.onLine;
      },

      /**
       * @function handle
       * @scope private
       * @abstract Handles retry attempts
       *
       * @param {Object} obj Application defaults
       * @param {Function} cb Callback function
       */
      handle: function (obj, cb) {
        if (!this.online()) {
          var id = setInterval(function (obj, cb) {
            this.mode(obj, cb);
          }, obj.interval);
        }

        this.mode(obj, cb);

        clearInterval(id);
      },

      /**
       * @function mode
       * @scope private
       * @abstract Determine mode of communication
       *
       * @param {Object} obj Application defaults
       * @param {Function} cb Callback function
       *
       * @returns {Function}
       */
      mode: function (obj, cb) {
        var regex = new RegExp(document.location.href);

        if ((/msie/i.test(navigator.userAgent)) &&
          (/^(http|https):\/\//i.test(obj.url)) &&
          (!regex.test(obj.url))) {
          this.xdr(obj, cb);
        }

        if (/^(ws|wss):\/\//i.test(obj.url)) {
          this.websocket(obj, cb);
        }

        this.ajax(obj, cb);
      },


      /**
       * @function websocket
       * @scope private
       * @abstract Perform get/send of remote objects using websockets
       *
       * @param {Object} obj Application defaults
       *
       * @returns {String|Object}
       */
      websocket: function (obj, cb) {
        var ret = false,
          socket = new WebSocket(obj.url);

        socket.onopen = function () {
          try {
            socket.send(obj.data);
          } catch (exception) {
            cb(exception);
          }
        };

        socket.onmessage = function (msg) {
          ret = msg.data;
          socket.close();
        };

        cb(null, ret);
      },

      /**
       * @function xdr
       * @scope private
       * @abstract Perform get/send of remote objects using MS XDR
       *
       * @param {Object} obj Application defaults
       *
       * @returns {String|Object}
       */
      xdr: function (obj, cb) {
        var ret = false;

        if (!window.XDomainRequest)
          cb('XDomainRequest object not found');

        var xdr = new XDomainRequest();
        xdr.timeout = obj.timeout;
        xdr.open(obj.method, obj.url);

        xdr.onsuccess = function (response) {
          ret = response;
        };

        xdr.onerror = function (exception) {
          cb(exception);
        };

        xdr.send(obj.data);

        cb(null, ret);
      },

      /**
       * @function ajax
       * @scope private
       * @abstract Perform get/send of remote objects
       *
       * @param {Object} obj Application defaults
       *
       * @returns {String|Object}
       */
      ajax: function (obj, cb) {
        var ret = false,
          xhr = new XMLHttpRequest(),
          reg = new RegExp(document.location.href);

        function error(err) {
          cb(obj.errcallback(err.status));
        }

        function handler() {
          if (this.readyState == 4 && this.status == 200) {
            cb(null, this.responseText);
          }
        }

        function headers() {
          if (/put|post/.test(obj.method))
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

          if (!reg.test(obj.url))
            xhr.withCredentials = true;

          if (libs.parse(obj.data)) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            obj.data = JSON.stringify(obj.data);
          }
        }

        xhr.onreadystatechange = handler;
        xhr.open(obj.method, obj.url, obj.async);
        headers();
        xhr.send(obj.data);
      }
    };

    /**
     * @method libs
     * @scope private
     * @abstract Miscellaneous helper libraries
     */
    var libs = libs || {

      /**
       * @function merge
       * @scope private
       * @abstract Perform preliminary option/default object merge
       *
       * @param {Object} defaults Application defaults
       * @param {Object} obj User supplied object
       *
       * @returns {Object}
       */
      merge: function (defaults, obj) {
        defaults = defaults || {};

        for (var item in defaults) {
          if (defaults.hasOwnProperty(item)) {
            obj[item] = (/object/.test(typeof (defaults[item]))) ?
              this.merge(obj[item], defaults[item]) : defaults[item];
          }
          obj[item] = defaults[item];
        }

        return obj;
      },


      /**
       * @function parse
       * @scope private
       * @abstract Attempt to parse a JSON object
       *
       * @param {String} str String to test
       *
       * @returns {Boolean}
       */
      parse: function (str) {
        var ret = false;
        try {
          (/object/.test(str)) ? JSON.parse(str): JSON.stringify(str);
        } catch (e) {
          ret = true;
        }
        return ret;
      }
    };

    /**
     * @function init
     * @scope public
     * @abstract Handles options and begins communications
     */
    var init = function () {
      cb = cb || obj;

      var opts = libs.merge(obj, defaults);

      setup.init(opts, cb);
    }();

  };

  /* comm.js, do work */
  window.comm = comm;

})(window);
