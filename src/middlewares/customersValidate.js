import Joi from "joi"
import db from "../database.js"

export async function customersValidate(req, res, next){
    const newCustomer = req.body
    const customerSchema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().min(10).max(11).regex(/^[0-9]+$/).required(),
        cpf: Joi.string().length(11).regex(/^[0-9]+$/).required(),
        birthday: Joi.date().required()
    })
    const validation = customerSchema.validate(newCustomer)
    if(validation.error){
        res.status(400).send(validation.error.details)
        return
    }
    try{
        const result = await db.query(
            `SELECT customers.cpf
             FROM customers
             WHERE customers.cpf = $1;`,
             [newCustomer.cpf])
        if(result.rows.length !== 0){
            return res.status(409).send(`Já existe um cliente com o cpf ${newCustomer.cpf}`)
        }
    }catch(e){
        return res.status(500).send(console.log(e))
    }
    next()
}