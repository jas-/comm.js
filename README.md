# comm.js #

Handles AJAX, XDR, WS & WSS protocols

Fork me @ https://www.github.com/jas-/comm.js

## Important ##
Supports XMLHttpRequests, XDR (for clients using MSIE & when using CORS) as well as WS/WSS protocols.

## Options ##
* _appID_ - The option allows for dual functionality of CSRF support as well as an index to access locally saved keyring data
* _url_ - The URL param can be used as a substitute for the default binding to a form
* _callback_ - If you wish to perform additional operations with returned data
* _precallback_ - Here you can perform some pre-processing if need be
* _errcallback_ - Handle errors with this callback

## A note on CORS ##
If you wish to use this for CORS requests which it does support you must configure your web server to allow the following header params.
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Cache-Control, Content-MD5, Content-Type, X-Alt-Referer, X-Requested-With
Access-Control-Allow-Credentials: true
```
