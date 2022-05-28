import {Router} from 'express'
import { addCategory, listCategories } from '../controllers/categoryController.js'
import { validateCategory } from '../middlewares/categoryValidate.js'

const categoriesRouter = Router()

categoriesRouter.get('/categories', listCategories)
categoriesRouter.post('/categories', validateCategory, addCategory)

export default categoriesRouter