import { Router } from "express";
import { eventEmulate, webHookController, getWebhooks } from "../controllers/webhooks";
const router = Router();

router.post('/api/webhooks', webHookController);
router.post('/api/event-emulate', eventEmulate);
router.get('/api/db', getWebhooks); // Comment for Production

export default router;