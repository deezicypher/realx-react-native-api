import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

const poolConfig = {
    connectionString: process.env.DATABASE_URL
}

const pool = new Pool(poolConfig)

export default pool