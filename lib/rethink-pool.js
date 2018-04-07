const r = require("rethinkdb");
const genericPool = require("generic-pool");
const opts = {
	max: 10, // maximum size of the pool
	min: 2 // minimum size of the pool
};

module.exports = function(dbOpts, poolOpts = {}) {
	const rethinkConnectionFactory = {
		create: function() {
			return r.connect(dbOpts);
		},
		destroy: function(client) {
			console.log("closing...");
			client.close();
		}
	};

	return genericPool.createPool(rethinkConnectionFactory, poolOpts);
};
