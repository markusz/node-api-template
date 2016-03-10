'use strict';
/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, no-undef: 0 */

const expect = require('chai').expect;
const supertest = require('supertest');

const TestUtil = require('../../src/utils/test-util').inject();
const app = TestUtil.getApp();

describe('/users/v1', function() {
  beforeEach(function(done) {
    // setup test, i.e. populate/clear db
    done();
  });

  describe('/users', function() {
    describe('GET', function() {
      it('returns HTTP 401 for unauthenticated users ', function(done) {
        supertest(app)
          .get('/users/v1')
          .set('usertoken', '43')
          .expect(401)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.unauthorized).to.be.ok;
            done();
          });
      });

      it('returns HTTP 200 ', function(done) {
        // Create user
        supertest(app)
          .post('/users/v1')
          .send({ name: 'Bob', birthYear: 1970 })
          .set('usertoken', '42')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(res.body.id).to.be.ok;

            // See if we get the user by it's created id
            supertest(app)
              .get('/users/v1/' + res.body.id)
              .set('usertoken', '42')
              .expect(200)
              .expect('Content-Type', /json/)
              .end(function(err2, res2) {
                expect(err2).to.be.null;
                expect(res2.body).to.be.obj;
                expect(res2.body).to.eql({ name: 'Bob', birthYear: 1970 });
                done();
              });
          });
      });

      it('returns HTTP 3xx/4xx/5xx, if...', function(done) {
        // further tests
        done();
      });
    });

    describe('POST', function() {
      it('returns HTTP 401 for unauthenticated users ', function(done) {
        // see GET
        done();
      });

      it('returns HTTP 201 with id in body if user has been created', function(done) {
        supertest(app)
          .post('/users/v1/')
          .send({ name: 'Bob', birthYear: 1970 })
          .set('usertoken', '42')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(res.statusCode).to.eql(201);
            expect(res.body).to.be.ok;
            expect(res.body.id).to.be.ok;
            done();
          });
      });

      it('returns HTTP 3xx/4xx/5xx, if...', function(done) {
        // further tests
        done();
      });
    });

    describe('DELETE', function() {
      it('returns HTTP 401 for unauthenticated users ', function(done) {
        // see GET
        done();
      });

      it('returns HTTP 204 if a user has been removed', function(done) {
        supertest(app)
          .post('/users/v1/')
          .send({ name: 'Bob', birthYear: 1970 })
          .set('usertoken', '42')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(res.body.id).to.be.ok;
            supertest(app)
              .del('/users/v1/' + res.body.id)
              .set('usertoken', '42')
              .send()
              .end(function(err2, res2) {
                expect(res2.statusCode).to.eql(204);
                done();
              });
          });
      });

      it('returns HTTP 3xx/4xx/5xx, if...', function(done) {
        // further tests
        done();
      });
    });
  });
});
