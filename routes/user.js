const router = require('express').Router()
const auth = require("../middleware/auth")
const user = require("../controllers/user")
const multer = require('multer');
const upload = multer(); 

router.get('/search', auth, user.searchUser) // done

router.get('/user/:id', auth, user.getUser)  // done

router.patch('/user', upload.any(), auth, user.updateUser)  // done

router.get('/user', auth, user.getProfile)  // done

router.patch('/user/:id/follow', auth, user.follow)  // done

router.patch('/user/:id/unfollow', auth,user.unfollow)  // done

router.get('/suggestionsUser', auth, user.suggestionsUser)  // done



module.exports = router