console.log = function() {};
const fs = require('fs');
const assert = require('chai').assert;
const Structured = require('structured');
const request = require('supertest');
const rewire = require('rewire');
const expect = require('chai').expect;
const code = fs.readFileSync('spicesRouter.js', 'utf8');

describe('', function() {
  it('', function(done) {
    let stringStruct = function() {
      router.post($path, ($req, $res, $next) => {
        newSpice.spiceRackId = $req.params.spiceRackId;
        spices.push(newSpice);
      });
    }
    
    let struct = function() {
      router.post($path, ($req, $res, $next) => {
        newSpice.spiceRackId = Number($req.params.spiceRackId);
        spices.push(newSpice);
      });
    }

    const isStringMatch = Structured.match(code, stringStruct);
    const isMatch = Structured.match(code, struct);
    assert.isOk((isStringMatch || isMatch), 'Did you set `newSpice.spiceRackId` equal to `Number(req.spiceRack.id)`?');
    assert.isNotOk(isStringMatch, 'Did you remember to convert `req.spiceRack.id` to a number using `Number()`?');

    process.env.PORT = 8000;
    const appModule = rewire('../app.js');
    const app = appModule.__get__('app');

    request(app)
    .post('/spice-racks/1/spices')
    .send({
      spice: {
        name: 'test spice',
        grams: 1
      }
    })
    .then((response) => {
      expect(response.status, 'Does your POST route still send the `newSpice`?').to.equal(201);
      expect(response.body, 'Does your POST route still send the `newSpice`?').to.have.property('name', 'test spice');
      expect(response.body, 'Does your POST route still send the `newSpice`?').to.have.property('spiceRackId', 1);
      expect(response.body, 'Does your POST route still send the `newSpice`?').to.have.property('grams', 1);
      done();
    })
    .catch(done);
  });
});
