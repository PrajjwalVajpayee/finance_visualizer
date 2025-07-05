import { Router } from 'express';
import * as ctrl from '../controllers/transactionController.js';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', ctrl.createOne);
router.put('/:id', ctrl.updateOne);
router.delete('/:id', ctrl.deleteOne);
router.get('/summary/monthly', ctrl.monthlySummary);
router.get('/summary/category', ctrl.categorySummary);
router.get('/summary/dashboard', ctrl.dashboardSummary);
router.get('/categories', ctrl.getCategories);
router.get('/recent', ctrl.getRecent); 




export default router;
