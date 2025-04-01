const mysql = require('mysql2/promise'); 

const conxn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'BENEGITARE',
    waitForConnections: true
});
async function initDB(){
    let connection;
    try{
        connection = await conxn.getConnection();
        await connection.query('CREATE DATABASE IF NOT EXISTS cardb');
        console.log('Database created');
        await connection.query('USE cardb');
        console.log("Offset's in use of cardb");
        await connection.query(`CREATE TABLE IF NOT EXISTS cartable(
            id int auto_increment primary key, carname varchar(255), carbrand varchar(255))`);
        console.log('Table creaated');
        const [result] = await connection.query(`
            INSERT INTO cartable
            (carname,carbrand) 
            VALUES 
            ("cybertruck","tesla"),
            ("cybertruck","tesla")`
        ); 
        console.log(`Data inserted: ${result.affectedRows} rows affected`);
    } catch(err){
        console.error('Error occured in init.....', err);
    } finally {
        if (connection) connection.release();
    }

}

async function showCar(){
    try{
        const [rows]  = await conxn.query('SELECT * FROM cartable');
        console.log(rows);
        return rows
    } catch(err){
        console.error('Error occured in show...', err);
    }
}

initDB();
module.exports = {conxn,showCar};

