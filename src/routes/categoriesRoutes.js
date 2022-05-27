import {Router} from 'express'
import { addCategory } from '../controllers/categoryController.js'
import { validateCategory } from '../middlewares/categoryValidate.js'

const categoriesRouter = Router()

categoriesRouter.post('/categories', validateCategory, addCategory)

export default categoriesRouter