import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";


const app = express()
const port = config.port;


// parser
app.use(express.json());


// DB initialization
initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Dev')
})


// Users API
app.use("/users", userRoutes);


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
