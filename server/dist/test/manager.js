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
describe('Managers', () => {
    const testManager = {
        email: 'manager@gmail.com',
        login: 'manager',
        password: 1,
        role: 2,
    };
    const credentials = { login: testManager.login, password: testManager.password };
    let token;
    before((done) => {
        chai_2.default
            .request(app_1.default)
            .post('/api/login')
            .send(credentials)
            .end((_err, res) => {
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body.message).to.be.a('string', 'Success');
            token = res.body.token;
            done();
        });
    });
    after((done) => {
        chai_2.default
            .request(app_1.default)
            .get('/api/logout')
            .send(credentials)
            .end((_err, res) => {
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body.message).to.be.a('string', 'You have been logged out');
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
    describe('/get player', () => {
        const id = 1;
        it('should fetch player successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get(`/api/player/${id}`)
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
    describe('/get logged manager', () => {
        it('should fetch logged manager successfully', (done) => {
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
    describe('/get team requests', () => {
        it('should fetch team requests successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get('/api/teamRequests')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('array');
                done();
            });
        });
    });
});
