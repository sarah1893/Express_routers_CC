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
    process.env.PORT = 8000;
    const appModule = rewire('../app.js');
    const app = appModule.__get__('app');
    let snackIdHandler;
    try {
      snackIdHandler = app._router.params.snackId[0];
    } catch (e) {
      expect(e, 'Did you create an `app.param` function to handle routes with the `snackId` param?').to.not.exist
    }
    expect(snackIdHandler.length, 'Does your app.param callback have four arguments?').to.equal(4);

    let status = null;;
    let sent = null;
    const req = {
      params: {
        id: 'fakeId'
      }
    };
    const res = {
      status: function(code) { 
        status = code;
        return this;
      },
      send: function(arg) {
        sent = arg;
      },
      sendStatus: function(code) {
        this.status(code).send();
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    }

    // test with a bad id
    snackIdHandler(req, res, next, 'fakeId');
    expect(nextCalled, 'Your `app.param` callback should not call `next` with an invalid snackId').to.be.false;
    expect(status, 'Your `app.param` callback should set a 404 status code').to.equal(404);
    expect(sent, 'Did you sent the same error resposne for a nonexistent spice?').to.equal('Snack not found!');

    status = null;
    sent = null;
    nextCalled = false;
    req.params.id = '1';
    snackIdHandler(req, res, next, '1');
    expect(status, 'Your `app.param` handler should not set a response status for a valid spice').to.be.null;
    expect(sent, 'Your `app.param` callback should not send a response for a valid spice.').to.be.null;
    expect(nextCalled, 'Your `app.param` callback should call next with a valid `snackId`').to.be.true;

    const vendingMachine = appModule.__get__('vendingMachine');
    const snackIndex = vendingMachine.findIndex(el => el.id === 1);
    expect(req.snackIndex, 'Your `app.param` should set a `req.snackIndex` for a valid `snackId` route parameter.').to.equal(snackIndex);

    let shouldNotMatchStructs = [
      function() {
        app.get('/snacks/:snackId', (req, res, next) => {
          const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
          res.status(404).send('Snack not found!');
        });
      },
      function() {
        app.put('/snacks/:snackId', (req, res, next) => {
          const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
          res.status(404).send('Snack not found!');
        });
      },
      function() {
        app.delete('/snacks/:snackId', (req, res, next) => {
          const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
          res.status(404).send('Snack not found!');
        });
      }
    ];

    shouldNotMatchStructs.forEach((struct) => {
      const match = Structured.match(code, struct);
      expect(match, 'Did you remove the duplicate code from all `snacks/:snackId` routes?').to.be.false;
    });

    const findIndex = index => vendingMachine.findIndex(el => el.id === Number(index));

    let toUpdate;
    request(app)
    .get('/snacks/1')
    .then(response => {
      expect(response.body, 'After refactoring, your GET /snacks/:snackId should still send back the proper spice.').to.deep.equal(vendingMachine[findIndex(1)]);
      expect(response.status, 'After refactoring, your GET /snacks/:snackId should still send back the proper spice.').to.equal(200);
    })
    .then(() => {
      toUpdate = vendingMachine[findIndex(1)];
      toUpdate.name = 'test';
      return request(app)
      .put('/snacks/1')
      .send(toUpdate);
    })
    .then(response => {
      expect(response.body, 'After refactoring, your PUT /snacks/:snackId should send back the updated spice.').to.be.deep.equal(toUpdate);
      expect(response.body, 'After refactoring, your PUT /snacks/:snackId should still correctly update the `vendingMachine` array.').to.deep.equal(vendingMachine[findIndex(1)]);
    })
    .then(() => {
      return request(app)
      .delete('/snacks/1');
    })
    .then(response => {
      expect(response.status, 'After refactoring, your DELETE /snacks/:snackId should still send back a 204 response.').to.equal(204);
      expect(findIndex(1), 'After refactoring, your DELETE /snacks/:snackId should still delete the spice from `vendingMachine`.').to.equal(-1);
      done();
    })
    .catch(done);
  });
});