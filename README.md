# comm.js #

Handles XHR, XDR, WS & WSS protocols

Fork me @ https://www.github.com/jas-/comm.js

## Options ##
* `async`: Force async opterational mode
* `binary`: Force binary mode sends
* `url`: If not specified the current page location is used
* `headers`: A key/value object of headers to apply
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

### A post example ###
An example sending a post request with a JSON object

```javascript
  comm({
    method: 'post',
    data: {abc: '123', xyz: 345}
  }, function(err, res){
    if (err) throw err;
    console.log(res);
  });
```

### Force ws/wss communications ###
Here is how you can use the websocket or secure web socket protocols

```javascript
comm({
	data: 'ping test',
	url: 'ws://echo.websocket.org'
}, function(err, response){
	if (err) throw err;
	console.log(response);
});
```

### Set customized headers ###
Need to use custom headers? See [RFC-4229](http://www.ietf.org/rfc/rfc4229.txt)
for a complete list

```javascript
comm({
	headers: {
		Content-Type: 'text/plain'
	}
}, function(err, response){
	if (err) throw err;
	console.log(response);
});
```

## A note form submissions ##
To attach a form object as the payload the simpliest method would be
the following example.

```javascript
var formData = new FormData(document.getElementById('form-id'));
comm({
	data: formData
}, function(err, response){
	if (err) throw err;
	console.log(response);
});
```

## A note on XDR ##
This is the least tested protocol this library supports. It will only be used
when the clients browser is internet explorer, the version is less than 10 has
access to the `window.XDomainRequest` object and if the URL specified does not
match the current window.

## A note on CORS ##
If you wish to use this for CORS requests which it does support you must
configure your web server to allow the following header params (this example is
tuned to support authentication credentials while limiting access vs. using a
wildcard origin such as *)

```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Cache-Control, Content-Type
Access-Control-Allow-Credentials: true
```
