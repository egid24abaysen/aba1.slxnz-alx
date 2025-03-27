const mysql= require('mysql2');
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'BENEGITARE',
});
conn.connect((err)=>{
    (err)?console.log(err):console.log('\n .......\n \tconnected\n......')
});

conn.query('create database if not exists warehouse',(err)=>{
    (err)?console.log(err):console.log('database created')
});

conn.query('use warehouse', err => console.log(err));
conn.query('create table if not exists dataset(id int primary key auto_increment, house varchar(255),price int)',(err,result) => console.log(result));
conn.query('insert into dataset(house,price) values("crib",100000),("duplex",200000),("mansion",500000)',(err,result) => console.log(result));
conn.query('select * from dataset', (err,result) => console.log(result));
conn.query('update dataset set price=300000 where house="duplex"',(err,result) => console.log(result));
conn.query('delete from dataset where house="crib"',(err,result)=>console.log(result));

conn.end(err=>console.log(err));

