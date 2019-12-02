const clientModel = require('../models/clientModel');
const validator = require('../helpers/validator');
const cacher = require('../helpers/cacher');

class ClientsController {
	// GET - Returns a list of clients
	static async get() {
		return clientModel.getList();

	}

	// GET - Returns one client by ID
	static async getOne(req) {
		const { clientId } = req.params;
		return clientModel.getOne(clientId);
	}

	// POST - Create a client
	static async createOne(req) {
		await validator.validate('clientModel', req.body);

		const payloadHash = clientModel.hashClient(req.body);
		if (cacher.isCached(payloadHash)) return cacher.getCached(payloadHash);
		const client = await clientModel.createOne(req.body, payloadHash);
		await cacher.cacheAdd(payloadHash, client);
		return client;
	}

	// DELETE - Delete a client
	static async deleteOne(req) {
		const { clientId } = req.params;

		await clientModel.deleteById(clientId);

		return { message: 'success' };
	}

	// UPDATE - Update a client first name
	static async updateOne(req) {
		const { clientId } = req.params;
		const { firstName } = req.query;
		await clientModel.updateOne(clientId, firstName);
		return { message: 'update success' };
	}
}


module.exports = ClientsController;