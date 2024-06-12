const router = require('express').Router()
const comment = require('../controllers/comment')
const auth = require('../middleware/auth')
const upload = require('../config/multerConfig');

router.post('/comment',upload.any(), auth, comment.createComment)   // done

router.patch('/comment/:id',upload.any(), auth, comment.updateComment)  // done

router.patch('/comment/:id/like',upload.any(), auth, comment.likeComment)

router.patch('/comment/:id/unlike',upload.any(), auth, comment.unLikeComment)

router.delete('/comment/:id', auth, comment.deleteComment)



module.exports = router