import db from "../database.js"

//ADICIONAR ALUGUEL
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

//LISTAR ALUGUEIS
export async function listRentals(req, res){
    const {customerId, gameId} = req.query
    let where = ''
    if(customerId){
        where = ` WHERE rentals."customerId" = ${customerId};`
    }else if(gameId){
        where = ` WHERE rentals."gameId" = ${gameId};`
    }
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
             INNER JOIN categories ON games."categoryId" = categories.id
             ${where};`)
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
        return res.status(200).send(list)
    }catch(e){
        console.log(e)
        return res.status(500).send("Ocorreu algum erro ao cadastrar um novo game.")
    }
}

//FINALIZAR ALUGUEL
export async function closeRental(req, res){
    const {id} = req.params
    const returnDate = getDate() 
    try{
        const resultRentals = await db.query(`SELECT rentals.* FROM rentals WHERE rentals.id = $1;`, [id])
        if(resultRentals.rows.length === 0){
            return res.status(404).send("Nenhum aluguel foi encontrado com o ID "+id)
        }
        const rental = resultRentals.rows[0]
        const resultGames = await db.query(`SELECT games.* FROM games WHERE games.id = $1;`, [rental.gameId])
        const game = resultGames.rows[0]
        const delayFee = getDelayFee(returnDate, rental.rentDate, game.pricePerDay)
        if(rental.returnDate !== null){
            return res.status(400).send('Este aluguel já foi fechado.')
        }
        const result = await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`,
        [returnDate, delayFee, id])
        return res.status(200).send("Jogo devolvido.")
    }catch(e){
        console.log(e)
        return res.status(500).send("Ocorreu algum erro ao cadastrar um novo game.")
    }
}

//DELETAR ALUGUEL
export async function deleteRental(req, res){
    const {id} = req.params
    try{
        const resultRentals = await db.query(`SELECT rentals.* FROM rentals WHERE id = $1;`, [id])
        if(resultRentals.rows.length === 0){
            return res.status(404).send(`Nenhum aluguel encontrado com o id ${id}`)
        }
        if(resultRentals.rows[0].returnDate === null){
            return res.status(400).send('Este aluguel ainda não foi finalizado.')
        }
        const result = await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])
        return res.status(200).send('Aluguel deletado.')
    }catch(e){
        return res.status(500).send('Ocorreu algum erro ao deletar o aluguel.')
    }
}

function getDelayFee(returnDateISO, rentDateISO, pricePerDay){
    const returnDate = new Date(returnDateISO);
    const rentDate = new Date(rentDateISO.toISOString().split('T')[0]);
    const diffTime = Math.abs(returnDate - rentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * pricePerDay;
  };
function getDate(){
    let today = new Date();
    today.toISOString().split('T')[0];
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);
    return today.toISOString().split('T')[0];
  };