import { Router, Response, Request } from 'express';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. GET MINI APPS DIRECTORY
// GET /api/v1/mini-apps
router.get('/mini-apps', (req: Request, res: Response) => {
  res.json({ success: true, miniApps: dbStore.miniApps });
});

// 2. GET OFFICIAL BUSINESS SERVICES
// GET /api/v1/services
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    officialAccounts: dbStore.businessAccounts,
    featuredServices: [
      { id: "s-1", name: "WeChat Pay (微信支付)", icon: "CreditCard", category: "Finance" },
      { id: "s-2", name: "DiDi Mobility (滴滴出行)", icon: "Car", category: "Transport" },
      { id: "s-3", name: "Meituan Delivery (美团外卖)", icon: "Utensils", category: "Food" },
      { id: "s-4", name: "Mobile Top-up & Utilities", icon: "Smartphone", category: "Living" }
    ]
  });
});

export default router;
