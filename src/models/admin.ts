// @ts-ignore
import Client from '../database';
import bcrypt from 'bcrypt';

export type Admin = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  account: string;
}

const saltRounds: string = process.env.SALT_ROUNDS as string;
const pepper: (string|undefined) = process.env.BCRYPT_PASSWORD;

export class AdminStore {
  async create (a: Admin): Promise<Admin> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT username FROM admin WHERE username=($1)';
      const result = await conn.query(sql, [a.username]);
      const row = result.rows[0];

      if (row) {
        throw new Error('Username not available');
      } else {
        const sql = 'INSERT INTO admin (firstname, lastname, username, password_digest, account) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const hash = bcrypt.hashSync(a.password + pepper, parseInt(saltRounds));
        const result = await conn.query(sql, [a.firstname, a.lastname, a.username, hash, a.account]);
        const admin = result.rows[0];
        conn.release();
        return admin;
      }
    } catch (err) {
      throw new Error(`Unable to create a new admin user ${err}`);
    }
  }

  async authenticate (username: string, password: string): Promise<Admin|null> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'SELECT account, password_digest FROM admin WHERE username=($1)';
    const result = await conn.query(sql, [username]);
    if (result.rows.length) {
      const admin = result.rows[0];
      if (bcrypt.compareSync(password + pepper, admin.password_digest)) {
        conn.release();
        return admin;
      }
    }
    conn.release();
    return null;
  }

  async find (username: string): Promise<{ id: number }> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT id FROM admin WHERE username=($1)';
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get id from username ${username} ${err}`);
    }
  }

  async updateName (newFirstname: string, newLastname: string, username: string): Promise<string|undefined> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      let sql = 'SELECT firstname, lastname FROM admin WHERE username=($1)';
      let result = await conn.query(sql, [username]);
      result = result.rows[0];
      newFirstname = newFirstname || result.firstname;
      newLastname = newLastname || result.lastname;
      if (result.firstname !== newFirstname || result.lastName !== newLastname) {
        sql = 'UPDATE admin SET firstname=($1), lastname=($2) WHERE username=($3)';
        await conn.query(sql, [newFirstname, newLastname, username]);
        return 'Name update success';
      }
      conn.release();
    } catch (err) {
      throw new Error(`Unable to update user information ${err}`);
    }
  }

  async updateUser (username: string, newUsername: string): Promise<string> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT username FROM admin WHERE username=($1)';
      const result = await conn.query(sql, [newUsername]);
      const row = result.rows[0];
      if (row) {
        throw new Error('Username not available');
      } else {
        const newSql = 'UPDATE admin SET username=($2) WHERE username=($1)';
        await conn.query(newSql, [username, newUsername]);
        conn.release();
        return 'Username update success';
      }
    } catch (err) {
      throw new Error(`Unable to update username ${err}`);
    }
  }

  async updatePassword (username: string, newPassword: string): Promise<string|undefined> {
    try {
      // @ts-ignore
      const same = await this.authenticate(username, newPassword);
      if (!same) {
        // @ts-ignore
        const conn = await Client.connect();
        const newSql = 'UPDATE admin SET password_digest=($1) WHERE username=($2)';
        const hash = bcrypt.hashSync(newPassword + pepper, parseInt(saltRounds));
        await conn.query(newSql, [hash, username]);
        conn.release();
        return 'Password update success';
      }
    } catch (err) {
      throw new Error(`Unable to update password ${err}`);
    }
  }

  async remove (username: string): Promise<string> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'DELETE FROM admin WHERE username=($1)';
      await conn.query(sql, [username]);
      conn.release();
      return 'Admin account removal success';
    } catch (err) {
      throw new Error(`Unable to delete user username ${username}`);
    }
  }

  async indexUser (): Promise<{ id: number, firstname: string, lastname: string, username: string }> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT id, firstname, lastname, username FROM users';
      const results = await conn.query(sql);
      const row = results.rows[0];
      conn.release();
      return row;
    } catch (err) {
      throw new Error(`Unable to retrieve all users ${err}`);
    }
  }
}
