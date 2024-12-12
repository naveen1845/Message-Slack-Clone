import express from "express";

import { signUp } from "../../controllers/userController.js";

const router = express.Router();

router.post('/', signUp)

export default router