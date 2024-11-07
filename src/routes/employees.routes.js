import {Router} from 'express'
import {getEmployees, createEmployees, updateEmployees, deleteEmployees, getEmployeesById} from '../controllers/employees.controller.js'

const router = Router()

router.get('/employees', getEmployees );

router.get('/employees/:id', getEmployeesById );

router.post('/employees', createEmployees );

router.patch('/employees/:id', updateEmployees );

router.delete('/employees/:id', deleteEmployees );

export default router