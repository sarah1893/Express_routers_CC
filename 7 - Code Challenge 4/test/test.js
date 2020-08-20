console.log = function() {};
const rewire = require('rewire');
const expect = require('chai').expect;

const appModule = rewire('../app.js');

describe('', function() {
  it('', function() {
    let statusCode = null;
    let sent = null;
    let req = {}
    let res = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      send: function(message) {
        sent = message;
      }
    }
    let nextCalled = false;
    let next = function() {
      nextCalled = true;
    }
    
    let mw = appModule.__get__('errorHandler');
    expect(mw.length, 'errorHandler should take four arguments').to.equal(4);
    
    // Called with no error
    mw({message: ''}, req, res, next);
    expect(statusCode, 'errorHandler should set at 500 error code by default if one isn\'t supplied').to.equal(500);

    statusCode = null;
    sent = null;
    nextCalled = false;

    let err = new Error('message');
    err.status = 401;
    mw(err, req, res, next);
    expect(statusCode, 'errorHandler should set the response status if the error object has a `status` property').to.equal(401);
    expect(sent, 'errorHandler should send the error.message property').to.equal('message');
    expect(nextCalled, 'errorHandler should always send a response and not call `next`.').to.be.false;
  });
});
