const { Router } = require('express');
const ctrl = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { z } = require('zod');

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
});

const router = Router();
router.use(authenticate);

router.post('/:taskId/comments', validate(commentSchema), ctrl.create);
router.get('/:taskId/comments', ctrl.getByTask);
router.delete('/:taskId/comments/:id', ctrl.remove);

module.exports = router;
