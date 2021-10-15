import app from '../src/app';

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

let token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjEiLCJpZCI6MSwidGltZSI6IjIwMjEtMTAtMTFUMTM6MzY6MzEuODY3WiIsImlhdCI6MTYzNDI0NjMyNiwiZXhwIjoxNjM2ODM4MzI2fQ.HsjqNKML0bDQ4UULW8fyz3iF6HUgX8yCdEoOqH58G4Q';

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