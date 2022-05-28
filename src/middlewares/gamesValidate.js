import Joi from "joi"
import db from "../database.js"

export async function gamesValidate(req, res, next){
    const newGame = req.body

    const gameSchema = Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        stockTotal: Joi.number().greater(0).required(),
        categoryId: Joi.number().required(),
        pricePerDay: Joi.number().greater(0).required(),
    })
    const validation = gameSchema.validate(newGame)
    if(validation.error){
        res.status(400).send(validation.error.details)
        return
    }
    try{
        const result = await db.query(
            `SELECT games.name
             FROM games
             WHERE games.name = $1;`,
             [newGame.name])
        if(result.rows.length !== 0){
            return res.status(409).send(`Já existe um game com o nome ${newGame.name}`)
        }
    }catch(e){
        return res.status(500).send(console.log(e))
    }

    try{
        const result = await db.query(
            `SELECT categories.id
             FROM categories
             WHERE categories.id = $1;`,
             [newGame.categoryId])
        if(result.rows.length === 0){
            return res.status(400).send(`Não existe nenhuma categoria com o ID ${newGame.categoryId}`)
        }
    }catch(e){
        return res.status(500).send(console.log(e))
    }
    next()
}