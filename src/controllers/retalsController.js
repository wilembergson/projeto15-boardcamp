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