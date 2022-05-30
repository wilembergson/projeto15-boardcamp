import { Router } from "express";
import { addRental, closeRental, listRentals } from "../controllers/retalsController.js";
import { rentalValidate } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router()

rentalsRouter.post('/rentals', rentalValidate, addRental)
rentalsRouter.get('/rentals', listRentals)
rentalsRouter.post('/rentals/:id/return', closeRental)

export default rentalsRouter