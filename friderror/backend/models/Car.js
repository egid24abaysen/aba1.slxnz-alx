const pool = require('../config/db');

class Car {
  static async create({ make, model, year, color, price, userId }) {
    const [result] = await pool.execute(
      'INSERT INTO cars (make, model, year, color, price, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [make, model, year, color, price, userId]
    );
    return result.insertId;
  }

  static async findAll(search = '', filters = {}) {
    let query = 'SELECT c.*, u.username as owner FROM cars c LEFT JOIN users u ON c.user_id = u.id WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (c.make LIKE ? OR c.model LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (filters.make) {
      query += ' AND c.make = ?';
      params.push(filters.make);
    }

    if (filters.minYear) {
      query += ' AND c.year >= ?';
      params.push(filters.minYear);
    }

    if (filters.maxPrice) {
      query += ' AND c.price <= ?';
      params.push(filters.maxPrice);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM cars WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { make, model, year, color, price }) {
    const [result] = await pool.execute(
      'UPDATE cars SET make = ?, model = ?, year = ?, color = ?, price = ? WHERE id = ?',
      [make, model, year, color, price, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM cars WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async getMakes() {
    const [rows] = await pool.execute('SELECT DISTINCT make FROM cars');
    return rows.map(row => row.make);
  }
}

module.exports = Car;