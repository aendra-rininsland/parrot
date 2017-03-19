#!/usr/bin/env node

/**
 * Parrot Reverse Proxy
 * 2017 Ændrew Rininsland
 *
 * Arguments:
 * --port, -p   Port number for Proxy
 * --ui-port, -u   Port number for admin interface
 * --auth, -a  Set authentication middleware to use
 */

'use strict';

const meow = require('meow');
const parrot = require('..');

const cli = meow(`
    Usage:
      $ parrot

    Options:
      --port, -p      Set reverse proxy port for Redbird. Defaults to $PORT or 80.
      --ui-port, -u   Set port for admin interface. Defaults to $ADMIN or 8080.
      --auth, -a      Set authentication middleware to use for admin interface. Defaults to none.
      --redis, -r     Set URL to Redis service. Defaults to env var REDIS_URL
`, {
	alias: {
		p: 'port',
		u: 'ui-port',
		a: 'auth',
		r: 'redis',
	},
});

parrot(cli.flags);
