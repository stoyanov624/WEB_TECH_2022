const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'Ezikiel22',
    database: 'pagination_web',
    host: 'localhost',
    port: 5432  
})

module.exports = pool;