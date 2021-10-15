import app from '../src/app';

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

let token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjMiLCJpZCI6MywidGltZSI6IjIwMjEtMTAtMTFUMTM6Mzc6NDkuMzk3WiIsImlhdCI6MTYzNDI0NjI5NCwiZXhwIjoxNjM2ODM4Mjk0fQ.zu71dy-vVu_eP2iPb5o0twFdNlO_CDPtZj1gaTAuFx0';

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