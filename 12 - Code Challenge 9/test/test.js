console.log = function() {};
const rewire = require('rewire');
const request = require('supertest');
const expect = require('chai').expect;
const fs = require('fs');
const Structured = require('structured');

const appModule = rewire('../app.js');
const code = fs.readFileSync('app.js', 'utf8');
const router = appModule.__get__('appleRouter');
const routerForRequests = rewire('../app.js').__get__('appleRouter');

describe('', function() {
  it('', function(done) {
    const appleDb = appModule.__get__('apples');
    const paramFn = router.params.variety.pop();
    let statusCode = null;
    let sent = null;
    let req = {}
    let res = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      send: function(message) {
        sent = message || true;
      },
      sendStatus: function(code) {
        this.status(code).send();
      }
    }
    let nextCalled = false;
    let next = function() {
      nextCalled = true;
    }

    let realAppleKey = Object.keys(appleDb)[0];
    paramFn(req, res, next, realAppleKey);
    expect(nextCalled, 'Does your param call next with a real apple?').to.be.true;
    expect(req.variety, 'Does your param middleware attach the requested variety to `req.variety`?').to.equal(appleDb[realAppleKey]);

    req = {};
    statusCode = null;
    sent = null;
    nextCalled = false;

    paramFn(req, res, next, 'fakeApple');
    expect(nextCalled, 'Be sure not to call next if a non-existent variety of apple is requested').to.be.false;
    expect(statusCode, 'Does a request for a nonexistent apple variety send a 404 response?').to.equal(404);
    expect(sent, 'Does your middleware send a response if a non-existent apple variety is requested?').to.not.be.null;

    let shouldNotMatchStructs = [
      function() {
        appleRouter.get('/:variety/description', (req, res, next) => {
          const variety = req.params.variety;
          if (apples[variety]) {
            res.status(404).send();
          }
        });
      },
      function() {
        appleRouter.get('/:variety/price-range', (req, res, next) => {
          const variety = req.params.variety;
          if (apples[variety]) {
            res.status(404).send();
          }
        });
      },
      function() {
        appleRouter.get('/:variety/color', (req, res, next) => {
          const variety = req.params.variety;
          if (apples[variety]) {
            _
          } else {
            res.status(404).send();
          }
        });
      }
    ];

    shouldNotMatchStructs.forEach((struct) => {
      // console.log = () => {}
      const match = Structured.match(code, struct);
      expect(match, 'Did you remove the duplicate code for sending 404s and replace it by sending the correct field from req.variety?').to.be.false;
    });
    
    const app = require('express')();
    app.use(routerForRequests);
    app.listen(4001, () => {
      request(app)
      .get(`/${realAppleKey}/description`)
      .then(res => res.text)
      .then((text) => {
        expect(text, 'Does your description route send the req.variety.description?').to.equal(appleDb[realAppleKey].description);
      })
      .then(() => {
        return request(app)
        .get(`/${realAppleKey}/price-range`)
      })
      .then(res => res.text)
      .then((text) => {
        expect(text, 'Does your price-range route send the req.variety.priceRange?').to.equal(appleDb[realAppleKey].priceRange);
      })
      .then(() => {
        return request(app)
        .get(`/${realAppleKey}/color`)
      })
      .then(res => res.text)
      .then((text) => {
        expect(text, 'Does your color route send the req.variety.color?').to.equal(appleDb[realAppleKey].color);
        done();
      })
      .catch(err => done(err))

    });

  });
});
