import db from "../database.js"

export async function addRental(req, res){
    const {customerId, gameId, daysRented} = req.body
    const today = new Date()
    const rentDate = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
    try{
        const resultGame = await db.query(`SELECT games.* FROM games WHERE id = $1;`, [gameId])
        const game = resultGame.rows[0]
        const pricePerDay = game.pricePerDay
        const stock = game.stockTotal
        const originalPrice = pricePerDay * daysRented

        const resultRentals = await db.query(`SELECT rentals.* FROM rentals WHERE "gameId" = $1;`, [gameId])
        if(resultRentals.rows.length >= stock){
            return res.status(400).send('Este jogo se encontra esgotado.')
        }
        const result = await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
             [customerId, gameId, rentDate, daysRented, null, originalPrice, null])
        return res.status(201).send("Jogo alugado com sucesso.")
    }catch(e){
        console.log(e)
        return res.status(500).send('Não foi possivel fazer a atualização.')
    }
}

export async function listRentals(req, res){
    try{
        const result = await db.query(
            `SELECT rentals.*,
                    customers.name as "customerName",
                    games.name as "gameName",
                    games."categoryId" as "categoryIdGame",
                    categories.name as "categoryNameGame"
             FROM rentals
             INNER JOIN customers ON rentals."customerId" = customers.id
             INNER JOIN games ON rentals."gameId" = games.id
             INNER JOIN categories ON games."categoryId" = categories.id;`)
        const list = []
        result.rows.forEach(item => {
            list.push({
                id: item.id,
                customerId: item.customerId,
                gameId: item.gameId,
                rentDate: item.rentDate,
                daysRented: item.daysRented,
                returnDate: item.returnDate,
                originalPrice: item.originalPrice,
                delayFee: item.delayFee,
                customer: {
                 id: item.customerId,
                 name: item.customerName
                },
                game: {
                  id: item.gameId,
                  name: item.gameName,
                  categoryId: item.categoryIdGame,
                  categoryName: item.categoryNameGame
                }
            }) 
        })
        return res.status(201).send(list)
    }catch(e){
        console.log(e)
        return res.status(500).send("Ocorreu algum erro ao cadastrar um novo game.")
    }
}