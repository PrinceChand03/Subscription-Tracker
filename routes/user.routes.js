import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', (req, res) => res.send('CREATE new user'));

userRouter.put('/:id', (req, res) => res.send('UPDATE user'));

userRouter.delete('/', (req, res) => res.send('DELETE user'));

export default userRouter;