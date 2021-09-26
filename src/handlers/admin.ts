import express, { Request, Response } from 'express';
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
    const decoded: { admin: Admin, iat: number } =
      jwt.verify(token, process.env.TOKEN_SECRET as string) as { admin: Admin, iat: number };
    console.log(decoded);
    if (decoded.admin.account !== 'admin') {
      throw new Error('Not admin account');
    } else {
      const admin = await store.authenticate(username, password);
      res.json(admin);
    }
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
    res.send('Admin deleted');
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const indexUser = async (req: Request, res: Response) => {
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { id: number, username: string, passwordDigest: string }, iat:number };
    const index = await store.indexUser();
    res.json(index);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
}

const adminRoutes = (app: express.Application) => {
  app.get('/admin', find);
  app.post('/admin', create);
  app.post('/admin/auth', authenticate);
  app.put('/admin/name', updateName);
  app.put('/admin/user', updateUser);
  app.put('/admin/pass', updatePassword);
  app.delete('/admin', remove);
  app.get('/admin/userindex', indexUser);
};

export default adminRoutes;
