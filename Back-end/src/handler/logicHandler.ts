import type { Request, Response } from 'express';
import {query} from '../database/dbAccess.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config';


const client: any = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
let payload: any; 

const createToken = (userId: string) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET!, {expiresIn: '1d'});};

export const register = async (req: Request, res: Response) => {
  try{
    const {email, password, fullName} = req.body;

    if (password.length < 8) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 kí tự.'});
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 1 chữ in hoa.'});
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 1 chữ in thường.'});
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 1 chữ số.'});
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 1 kí tự đặc biệt.'});
    }

    const existingUser = await query('SELECT * FROM "expenseManagementApp".users WHERE email = $1', [email]);
    if(existingUser.rows.length > 0){
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await query('INSERT INTO "expenseManagementApp".users (email, full_name, hashed_password) VALUES ($1, $2, $3) RETURNING user_id', [email, fullName, hashedPassword]);
    res.status(201).json({message: 'Đăng ký thành công'});

  }
  catch(err){
    console.error(err);
    res.status(500).json({message:'Lỗi server'});
  }
};

export const login = async (req: Request, res: Response) => {
  try{
    const {email, password} = req.body;
    
    const userResult = await query('SELECT * FROM "expenseManagementApp".users WHERE email = $1', [email]);
    if(userResult.rows.length === 0){
      return res.status(404).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    const user = userResult.rows[0];
    
    if(!user.hashed_password){
      return res.status(400).json({message: 'Tài khoản này được đăng ký qua Google.'});
    }
    
    const checkedPass = await bcrypt.compare(password, user.hashed_password);
    if(!checkedPass){
      return res.status(401).json({message: 'Email hoặc mật khẩu không đúng'});
    }
    
    const token = createToken(user.user_id);
    res.json({ 
      token, 
      message: 'Đăng nhập thành công', 
      user: { 
        user_id: user.user_id, 
        full_name: user.full_name, 
        email: user.email, 
        avatar_url: user.avatar_url 
      } 
    });

  } 
  catch(err){
    console.error(err);
    res.status(500).json({message: 'Lỗi server'});
  }
};

export const loginWithGoogle = async (req: Request, res: Response) => {
  try{
    const {token: googleToken} = req.body; 
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    payload = ticket.getPayload();
    if(!payload){
      return res.status(400).json({message: 'Token Google không hợp lệ'});
    }
    
    const {sub: google_id, email, name: full_name, picture: avatar_url} = payload;
    
    let userResult = await query('SELECT * FROM "expenseManagementApp".users WHERE google_id = $1', [google_id]);
    let user = userResult.rows[0];
    
    if(!user){
      const newUserResult = await query('INSERT INTO "expenseManagementApp".users (email, full_name, google_id, avatar_url, hashed_password) VALUES ($1, $2, $3, $4, NULL) RETURNING *', [email, full_name, google_id, avatar_url]);
      user = newUserResult.rows[0];
    }
    
    const token = createToken(user.user_id);
    res.json({ 
      token, 
      message: 'Đăng nhập Google thành công',
      user: { 
        user_id: user.user_id, 
        full_name: user.full_name, 
        email: user.email, 
        avatar_url: user.avatar_url 
      }
    });

  }
  catch (err){
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};