import db from "../database.js"

//ADICIONAR NOVO CLIENTE
export async function addCustomer(req, res){
    const newCustomer = req.body
    try{
        const result = await db.query(
            `INSERT INTO customers (name, phone, cpf, birthday)
             VALUES ($1, $2, $3, $4);`, [newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday])
        return res.status(201).send("Novo cliente cadastrado com sucesso.")
    }catch(e){
        console.log(e)
        return res.status(500).send("Ocorreu algum erro ao cadastrar um novo game.")
    }
}

//LISTAR CLIENTES POR CPF OU NÃO
export async function listCustomers(req, res){
    const {cpf} = req.query
    let sql = ''
    if(cpf){
        sql = ` WHERE customers.cpf LIKE '${cpf}%';`
    }
    try{
        const result = await db.query(`SELECT customers.* FROM customers${sql};`)
        return res.status(200).send(result.rows)
    }catch(e){
        console.log(e)
        res.status(500).send("Ocorreu algum erro ao tentar obter a lista de clientes.")
    }
}

//LISTAR CLIENTES POR ID
export async function listCustomersById(req, res){
    const {id} = req.params
    try{
        const result = await db.query(`SELECT customers.* FROM customers WHERE customers.id = $1;`, [id])
        if(result.rows.length === 0){
            return res.status(404).send('Cliente não encontrado')   
        }
        return res.status(200).send(result.rows[0])
    }catch(e){
        console.log(e)
        res.status(500).send("Ocorreu algum erro ao tentar obter os dados do clientes.")
    }
}