import app from './app'
import dotenv from 'dotenv'
import pool from './config/db'

dotenv.config()

const startDB = async () => {
    try {
        await pool.connect()
        console.log('DB connected')
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            picture TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT,
            created_at timestamptz NOT NULL DEFAULT (now())
          );
          `)
        console.log("Created Table users")
    } catch (error:any) {
        console.error("Error connecting to DB:",error.message); 
    }
    
}

app.listen(3000, () => {
    startDB()
    console.log('Listening on port 3000')
})