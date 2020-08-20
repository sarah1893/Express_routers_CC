console.log = function() {};
const fs = require('fs');
const expect = require('chai').expect;
const assert = require('chai').assert;
const code = fs.readFileSync('app.js', 'utf8');
const Structured = require('structured');
const rewire = require('rewire');
const request = require('supertest');

describe('', function() {
  it('', function(done) {
    process.env.PORT = 8001;
    const appModule = rewire('../app.js');
    const app = appModule.__get__('app');

    let shouldNotMatchStructs = [
      function() {
        app.get('/spices/:spiceId', (req, res, next) => {
          const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);
          res.status(404).send('Spice does not exist!');
        });
      },
      function() {
        app.put('/spices/:spiceId', (req, res, next) => {
          const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);
          res.status(404).send('Spice does not exist!');
        });
      },
      function() {
        app.delete('/spices/:spiceId', (req, res, next) => {
          const spiceIndex = spiceRack.findIndex(spice => spice.id === spiceId);
          res.status(404).send('Spice does not exist!');
        });
      }
    ];

    shouldNotMatchStructs.forEach((struct) => {
      const match = Structured.match(code, struct);
      expect(match, 'Did you remove the duplicate code from all `/spices/:spiceId` routes?').to.be.false;
    });

    const spiceRack = appModule.__get__('spiceRack');
    const findIndex = index => spiceRack.findIndex(el => el.id === Number(index));

    let toUpdate;
    request(app)
    .get('/spices/1')
    .then(response => {
      expect(response.body, 'After refactoring, your GET /spices/:spiceId should still send back the proper spice.').to.deep.equal(spiceRack[findIndex(1)]);
      expect(response.status, 'After refactoring, your GET /spices/:spiceId should still send back the proper spice.').to.equal(200);
    })
    .then(() => {
      toUpdate = spiceRack[findIndex(1)];
      toUpdate.name = 'test';
      return request(app)
      .put('/spices/1')
      .send({spice: toUpdate});
    })
    .then(response => {
      expect(response.body, 'After refactoring, your PUT /spices/:spiceId should send back the updated spice.').to.be.deep.equal(toUpdate);
      expect(response.body, 'After refactoring, your PUT /spices/:spiceId should still correctly update the `spiceRack` array.').to.deep.equal(spiceRack[findIndex(1)]);
    })
    .then(() => {
      return request(app)
      .del('/spices/1');
    })
    .then(response => {
      expect(response.status, 'After refactoring, your DELETE /spices/:spiceId should still send back a 204 response.').to.equal(204);
      expect(findIndex(1), 'After refactoring, your DELETE /spices/:spiceId should still delete the spice from `spiceRack`.').to.equal(-1);
      done();
    })
    .catch(done);
  });
});
