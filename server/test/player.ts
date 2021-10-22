import app from '../src/app';

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Players', () => {
  const testUser = {
    email: 'testPlayer@gmail.com',
    login: 'testPlayer',
    password: 'testPlayer',
    role: 3,
  };

  let token: string;

  before((done) => {
    chai
      .request(app)
      .post('/api/register')
      .send(testUser)
      .end((_err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.a('string', 'Success');
        token = res.body.token;
        done();
      });
  });

  after((done) => {
    const credentials = { login: testUser.login, password: testUser.password }
    
    chai
      .request(app)
      .delete('/api/deleteprofile')
      .send(credentials)
      .end((_err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.a('string', 'Profile deleted');
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

  describe('/get logged player', () => {
    it('should fetch logged player successfully', (done) => {
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

  describe('/post application in team', () => {
    it('should post an application', (done) => {
      chai
        .request(app)
        .post('/api/teams/teamA/apply')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.a('string', 'Application sent');

          done();
        });
    });
  });

  describe('/delete application in team', () => {
    it('should delete application', (done) => {
      chai
        .request(app)
        .delete('/api/teams/teamA/cancel')
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.a('string', 'Application cancelled');

          done();
        });
    });
  });
});
