const r = require("rethinkdb");
const rethinkPool = require("../lib/rethink-pool");

const rethinkOpts = {
	host: "localhost",
	port: 28015,
	db: "pool_test"
};
const poolOpts = {
	max: 10, // maximum size of the pool
	min: 2 // minimum size of the pool
};
const connPool = rethinkPool(rethinkOpts, poolOpts);

function connect(req, res, next) {
	connPool.acquire().then(
		conn => {
			req.ctx.conn = conn;
			next();
		},
		err => {
			req.log.error(err);
			next(err);
		}
	);
}

function close(req, res, next) {
	connPool.release(req.ctx.conn);
	req.ctx.conn = null;
	next();
}

function shutdown() {
	return connPool.drain().then(() => {
		connPool.clear();
	});
}

module.exports = {
	connect,
	close,
	shutdown
};
