const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'database-1.cr4armiwudxw.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'chodu6969',
  database: 'yara_db',
  port: '3306'
})


module.exports = connection;