console.log = function() {};
const assert = require('chai').assert;
const expect = require('chai').expect;
const fs = require('fs');
const Structured = require('structured');

const code = fs.readFileSync('app.js', 'utf8');

describe('test', function () {
  it('test', function() {
    const codeMatch = code.match(/(const|var|let)\s*([\S]+?)\s*=\s*require\s*\(\s*('|"|`)\s*(cors)\s*('|"|`)\)/);
    assert.isOk(codeMatch, "Did you require the correct package to handle CORS requests?");

    const varName = codeMatch[2];

    const morganUseStruct = function() {
      app.use($funcName());
    }

    const varCbs = [
      function($funcName) {
        if ($funcName.name !== varName) {
          return {
            failure: 'Did you use the `cors` module you imported?',
          }
        } else {
          return true;
        }
      }
    ]

    let isCallbackMatch = Structured.match(code, morganUseStruct, {varCallbacks: varCbs});
    failureMessage = varCbs.failure || "Did you import and use the correct module for CORS requests?";
    assert.isOk(isCallbackMatch, failureMessage);

  });
});
