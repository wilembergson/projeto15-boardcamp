import db from "../database.js"

//ADICIONAR GAME
export async function addGame(req, res){
    const newGame = req.body
    try{
        const result = await db.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
             VALUES ($1, $2, $3, $4, $5);`, [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay])
        return res.status(201).send("Novo game cadastrado com sucesso.")
    }catch(e){
        console.log(e)
        return res.status(500).send("Ocorreu algum erro ao cadastrar um novo game.")
    }
}

//LISTAR GAMES
export async function listGames(req, res){
    const {name} = req.query
    let sql = ''
    if(name){
        const nameCopy = name.charAt(0).toUpperCase() + name.slice(1);
        sql = `SELECT games.*, categories.name as "categoryName"
        FROM games
        JOIN categories ON games."categoryId"=categories.id
        WHERE games.name LIKE '${nameCopy}%';`
    }else{
        sql = `SELECT games.*, categories.name as "categoryName"
        FROM games
        JOIN categories ON games."categoryId"=categories.id;`
    }
    try{
        const result = await db.query(sql)
        return res.status(200).send(result.rows)
    }catch(e){
        console.log(e)
        res.status(500).send("Ocorreu algum erro ao tentar obter a lista de  games.")
    }
}