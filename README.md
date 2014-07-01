# comm.js #

A jQuery plug-in to handle AJAX, XDR, WS & WSS protocols

Fork me @ https://www.github.com/jas-/comm.js

## Important ##
This plug-in is still in alpha phases of development. Currently only supports (without bugs) AJAX requests. The XDR (for clients using MSIE) & WS/WSS protocols have not been thoughly tested.

## Options ##
This plug-in also has several configurable options available for implementation:
* _appID_ - The option allows for dual functionality of CSRF support as well as an index to access locally saved keyring data
* _url_ - The URL param can be used as a substitute for the default binding to a form
* _callback_ - If you wish to perform additional operations with returned data
* _precallback_ - Here you can perform some pre-processing if need be
* _errcallback_ - Handle errors with this callback

## Example usage ##
Usage is easy. Please see these examples:

### Default ###
This example assumes `#form-id` as a valid DOM element.

```javascript
$('#form-id').comm();
```

### Custom data object ###
This example can be used as an event driven interface for custom objects.

```javascript
$(window).comm({
	url: 'https://webserver.com',
  data: {key: 'value'}
});
```

## A note on ws/wss and/or xdr protocols ##
XMLHttpRequests is the default method of communication unless the clients
browser is Internet explorer or the `url` property is prefixed with `ws` or `wss`.

## A note on CORS ##
If you wish to use this for CORS requests which it does support you must configure your web server to allow the following header params.
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Cache-Control, Content-MD5, Content-Type, X-Alt-Referer, X-Requested-With
Access-Control-Allow-Credentials: true
```
