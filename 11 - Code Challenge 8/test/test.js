console.log = function() {};
const rewire = require('rewire');
const request = require('supertest');
const expect = require('chai').expect;
const appModule = rewire('../app.js');

describe('', function() {
  it('', function(done) {
    let app = appModule.__get__('app');
    let admins = appModule.__get__('secretData').adminUsers;
    app.listen(8001, () => {
      request(app)
      .get('/notAdmin/colors')
      .then(res => {
        expect(res.status, "Don't restrict access to the /:userId/colors route").to.equal(200);
      })
      .then(() => {
        return request(app)
        .get('/notAdmin/numbers')
        .then(res => {
          expect(res.status, "Don't restrict access to the /:userId/numbers route").to.equal(200);
        })
      })
      .then(() => {
        return request(app)
        .get('/notAdmin/phone-numbers')
        .then(res => {
          expect(res.status, "Be sure to restrict access for non-admins to /:userId/phone-numbers").to.equal(401);
        })
      })
      .then(() => {
        return request(app)
        .get('/notAdmin/fav-sites')
        .then(res => {
          expect(res.status, "Be sure to restrict access for non-admins to /:userId/fav-sites").to.equal(401);
        })
      })
      .then(() => {
        return request(app)
        .get(`/${admins[0]}/phone-numbers`)
        .then(res => {
          expect(res.status, "Don't restrict access to the /:userId/phone-numbers route for admin users").to.equal(200);
        })
      })
      .then(() => {
        return request(app)
        .get(`/${admins[0]}/fav-sites`)
        .then(res => {
          expect(res.status, "Don't restrict access to the /:userId/fav-sites route for admin users").to.equal(200);
          done();
        })
      })
      .catch(err => done(err));
    });
  });
});
