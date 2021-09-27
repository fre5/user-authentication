import express, { Request, Response, NextFunction } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new UserStore();

const create = async (req: Request, res: Response) => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    account: 'user'
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: User, iat: number };
    await store.authenticate(username, password);
    next();
  } catch (err) {
    res.status(401);
    res.send(err);
  }
};

const postAuthentication = async (req: Request, res: Response) => {
  res.status(200);
  res.send('Authentication successful');
};

const find = async (req: Request, res: Response) => {
  const username = req.body.username;
  try {
    const id = await store.find(username);
    res.json(id);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const updateName = async (req: Request, res: Response) => {
  const username = req.body.username;
  const newFirstname = req.body.newFirstname;
  const newLastname = req.body.newLastname;
  try {
    const update = await store.updateName(newFirstname, newLastname, username);
    res.send(update);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const username = req.body.username;
  const newUsername = req.body.newUsername;
  try {
    const update = await store.updateUser(username, newUsername);
    res.send(update);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const username = req.body.username;
  const newPassword = req.body.newPassword;
  try {
    const update = await store.updatePassword(username, newPassword);
    res.send(update);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  const username = req.body.username;
  try {
    await store.remove(username);
    res.send('User deleted');
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/user', find);
  app.post('/user', create);
  app.post('/user/auth', authenticate, postAuthentication);
  app.put('/user/name', authenticate, updateName);
  app.put('/user/user', authenticate, updateUser);
  app.put('/user/pass', authenticate, updatePassword);
  app.delete('/user', authenticate, remove);
};

export default userRoutes;
