const router = require("express").Router()

const { signIn, signOut, signUp } = require('../controllers/auth.controller');


router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);

module.exports = router;