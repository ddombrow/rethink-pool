const r = require("rethinkdb");

const restify = require("restify");
const restifyLogger = require("restify-pino-logger");
const { connect, close, shutdown } = require("./middleware/rethink");

const casual = require("casual");

const server = restify.createServer();

server.use(restifyLogger());
server.use((req, res, next) => {
	req.ctx = {};
	next();
});

server.get("/hello", [
	connect,
	(req, res, next) => {
		const record = {
			first_name: casual.first_name,
			last_name: casual.last_name
		};

		r
			.db("pool_test")
			.table("test")
			.insert(record)
			.run(req.ctx.conn)
			.then(
				result => {
					res.send(200, record);
					next();
				},
				err => {
					next(err);
				}
			);
	},
	close
]);

server.listen(9003, function() {
	console.log("%s listening at %s", server.name, server.url);
});

process.on("SIGTERM", function onSigterm() {
	console.info("Got SIGTERM. Graceful shutdown start", new Date().toISOString());
	// start graceul shutdown here
	shutdown();
});
