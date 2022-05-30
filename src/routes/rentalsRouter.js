import { Router } from "express";
import { addRental, closeRental, deleteRental, listRentals } from "../controllers/retalsController.js";
import { rentalValidate } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router()

rentalsRouter.post('/rentals', rentalValidate, addRental)
rentalsRouter.get('/rentals', listRentals)
rentalsRouter.post('/rentals/:id/return', closeRental)
rentalsRouter.delete('/rentals/:id', deleteRental)

export default rentalsRouter