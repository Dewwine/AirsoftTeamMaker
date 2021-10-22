import app from '../src/app';

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Admins', () => {
  const testUser = {
    login: 'admin',
    password: 1
  };

  let token: string;

  before((done) => {
    chai
      .request(app)
      .post('/api/login')
      .send(testUser)
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
      .send(testUser)
      .end((_err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.a('string', 'You have been logged out');
        token = '';
        done();
      });
  });

  describe('/get managers', () => {
    it('should fetch all managers successfully', (done) => {
      chai
        .request(app)
        .get('/api/manager')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');

          done();
        });
    });
  });

  describe('/get manager', () => {
    const id = 3;

    it('should fetch manager successfully', (done) => {
      chai
        .request(app)
        .get(`/api/manager/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');

          done();
        });
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

  describe('/get logged admin', () => {
    it('should fetch logged admin successfully', (done) => {
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

  describe('/get manager requests', () => {
    it('should fetch manager requests successfully', (done) => {
      chai
        .request(app)
        .get('/api/managerRequests')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');

          done();
        });
    });
  });
});
