import { createPool } from 'mysql2/promise'
import {
  DB_HOST,
  DB_PORT, 
  DB_USER, 
  DB_PASS, 
  DB_NAME
} from './config.js'

export const pool = createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
