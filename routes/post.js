const router = require('express').Router()
const post = require('../controllers/post')
const auth = require('../middleware/auth')
const multer = require('multer');
const upload = require('../config/multerConfig');

router.route('/posts')
    .post(auth,upload.any(), post.createPost)
    .get(auth, post.getPosts)  // done


router.route('/post/:id')
    .patch(auth, post.updatePost)
    .get(auth, post.getPost)
    .delete(auth, post.deletePost)  // done

router.patch('/post/:id/like', auth, post.likePost) // done

router.patch('/post/:id/unlike', auth, post.unLikePost) // done

router.get('/user_posts/:id', auth, post.getUserPosts) // done

router.get('/post_discover', auth, post.getPostsDiscover) // done

router.patch('/savePost/:id', auth, post.savePost)      // done

router.patch('/unSavePost/:id', auth, post.unSavePost)  // done

router.get('/getSavePosts', auth, post.getSavePosts)    // done


module.exports = router