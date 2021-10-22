import app from '../src/app';

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Managers', () => {
  const testManager = {
    email: 'manager@gmail.com',
    login: 'manager',
    password: 1,
    role: 2,
  };

  const credentials = { login: testManager.login, password: testManager.password }
  
  let token: string;

  before((done) => {
    chai
      .request(app)
      .post('/api/login')
      .send(credentials)
      .end((_err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.a('string', 'Success');
        token = res.body.token;
        done();
      });
  });

  after((done) => {
    
    chai
      .request(app)
      .get('/api/logout')
      .send(credentials)
      .end((_err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.a('string', 'You have been logged out');
        token = '';
        done();
      });
  });

  describe('/get players', () => {
    it('should fetch all players successfully', (done) => {
      chai
        .request(app)
        .get('/api/player')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');

          done();
        });
    });
  });

  describe('/get player', () => {
    const id = 1;

    it('should fetch player successfully', (done) => {
      chai
        .request(app)
        .get(`/api/player/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');

          done();
        });
    });
  });

  describe('/get players in team', () => {
    const team = 'teamA';

    it('should fetch team successfully', (done) => {
      chai
        .request(app)
        .get(`/api/teams/${team}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');

          done();
        });
    });
  });

  describe('/get logged manager', () => {
    it('should fetch logged manager successfully', (done) => {
      chai
        .request(app)
        .get('/api/me')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');

          done();
        });
    });
  });

  describe('/get team requests', () => {
    it('should fetch team requests successfully', (done) => {
      chai
        .request(app)
        .get('/api/teamRequests')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');

          done();
        });
    });
  });
});
