# Parrot Proxy

Configurable reverse proxy for managing URLs

### This is a work-in-progress. Will soon include a web-based backend for managing entries.

## Usage:

1. Install globally
	```
	$ npm install -g aendrew/parrot
	```
2. Set Redis URL:
	```
	$ export REDIS_URL="http://localhost:6379"
	```
2. Run!
	```
	$ parrot
	```

### TODO:
* Backend
* Find way to set Host header
* Unit tests
