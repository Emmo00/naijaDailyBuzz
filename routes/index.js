import { Router } from 'express';
import SubscriptionsController from '../controllers/SubscriptionsController';
import ArticlesController from '../controllers/ArticlesController';

const router = Router();

const subscriptionsController = new SubscriptionsController();
const articlesController = new ArticlesController();

router.get('/', articlesController.home);
router.get('/home', articlesController.home);

router.post('/subscribe', subscriptionsController.postNew);

router.delete('/unsubscribe', subscriptionsController.deleteOne);

router.post('/subscriber/verify', subscriptionsController.postVerify);

router.get('/news/:title', articlesController.getOne);

router.get('/articles/:category', articlesController.getManyCategory);

export default router;
