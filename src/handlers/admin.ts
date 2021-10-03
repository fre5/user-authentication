import express, { Request, Response, NextFunction } from 'express';
import { Admin, AdminStore } from '../models/admin';
import jwt from 'jsonwebtoken';

const store = new AdminStore();

const create = async (req: Request, res: Response) => {
  const admin: Admin = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    account: 'admin'
  };
  try {
    const newAdmin = await store.create(admin);
    const token = jwt.sign({ admin: newAdmin }, process.env.TOKEN_SECRET as string);
    res.json(token);
    res.send('User created');
  } catch (err) {
    res.status(400);
    res.send('User creation failed');
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    const decoded: { admin: Admin, iat: number } =
      jwt.verify(token, process.env.TOKEN_SECRET as string) as { admin: Admin, iat: number };
    if (decoded.admin.account !== 'admin') {
      throw new Error('Not admin account');
    } else {
      await store.authenticate(username, password);
      next();
    }
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
    res.send(`Name updated: ${update}`);
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
    res.send(`Username updated: ${update}`);
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
    res.send('Password updated');
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  const username = req.body.username;
  try {
    await store.remove(username);
    res.send('Admin deleted');
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const indexUser = async (req: Request, res: Response) => {
  try {
    const index = await store.indexUser();
    res.json(index);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
}

const adminRoutes = (app: express.Application) => {
  app.post('/admin', create);
  app.post('/admin/auth', authenticate, postAuthentication);
  app.put('/admin/name', authenticate, updateName);
  app.put('/admin/user', authenticate, updateUser);
  app.put('/admin/pass', authenticate, updatePassword);
  app.delete('/admin', authenticate, remove);
  app.get('/admin', authenticate, find);
  app.get('/admin/users', authenticate, indexUser);
};

export default adminRoutes;
