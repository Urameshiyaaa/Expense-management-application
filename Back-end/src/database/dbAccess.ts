import pg from 'pg';
import 'dotenv/config';


const { Pool } = pg; 
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

export const query = (sql: string, filledData?: any[]) => pool.query(sql, filledData);