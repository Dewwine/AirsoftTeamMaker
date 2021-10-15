import app from '../src/app';

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

let token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjIiLCJpZCI6MiwidGltZSI6IjIwMjEtMTAtMTFUMTM6Mzc6MjQuNzYwWiIsImlhdCI6MTYzNDI0Mjc1OSwiZXhwIjoxNjM2ODM0NzU5fQ.8X0OmPijibN01UgSGUxfCP51FVebjCfyUXI3YaKikFU';

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
