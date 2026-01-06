import { pool } from "../../config/db";

const createUser = async (name: string, email: string) => {
    const result = await pool.query(
        `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
        [name,  email]
    );

    return result;
};

const getUsers = async () => {
    const result = await pool.query(
      `SELECT * FROM users`
    );

    return result;
}

export const userServices = {
    createUser,
    getUsers,
}