const { connection } = require("../db/connection");
const { handleMysqlError } = require("../utils/helper");

async function getAll() {
	const [rows] = await connection.query("SELECT * FROM clients");
	return rows;
}

async function getById(id) {
	const [rows] = await connection.query("SELECT * FROM clients WHERE id = ?", [id]);
	return rows[0];
}

async function create(client) {
	try {
		const { name, email, phone } = client;
		const [result] = await connection.query("INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)", [name, email, phone]);
		return { id: result.insertId, ...client };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function update(id, client) {
	try {
		const { name, email, phone } = client;
		await connection.query("UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, id]);
		return { id, ...client };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function deactivate(id) {
	await connection.query("UPDATE clients SET is_active = 0 WHERE id = ?", [id]);
	return { id, active: 0 };
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	deactivate,
};
