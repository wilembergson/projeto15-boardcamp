import db from "../database.js"

export async function validateCategory(req, res, next){
    const body = req.body
    if(body.name === ''){
        return res.status(400).send("O nome da categoria não pode ser vazio.")
    }
    try{
        const result = await db.query(
            `SELECT categories.name 
             FROM categories
             WHERE categories.name = $1;`,
             [body.name])
        if(result.rows.length !== 0){
            return res.status(409).send('Esta categoria já existe. Cadastre outra')
        }
    }catch(e){
        return res.status(500).send(console.log(e))
    }
    next()
}