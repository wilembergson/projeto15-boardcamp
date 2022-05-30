import Joi from "joi"
import db from "../database.js"

export async function rentalValidate(req, res, next){
    const newRental = req.body
    const rentalSchema = Joi.object({
        customerId: Joi.number().required(),
        gameId: Joi.number().required(),
        daysRented: Joi.number().greater(0).required()
    })
    const validation = rentalSchema.validate(newRental)
    if(validation.error){
        return res.status(400).send('As informações não estão preenchidas corretamente.')
    }
    try{
        const customerIdResult = await db.query(`SELECT customers.* FROM customers WHERE id = $1;`, [newRental.customerId])
        if(customerIdResult.rows.length === 0){
            return res.status(400).send('Clinte não encontrado.')
        }
        const gameIdResult = await db.query(`SELECT games.* FROM games WHERE id = $1;`, [newRental.gameId])
        if(gameIdResult.rows.length === 0){
            return res.status(400).send('Jogo não encontrado.')
        }

    }catch(e){
        return res.status(500).send('Erro ao tentar validar as informações.')
    }
    next()
}