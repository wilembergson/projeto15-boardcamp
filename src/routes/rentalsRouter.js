import { Router } from "express";
import { addRental } from "../controllers/retalsController.js";
import { rentalValidate } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router()

rentalsRouter.post('/rentals', rentalValidate, addRental)

export default rentalsRouter