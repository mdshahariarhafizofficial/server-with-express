import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {Pool} from "pg";
import path from "path";

dotenv.config({path: path.join(process.cwd(), '.env')});

const app = express()
const port = 5000;


// parser
app.use(express.json());

// Pool
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
});


const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(11),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()        
      )
    `)

};

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Dev')
})


// Users API

app.post('/users', async (req:Request, res: Response) => {
    const {name, email} = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
        [name,  email]
      ) 

      // console.log(result.rows[0]);
      res.status(201).json({
          success: true,
          message: "Data inserted successfully",
          data: result.rows[0],
      })

    } catch (error: any) {
      res.status(500).json({
          success: false,
          message: error.message,
      })      
    }

})

// Get Api
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users`
    );

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`, [
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
      success: false,
      message: "User Not Found",
    })
    }
    else{
      res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    })
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
