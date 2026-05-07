const { Router } = require('express');
const ctrl = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/stats', ctrl.getStats);
router.get('/overdue', ctrl.getOverdue);
router.get('/activity', ctrl.getActivity);
router.get('/recent', ctrl.getActivity);

module.exports = router;
