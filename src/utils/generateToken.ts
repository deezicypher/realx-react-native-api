import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

const {
  ACTIVE_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} = process.env

export const generateActiveToken = (payload: object) => {
  return jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, {expiresIn: '1d'})
}

export const generateAccessToken = (payload: object, req: Request) => {
  const accesstoken = jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, {expiresIn: '1d'})

return accesstoken
}

