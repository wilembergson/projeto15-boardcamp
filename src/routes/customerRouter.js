import { Router } from "express";
import { addCustomer, listCustomers, listCustomersById } from "../controllers/customerController.js";
import { customersValidate } from "../middlewares/customersValidate.js";

const customerRouter = Router()

customerRouter.post('/customers', customersValidate, addCustomer)
customerRouter.get('/customers', listCustomers)
customerRouter.get('/customers/:id', listCustomersById)

export default customerRouter