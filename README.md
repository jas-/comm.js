# comm.js #

Handles XHR, XDR, WS & WSS protocols

Fork me @ https://www.github.com/jas-/comm.js

## Options ##
* `url`: If not specified the current page location is used
* `method`: The method to use (post, put, delete etc)
* `data`: The data to be processed
* `timeout`: Timeout value for retries
* `interval`: Interval to use for retrying send upon connection termination

## Examples ##
Here are a couple of examples

### Default use ###
The default use case

```javascript
comm(function(err, response){
  if (err) throw err;
	console.log(response);
});
```

### Force ws/wss communications ###
Here is how you can use the websocket or secure web socket protocls

```javascript
comm({
	url: 'ws://echo.websocket.org'
}, function(err, response){
  if (err) throw err;
	console.log(response);
});
```

## A note on XDR ##
This is the least tested protocol this library supports. It will only be used
when the clients browser is internet explorer has access to the `window.XDomainRequest`
object and if the URL specified does not match the current window.

## A note on CORS ##
If you wish to use this for CORS requests which it does support you must configure your web server to allow the following header params (this example is tuned to support authentication credentials while limiting access vs. using a wildcard origin such as *)
```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Cache-Control, Content-Type
Access-Control-Allow-Credentials: true
```
