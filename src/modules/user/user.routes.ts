import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
const router = express.Router();


router.post('/', userControllers.createUser);

router.get('/', userControllers.getUsers);

router.get('/:id', userControllers.getSingleUser);

router.put('/:id', userControllers.updateUser);


export const userRoutes = router;