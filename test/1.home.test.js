const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest');
const session = require('supertest-session')(app);

describe('/home', () => {
  before('create session', (done) => {
    session.post('/login')
      .type('form')
      .send({
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD
      })
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should get a restricted page', function (done) {
    session.get('/home')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.contain(process.env.TEST_USER);
        return done();
      });
  });

  it('should not let an unauthorized user get home', (done) => {
    request(app).get('/home')
      .expect(302)
      .expect('Location', '/login')
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should log out a user', () => {
    session.post('/logout')
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
      });
  });

  // it('should let the user delete account', (done) => {
  //   authenticatedSession.get('/home/delete')
  //   .expect(200)
  //   .end((err, res) => {
  //     if (err) return done(err);
  //     expect(res.text).to.contain('Confirm account deletion');
  //     authenticatedSession.post('/home/delete')
  //       .type('form')
  //       .send({
  //         confirm: true
  //       })
  //       .expect(302)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         return done();
  //       });
  //   });
  // });

  // it('should let the user change name', (done) => {
  //   authenticatedSession.post('/home/edit')
  //     .type('form')
  //     .send({
  //       newusername: 'newname'
  //     })
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       expect(res.text).to.contain('newname');
  //       return done();
  //     });
  // });
});