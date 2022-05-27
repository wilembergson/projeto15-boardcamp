export function validateCategory(req, res, next){
    const body = req.body
    if(body.name === ''){
        return res.status(400).send("O nome da categoria não pode ser vazio.")
    }
    next()
}