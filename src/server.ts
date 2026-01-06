import express, { Request, Response } from "express";
import {Pool} from "pg";
import config from "./config";


const app = express()
const port = config.port;


// parser
app.use(express.json());

// Pool
const pool = new Pool({
  connectionString: `${config.connection_str}`
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

// Get single user
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

// Update user
app.put('/users/:id', async (req: Request, res: Response) => {
  const {name, email} = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [
        name,
        email,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
      success: false,
      message: "User Not Found",
    });
    }
    else{
      res.status(200).json({
      success: true,
      message: "User updated successfully",
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

// Delete user
app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`, [
        req.params.id,
      ]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
      success: false,
      message: "User Not Found",
    })
    }
    else{
      res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    })
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
});

// Todos Crud
app.post('/todos', async (req: Request, res: Response) => {
  const {user_id, title} = req.body;
  try {
    
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );

    res.status(201).json({
      success: true,
      message: "Todo inserted",
      data: result.rows[0]
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
});

app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM todos`
    );

    res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows
    })
  }

  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "not found",
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
