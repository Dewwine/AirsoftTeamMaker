"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const chai_1 = require("chai");
const chai_2 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
chai_2.default.use(chai_http_1.default);
describe('Players', () => {
    const testUser = {
        email: 'testPlayer@gmail.com',
        login: 'testPlayer',
        password: 'testPlayer',
        role: 3,
    };
    let token;
    before((done) => {
        chai_2.default
            .request(app_1.default)
            .post('/api/register')
            .send(testUser)
            .end((_err, res) => {
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body.message).to.be.a('string', 'Success');
            token = res.body.token;
            done();
        });
    });
    after((done) => {
        const credentials = { login: testUser.login, password: testUser.password };
        chai_2.default
            .request(app_1.default)
            .delete('/api/deleteprofile')
            .send(credentials)
            .end((_err, res) => {
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body.message).to.be.a('string', 'Profile deleted');
            token = '';
            done();
        });
    });
    describe('/get players', () => {
        it('should fetch all players successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get('/api/player')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('array');
                done();
            });
        });
    });
    describe('/get logged player', () => {
        it('should fetch logged player successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get('/api/me')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('object');
                done();
            });
        });
    });
    describe('/get players in team', () => {
        const team = 'teamA';
        it('should fetch team successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get(`/api/teams/${team}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('array');
                done();
            });
        });
    });
    describe('/post application in team', () => {
        it('should post an application', (done) => {
            chai_2.default
                .request(app_1.default)
                .post('/api/teams/teamA/apply')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body.message).to.be.a('string', 'Application sent');
                done();
            });
        });
    });
    describe('/delete application in team', () => {
        it('should delete application', (done) => {
            chai_2.default
                .request(app_1.default)
                .delete('/api/teams/teamA/cancel')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body.message).to.be.a('string', 'Application cancelled');
                done();
            });
        });
    });
});
