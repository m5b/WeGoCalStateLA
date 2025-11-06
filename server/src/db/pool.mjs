import mysql from 'mysql2/promise'

//created a connection pool containes number of database connection
//good optimazation so we don't have to create a connection for each request
const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    //credential
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    //how many request can wait, 0 is infinite
    queueLimit: 0,
    //how many connections can be used simultaneously
    connectionLimit: 10,
    //how many idle connection can pool contains
    maxIdle: 10,
    //how long can a idle connection stay in the pool, 1min = 60000 milliseconds
    idleTimeout: 60000,

    ssl: {
        minVersion: 'TLSv1.2',
    },
})

export default connectionPool
