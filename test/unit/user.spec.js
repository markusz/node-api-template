'use strict';
/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, no-undef: 0 */

const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('user.js', function() {
  let sandbox;
  let user;
  let User;
  let mockedLodash;

  // providing a done() callback makes before, beforeEach, after, afterEach, it async and test only complete when done() is called
  // would not be necessary here however
  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();

    mockedLodash = {
      capitalize: sandbox.stub()
    };

    User = require('../../src/models/user').inject(mockedLodash);
    user = new User('Alice', 1942);
    done();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('Constructor', function() {
    it('sets the calculated age as a instance attribute', function() {
      expect(user.age).to.be.ok;
      expect(user.age).to.eql(74);
    });

    it('sets name and birthYear as instance attributes', function() {
      expect(user.name).to.be.ok;
      expect(user.birthYear).to.be.ok;
    });
  });

  describe('.shoutSomething(shout)', function() {
    it('is a static function', function() {
      assert.isFunction(User.shoutSomething);
    });

    it('calls lodash.capitalize', function() {
      const shout = 'Hello World';
      User.shoutSomething(shout);
      expect(mockedLodash.capitalize).calledWith(shout);
    });
  });

  describe('.ageNextYear', function() {
    it('is a getter, not a function', function() {
      assert.isNotFunction(user.ageNextYear);
      expect(user.ageNextYear).to.eql(75);
    });
  });

  describe('.ageInYearN(shout)', function() {
    it('is a method', function() {
      assert.isFunction(user.ageInTheYearN);
    });

    it('returns the correct year', function() {
      const age = user.ageInTheYearN(2025);
      expect(age).to.eql(83);
    });
  });
});
