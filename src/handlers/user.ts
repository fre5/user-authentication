import express, { Request, Response } from 'express';
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

const authenticate = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat: number };
    const user = await store.authenticate(username, password);
    res.json(user);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const find = async (req: Request, res: Response) => {
  const username = req.body.username;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat: number };
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
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat: number };
    const update = await store.updateName(newFirstname, newLastname, username);
    res.json(update);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const username = req.body.username;
  const newUsername = req.body.newUsername;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat: number };
    const update = await store.updateUser(username, newUsername);
    res.json(update);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const username = req.body.username;
  const newPassword = req.body.newPassword;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat: number };
    const update = await store.updatePassword(username, newPassword);
    res.json(update);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat: number };
    await store.remove(id);
    res.send('User deleted');
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/user', find);
  app.post('/user', create);
  app.post('/user/auth', authenticate);
  app.put('/user/name', updateName);
  app.put('/user/user', updateUser);
  app.put('/user/pass', updatePassword);
  app.delete('/user', remove);
};

export default userRoutes;
