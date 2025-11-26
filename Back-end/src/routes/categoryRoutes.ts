import express from 'express';
import {pool} from '../database/dbAccess.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try{
    const result = await pool.query('SELECT * FROM "expenseManagementApp".categories');
    res.json(result.rows);
  } 
  catch(err){
    res.status(500).json({error: (err as Error).message});
  }
});


export default router;

//Đức