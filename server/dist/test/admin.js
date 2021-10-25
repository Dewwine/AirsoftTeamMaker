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
describe('Admins', () => {
    const testUser = {
        login: 'admin',
        password: 1
    };
    let token;
    before((done) => {
        chai_2.default
            .request(app_1.default)
            .post('/api/login')
            .send(testUser)
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
            .send(testUser)
            .end((_err, res) => {
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body.message).to.be.a('string', 'You have been logged out');
            token = '';
            done();
        });
    });
    describe('/get managers', () => {
        it('should fetch all managers successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get('/api/manager')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('array');
                done();
            });
        });
    });
    describe('/get manager', () => {
        const id = 3;
        it('should fetch manager successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get(`/api/manager/${id}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('object');
                done();
            });
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
    describe('/get logged admin', () => {
        it('should fetch logged admin successfully', (done) => {
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
    describe('/get manager requests', () => {
        it('should fetch manager requests successfully', (done) => {
            chai_2.default
                .request(app_1.default)
                .get('/api/managerRequests')
                .set({ Authorization: `Bearer ${token}` })
                .end((_err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.be.a('array');
                done();
            });
        });
    });
});
