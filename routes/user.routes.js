import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send('CREATE new user'));

userRouter.put('/:id', (req, res) => res.send('UPDATE user'));

userRouter.delete('/', (req, res) => res.send('DELETE user'));

export default userRouter;