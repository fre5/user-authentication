import app from '../../src/server';
import supertest from 'supertest';
import { Admin } from '../../src/models/admin';
import { User } from '../../src/models/user';

const request = supertest(app);

let adminToken: string;
let userToken: string;

const admin: Admin = {
  firstname: 'test-admin-firstname',
  lastname: 'test-admin-lastname',
  username: 'test-admin-username',
  password: 'test-admin-password',
  account: 'admin'
};

const user: User = {
  firstname: 'test-user-firstname',
  lastname: 'test-user-lastname',
  username: 'test-user-username',
  password: 'test-user-password',
  account: 'user'
};

describe('Admin tests', () => {
  it('Create an admin account', async () => {
    const response = await request.post('/admin').send(admin);
    adminToken = 'Bearer ' + response.body;
    expect(response.status).toBe(200);
  });

  it('Authenticate admin account', async () => {
    const response = await request
      .post('/admin/auth').set('Authorization', adminToken)
      .send({ username: admin.username, password: admin.password, account: admin.account });
    expect(response.status).toBe(200);
  });

  it('Get id from a username', async () => {
    const response = await request
      .get('/admin').set('Authorization', adminToken)
      .send({ username: admin.username });
    expect(response.status).toBe(200);
  });

  it('Name update', async () => {
    const response = await request
      .put('/admin/name').set('Authorization', adminToken)
      .send({ newFirstname: 'new-test-admin-firstname', newLastname: 'new-test-admin-lastname', username: admin.username });
    expect(response.status).toBe(200);
  });

  it('Username update', async () => {
    const response = await request
      .put('/admin/user').set('Authorization', adminToken)
      .send({ newUsername: 'new-test-admin-username' });
    expect(response.status).toBe(200);
  });

  it('Password update', async () => {
    const response = await request
      .put('/admin/pass').set('Authorization', adminToken)
      .send({ newPassword: 'new-test-admin-password' });
    expect(response.status).toBe(200);
  });

  it('Remove admin account', async () => {
    const response = await request
      .delete('/admin').set('Authorization', adminToken)
      .send({ username: 'new-test-admin-username' });
    expect(response.status).toBe(200);
  });

  it('Retrieve all user accounts info', async () => {
    const response = await request
      .get('/admin/users').set('Authorization', adminToken);
    expect(response.status).toBe(200);
  });
});

describe('User tests', () => {
  it('Create an admin account', async () => {
    const response = await request.post('/user').send(user);
    userToken = 'Bearer ' + response.body;
    expect(response.status).toBe(200);
  });

  it('Authenticate user account', async () => {
    const response = await request
      .post('/user/auth').set('Authorization', userToken)
      .send({ username: user.username, password: user.password, account: user.account });
    expect(response.status).toBe(200);
  });

  it('Get id from a username', async () => {
    const response = await request
      .get('/user').set('Authorization', userToken)
      .send({ username: user.username });
    expect(response.status).toBe(200);
  });

  it('Name update', async () => {
    const response = await request
      .put('/user/name').set('Authorization', userToken)
      .send({ newFirstname: 'new-test-user-firstname', newLastname: 'new-test-user-lastname', username: user.username });
    expect(response.status).toBe(200);
  });

  it('Username update', async () => {
    const response = await request
      .put('/user/user').set('Authorization', userToken)
      .send({ newUsername: 'new-test-user-username' });
    expect(response.status).toBe(200);
  });

  it('Password update', async () => {
    const response = await request
      .put('/user/pass').set('Authorization', userToken)
      .send({ newPassword: 'new-test-user-password' });
    expect(response.status).toBe(200);
  });

  it('Remove user account', async () => {
    const response = await request
      .delete('/user').set('Authorization', userToken)
      .send({ username: 'new-test-user-username' });
    expect(response.status).toBe(200);
  });
});
