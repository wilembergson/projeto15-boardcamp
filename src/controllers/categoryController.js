import db from '../database.js'

//ADICIONAR CATEGORIA
export async function addCategory(req, res){
    const newCategory = req.body
    try{
        const result = await db.query(`INSERT INTO categories (name) VALUES ($1);`, [newCategory.name])
        return res.sendStatus(201)
    }catch(e){
        console.log(e)
        res.status(500).send("Ocorreu algum erro ao cadastrar uma nova categoria.")
    }
}

//LISTAR CATEGORIAS
export async function listCategories(req, res){
    try{
        const result = await db.query(`SELECT * FROM categories;`)
        return res.status(200).send(result.rows)
    }catch(e){
        console.log(e)
        res.status(500).send("Ocorreu algum erro ao tentar obter a lista de  categorias.")
    }
}