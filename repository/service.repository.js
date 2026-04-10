const { connection } = require("../db/connection");
const { handleMysqlError } = require("../utils/helper");

async function getAll() {
	try {
		const [rows] = await connection.query("SELECT * FROM services");
		return rows;
	} catch (error) {
		handleMysqlError(error);
	}
}

async function getById(id) {
	try {
		const [rows] = await connection.query("SELECT * FROM services WHERE id = ?", [id]);
		return rows[0];
	} catch (error) {
		handleMysqlError(error);
	}
}

async function create(service) {
	try {
		const { name, description, duration_minutes, price } = service;
		const [result] = await connection.query(
			"INSERT INTO services (name, description, duration_minutes, price) VALUES (?, ?, ?, ?)",
			[name, description, duration_minutes, price]
		);
		return { id: result.insertId, ...service };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function update(id, service) {
	try {
		const { name, description, duration_minutes, price } = service;
		await connection.query(
			"UPDATE services SET name = ?, description = ?, duration_minutes = ?, price = ? WHERE id = ?",
			[name, description, duration_minutes, price, id]
		);
		return { id, ...service };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function deactivate(id) {
	try {
		await connection.query("UPDATE services SET is_active = 0 WHERE id = ?", [id]);
		return { id, active: 0 };
	} catch (error) {
		handleMysqlError(error);
	}
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	deactivate,
};
