const router = require('express').Router();

const {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
} = require('../controllers/user.controller');

const authorize = require('../middlewares/auth.middleware');

router.get('/', getUsers);
router.get('/:id', authorize, getUser);
router.post('/', createUser);
router.put('/:id', authorize, updateUser);
router.delete('/', authorize, deleteUser);

module.exports = router;