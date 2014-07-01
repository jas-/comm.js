# comm.js #

Handles XHR, XDR, WS & WSS protocols

Fork me @ https://www.github.com/jas-/comm.js

## Options ##
* _url_ - If not specified the current page location is used
* _method_ - The method to use (post, put, delete etc)
* _data_ - The data to be processed
* _callback_ - If you wish to perform additional operations with returned data
* _precallback_ - Here you can perform some pre-processing if need be
* _errcallback_ - Handle errors with this callback

## Examples ##
Here are a couple of examples

### Default use ###
The default use case

```javascript
comm();
```

### Debugging support ###
To enable debugging output

```javascript
comm({
  debug: true
});
```

### Force ws/wss communications ###
Here is how you can use the websocket or secure web socket protocls

```javascript
comm({
	url: 'ws://echo.websocket.org'
});
```

## A note on XDR ##
This is the least tested protocol this library supports. It will only be used
when the clients browser is internet explorer has access to the `window.XDomainRequest`
object and if the URL specified does not match the current window.

## A note on CORS ##
If you wish to use this for CORS requests which it does support you must configure your web server to allow the following header params.
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Cache-Control, Content-MD5, Content-Type, X-Alt-Referer, X-Requested-With
Access-Control-Allow-Credentials: true
```
