import express, { Request, Response } from "express";
import {Pool} from "pg";

const app = express()
const port = 5000;

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:npg_gqV2U9lDuOCx@ep-cold-wildflower-ah278kpo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
});

// parser
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Dev')
})

app.post('/', (req:Request, res: Response) => {
    console.log(req.body);

    res.status(201).json({
        success: "true",
        message: "Api is working"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
