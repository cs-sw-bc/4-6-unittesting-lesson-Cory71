import { Router } from 'express';
import {
  showOrderForm,
  submitOrder,
  showRewards,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', showOrderForm);
router.post('/order', submitOrder);
router.get('/rewards', showRewards);

export default router;
