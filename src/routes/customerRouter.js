import { Router } from "express";
import { addCustomer, listCustomers, listCustomersById, updateCustomer } from "../controllers/customerController.js";
import { customersValidate } from "../middlewares/customersMiddleware.js";

const customerRouter = Router()

customerRouter.post('/customers', customersValidate, addCustomer)
customerRouter.get('/customers', listCustomers)
customerRouter.get('/customers/:id', listCustomersById)
customerRouter.put('/customers/:id', customersValidate, updateCustomer)

export default customerRouter