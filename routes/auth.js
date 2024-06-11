const router = require('express').Router()
const auth = require('../controllers/auth')
const multer = require('multer');
const upload = require('../config/multerConfig');


router.post('/register', upload.any(), auth.register);  // done


router.post('/login', upload.any(), auth.login);     // done



router.post('/logout', auth.logout)   // done

router.post('/refresh_token', auth.generateAccessToken)   // done


module.exports = router