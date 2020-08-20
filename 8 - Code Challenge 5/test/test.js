console.log = function() {};
const assert = require('chai').assert;
const expect = require('chai').expect;
const fs = require('fs');
const Structured = require('structured');

const code = fs.readFileSync('app.js', 'utf8');

describe('test', function () {
  it('test', function() {
    const codeMatch = code.match(/(const|var|let)\s*([\S]+?)\s*=\s*require\s*\(\s*('|"|`)\s*(morgan)\s*('|"|`)\)/);
    assert.isOk(codeMatch, "Did you require the 'morgan' package for logging?");

    const varName = codeMatch[2];

    const morganUseStruct = function() {
      app.use($funcName($preset));
      app.get(_);
      app.get(_);
    }

    const varCbs = [
      function($funcName, $preset) {
        if ($funcName.name !== varName) {
          return {
            failure: 'Did you use the logging module you imported?'
          }
        } else if ($preset.value !== 'short') {
          return {
            failure: 'Did you use the the `short` preset for your logging?'
          }
        } else {
          return true;
        }
      }
    ]

    let isCallbackMatch = Structured.match(code, morganUseStruct, {varCallbacks: varCbs});
    failureMessage = varCbs.failure || "Did you import and use the correct logging module and use it correctly";
    assert.isOk(isCallbackMatch, failureMessage);

  });
});
