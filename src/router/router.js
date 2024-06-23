import { Router } from "express";
import { user } from '../controllers/user.controller.js';
import  extractIpAddress  from '../middlewares/accessIpAddress.js'

const router = Router();

router.get("/api/hello", extractIpAddress, user) 

export default router;