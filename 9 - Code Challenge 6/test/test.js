console.log = function() {};
const rewire = require('rewire');
const expect = require('chai').expect;
const request = require('supertest');
const fs = require('fs');
const Structured = require('structured');

const appModule = rewire('../app.js');
const code = fs.readFileSync('app.js', 'utf8');

describe('', function() {
  it('', function() {
    
    let appUseStructure = function() {
      app.use('/data/:index', indexExists);
    }

    const isMatch = Structured.match(code, appUseStructure);

    expect(isMatch, 'Did you use app.use and provide the right string path?').to.not.be.false;

  });
  
  it('', function(done) {
    Date.now = () => 4.5;
    
    let app = appModule.__get__('app');

    app.listen(8001, () => {
      request(app)
        .put('/data/25')
        .query({ number: 25 })
        .expect(404)
      .then(() => {
        return request(app)
        .get('/data/34')
        .expect(404)
      })
      .then(() => {
        return request(app)
        .delete('/data/8')
        .expect(404)
      })
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      })
    });
  });
});
