/**
 * Routes for the admin interface
 */

module.exports = function (redis, proxy, items) {
	const Router = require('koa-router');
	const compose = require('koa-compose');
	const routes = new Router();
	console.dir(items);

	// Get all existing routes
	routes.get('routes', '/api/routes', (ctx, next) => {
		ctx.body = items;
		return next();
	});

	// Add or update a route
	routes.post('routes', '/api/routes', (ctx, next) => {
		const {inPath, outPath} = ctx.request.body;
		console.dir(ctx.request.body);
		redis.hset('parrot-routes', inPath, outPath, async err => {
			if (err) {
				console.error(err);
				await next();
				ctx.status = 500;
			} else {
				console.info(`Route added: ${inPath} ▻ ${outPath}`);
				proxy.register(inPath, outPath);
				await next();
				ctx.status = 200;
			}
		});
	});

	routes.delete('routes', '/api/routes', (ctx, next) => {
		const {inPath, outPath} = ctx.request.body;
		redis.hdel('parrot-routes', inPath, (err, response) => {
			if (err) {
				console.error(err);
				ctx.body = err;
				ctx.status = 500;
			} else {
				proxy.unregister(inPath, outPath);
				ctx.body = response;
				ctx.status = 200;
			}
			return next();
		});
	});

	return compose([routes.routes(), routes.allowedMethods()]);
};
