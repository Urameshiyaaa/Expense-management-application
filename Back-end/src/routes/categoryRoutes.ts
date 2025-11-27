import express from 'express';
import {pool} from '../database/dbAccess.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try{
    const result = await pool.query('SELECT * FROM "expenseManagementApp".categories ORDER BY category_id ASC');
    res.json(result.rows);
  } 
  catch(err){
    res.status(500).json({error: (err as Error).message});
  }
});

router.post('/', async (req, res) => {
  try{
    const {name} = req.body;
    const result = await pool.query('INSERT INTO "expenseManagementApp".categories (name) VALUES ($1) RETURNING *',[name]);
    res.json(result.rows[0]);
  } 
  catch(err){
    res.status(500).json({error: (err as Error).message});
  }
});

router.put('/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const {name} = req.body;
    await pool.query('UPDATE "expenseManagementApp".categories SET name = $1 WHERE category_id = $2',[name, id]);
    res.json({message: 'Cập nhật thành công'});
  }
  catch(err){
    res.status(500).json({error: (err as Error).message});
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const {id} = req.params;
    await pool.query('DELETE FROM "expenseManagementApp".categories WHERE category_id = $1', [id]);
    res.json({message: 'Xóa thành công'});
  } 
  catch(err){
    res.status(500).json({error: (err as Error).message});
  }
});

export default router;

//Đức