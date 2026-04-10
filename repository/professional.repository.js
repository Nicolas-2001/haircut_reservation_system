const { connection } = require("../db/connection");
const { handleMysqlError } = require("../utils/helper");

async function getAll() {
    try {
        const [rows] = await connection.query("SELECT * FROM professionals");
        return rows;
    } catch (error) {
        handleMysqlError(error);
    }
}

async function getById(id) {
    try {
        const [rows] = await connection.query("SELECT * FROM professionals WHERE id = ?", [id]);
        return rows[0];
    } catch (error) {
        handleMysqlError(error);
    }
}

async function create(professional) {
    try {
        const { name, email, phone } = professional;
        const [result] = await connection.query("INSERT INTO professionals (name, email, phone) VALUES (?, ?, ?)", [name, email, phone]);
        return { id: result.insertId, ...professional };
    } catch (error) {
        handleMysqlError(error);
    }  
}

async function update(id, professional) {
    try {
        const { name, email, phone } = professional;
        await connection.query("UPDATE professionals SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, id]);
        return { id, ...professional };
    } catch (error) {
        handleMysqlError(error);
    }
}

async function deactivate(id) {
    try {
        await connection.query("UPDATE professionals SET is_active = 0 WHERE id = ?", [id]);
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
