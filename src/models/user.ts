// @ts-ignore
import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  account: string;
}

const saltRounds: string = process.env.SALT_ROUNDS as string;
const pepper: (string|undefined) = process.env.BCRYPT_PASSWORD;

export class UserStore {
  async create (u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT username FROM users WHERE username=($1)';
      const result = await conn.query(sql, [u.username]);
      const row = result.rows[0];

      if (row) {
        throw new Error('Username not available');
      } else {
        const sql = 'INSERT INTO users (firstname, lastname, username, password_digest, account) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
        const result = await conn.query(sql, [u.firstname, u.lastname, u.username, hash, u.account]);
        const user = result.rows[0];
        conn.release();
        return user;
      }
    } catch (err) {
      throw new Error(`Unable to create a new user ${err}`);
    }
  }

  async authenticate (username: string, password: string): Promise<User|null> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'SELECT account, password_digest FROM users WHERE username=($1)';
    const result = await conn.query(sql, [username]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        conn.release();
        return user;
      }
    }
    conn.release();
    return null;
  }

  async find (username: string): Promise<{ id: number }> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT id FROM users WHERE username=($1)';
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get id from username ${username} ${err}`);
    }
  }

  async updateName (newFirstname: string, newLastname: string, username: string): Promise<string> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      let sql = 'SELECT firstname, lastname FROM users WHERE username=($1)';
      let result = await conn.query(sql, [username]);
      result = result.rows[0];
      if (result.firstname !== newFirstname || result.lastName !== newLastname) {
        sql = 'UPDATE users SET firstname=($1), lastname=($2) WHERE username=($3)';
        await conn.query(sql, [newFirstname, newLastname, username]);
      }
      conn.release();
      return 'Name update success';
    } catch (err) {
      throw new Error(`Unable to update user information ${err}`);
    }
  }

  async updateUser (username: string, newUsername: string): Promise<string> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT username FROM users WHERE username=($1)';
      const result = await conn.query(sql, [newUsername]);
      const row = result.rows[0];
      if (row) {
        throw new Error('Username not available');
      } else {
        const newSql = 'UPDATE users SET username=($2) WHERE username=($1)';
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
      const same = await this.authenticate(username, newPassword);
      if (!same) {
        // @ts-ignore
        const conn = await Client.connect();
        const newSql = 'UPDATE users SET password_digest=($1) WHERE username=($2)';
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
      const sql = 'DELETE FROM users WHERE username=($1)';
      await conn.query(sql, [username]);
      conn.release();
      return 'User account removal success';
    } catch (err) {
      throw new Error(`Unable to delete user username ${username}`);
    }
  }
}
