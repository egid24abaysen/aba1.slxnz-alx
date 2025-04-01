const mysql = require('mysql2/promise');

// Create connection pool with database specified
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'BENEGITARE',
    database: 'db_base', // Specify database here
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initializeDatabase() {
    let connection;//empty var to hold to connection
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();
        
        // Create database if not exists
        await connection.query('CREATE DATABASE IF NOT EXISTS db_base');
        console.log('Database created or already exists');
        
        // Switch to the database
        await connection.query('USE db_base');
        console.log('Using database db_base');
        
        // Create table if not exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tbname (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                name VARCHAR(255), 
                email VARCHAR(255)
            )
        `);
        console.log('Table created or already exists');
        
        // Insert sample data
        const [result] = await connection.query(`
            INSERT INTO tbname (name, email) 
            VALUES ("item 1", "item1@gmail.com"), ("item 2", "item2@gmail.com")
        `);
        console.log(`Data inserted, ${result.affectedRows} rows affected`);
        
    } catch (err) {
        console.error('Initialization error:', err);
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

async function show() {
    try {
        const [rows] = await pool.query('SELECT * FROM tbname');
        console.log(rows);
        return rows;
    } catch (err) {
        console.error('Query error:', err);
        throw err; // Re-throw the error for the caller to handle
    }
}

// Initialize the database when this module is loaded
initializeDatabase();

module.exports = {
    pool, // Export the pool for other modules to use
    show
};