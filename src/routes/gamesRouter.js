import { Router } from "express";

import { addGame, listGames } from "../controllers/gamesController.js";
import { gamesValidate } from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router()

gamesRouter.post('/games', gamesValidate, addGame)
gamesRouter.get('/games', listGames)

export default gamesRouter