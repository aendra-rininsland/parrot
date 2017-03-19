/**
 * Parrot Proxy!
 * 2017 Ændrew Rininsland
 *                       @@@@@@@@
 *                      @@,,,,,,'@@
 *                     @',,,,,,,,,@@
 *                    @,,,,,,,;',,,@@
 *                   @:,,,,,'@@@@@,,@
 *                  @+,,@@,,@;;;;@,@@@
 *                 @@,,,@@,,@;;;;@;@@@
 *                 @,,,,#',,@;;;;@'@,@
 *                @:,,,,,,,,@;;;;@;,,@@
 *               @@,,,,,,,,,@;;;;@:,,:@
 *               @,,,,,,,,,,@;;;;@,,,,@
 *              @@,,,,,,,,,,@;;;;@,,,,@
 *              @',,,,,,,,,,#@;;'@,,,,@@
 *              @,,,,,,,,,,,,@;;@+,,,,@@
 *             @@:,,,,,,,,,,,@@;@,,,,,@@
 *             @@',,,,,,,,,,,,@@@,,,,,@
 *             @:@,,,,,,,,,,,,,@,,,,,,@
 *            @,,@;,,,,,,,,,,,,#,,,,,:@
 *           @@,,,@,,,,,,,,,,,,,,,,,,#@
 *          @@,,,,;@:,,,,,,,,,,,,,,,,@
 *         @@,,,,,,:@@,,,,,,,,,,,,,,,@
 *       @@:,,,,,,,,,+@@@,,,,,,,,,,,,@
 *     @@+,,,,,,,,,,,,,,;,,,,,,,,,,,,@@
 *    @@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@
 *    @,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@
 *   @@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@
 *   @:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@
 *   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *
 */

module.exports = async function (flags = {}) {
	const Koa = require('koa');
	const proxy = require('redbird')({port: flags.port || process.env.PORT || 80});
	const redis = require('redis').createClient(flags.redis || process.env.REDIS_URL);
	const serve = require('koa-static');
	const admin = require('./middleware/admin.routes');
	const json = require('koa-json');
	const bodyParser = require('koa-bodyparser');

	const app = new Koa();

	app.use(json());
	app.use(bodyParser());
	if (flags.auth) {
		const auth = require(`./middleware/auth-${flags.auth}`);
		app.use(auth);
	}

	const routes = await new Promise((resolve, reject) =>
			redis.hgetall('parrot-routes', (err, routes) => err ? reject(err) : resolve(routes)));

	console.info(`Loading routes...`);
	Object.entries(routes).forEach(([inPath, outPath]) => proxy.register(inPath, outPath));

	app.use(admin(redis, proxy, routes));
	app.use(serve('admin/')); // Serve admin interface
	app.listen(flags['ui-port'] || process.env.ADMIN || 8080);
};
