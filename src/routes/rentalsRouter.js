import { Router } from "express";
import { addRental, listRentals } from "../controllers/retalsController.js";
import { rentalValidate } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router()

rentalsRouter.post('/rentals', rentalValidate, addRental)
rentalsRouter.get('/rentals', listRentals)

export default rentalsRouter