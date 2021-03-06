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
    let where = ''
    if(cpf){
        where = ` WHERE customers.cpf LIKE '${cpf}%';`
    }
    try{
        const result = await db.query(`SELECT customers.* FROM customers${where};`)
        const list = []
        result.rows.forEach(item =>{
            list.push(
                {
                    id:item.id,
                    name: item.name,
                    phone: item.phone,
                    cpf: item.cpf,
                    birthday: item.birthday.toISOString().split('T')[0]
                    
                }
            )
        })
        return res.status(200).send(list)
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

//ATUALIZAR CLIENTE
export async function updateCustomer(req, res){
    const {id} = req.params
    const {name, phone, cpf, birthday} = req.body
    try{
        const result = await db.query(`
            UPDATE customers
            SET
                name = $1,
                phone = $2,
                cpf = $3,
                birthday = $4
            WHERE id = $5`, [name, phone, cpf, birthday, id])
        return res.status(200).send('Cliente atualizado com sucesso.')
    }catch(e){
        console.log(e)
        return res.status(500).send('Não foi possivel fazer a atualização.')
    }
}