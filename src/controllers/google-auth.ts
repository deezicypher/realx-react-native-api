import {Request, response, Response} from 'express'
import axios from  'axios'
import pool from '../config/db';
import { generateAccessToken } from '../utils/generateToken';
import bcrypt from 'bcrypt'

export const googleSignup = async (req:Request, res:Response) => {
    const {access_token} = req.body; 
    try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` },})
    console.log(response.data)
    
    const {email, email_verified, name, picture} = response.data;


//     // Normalize input and trim whitespace
//     if(email_verified){
//     const normalizedEmail = email.toLowerCase().trim();
  
  
//       // Check if the email or name already exists in the database
//       const query = "SELECT * FROM users WHERE email = $1";
//       // Use await to wait for the result of the query, ensures that the query is executed and completes before proceeding.
//       const { rows } = await pool.query(query, [normalizedEmail]);
  
//    // If user is found, check if the email or name already exists
//    if (rows.length > 0) {
//     const user = rows[0];
    
//     if (user.email === normalizedEmail) {
//         res.status(422).json({ error: "Email already exists" });
//         return
//     }

// }else{

//        const saveQuery = 'INSERT INTO users (email,name,picture) VALUES ($1, $2, $3) RETURNING *';

//       // Use await to run the query and handle the response
//       const result = await pool.query(saveQuery, [normalizedEmail, name, picture]);
  
//       const { id, created_at} = result.rows[0]
//       // Respond with a success message and the created user
//      res.json({ msg: 'Account created successfully!', user: {id,email,created_at,name,picture} });

// }

//     }else {
//        res.status(400).json({
//             error: "Google Signup Failed"
//         })
//         return
//     }
}catch(err){
    console.log(err)
    
    return
}

}

export const googleLogin = async (req:Request, res:Response) => {
    const {access_token} = req.body; 

   
    try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` },})
    const {email, email_verified} = response.data;

    // Normalize input and trim whitespace
    if(email_verified){
  
       // check if the user exists
      const q = "SELECT * FROM users WHERE email ILIKE $1"
  
      // use await to wait for the result of the query
      const {rows} = await pool.query(q,[email])
  
  
      if(rows.length === 0) {
       res.status(422).json({error:"Email is not registered"})
       return
      }

      const user = rows[0]
      generateAccessToken({id:user.id},req)
      res.json({user: { id:user?.id,email:user?.email,}})
     return


    }else {
         res.status(400).json({
            error: "Google Login Failed"
        })
        return
    }
}catch(err){
    console.log(err)
    return
}

}