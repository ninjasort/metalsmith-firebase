import {expect} from 'chai';
import nock from 'nock';
import firebase, {fetchJson} from '../lib';
import Metalsmith from 'metalsmith';

describe("metalsmith-firebase", () => {
  
  var m, data;

  beforeEach(() => {
    
    nock('https://test.firebaseio.com')
      .get('/.json').reply(200, {
        title: 'Giant Self'
      });

    nock('https://test.firebaseio.com')
      .get('/.json').reply(200, {
        title: 'Giant Self'
      });

    nock('https://test.firebaseio.com')
      .get('/.json')
      .reply(200, {
        title: 'Giant Self'
      });

    nock('https://test.firebaseio.com')
      .get('/.json')
      .reply(404);

    m = Metalsmith('test/fixtures')
        .use(firebase({
          url: 'https://test.firebaseio.com'
        }));
  });

  it('should fetch correct url with a slash at end', (done) => {
    fetchJson('https://test.firebaseio.com/')
      .then(res => {
        nock.isDone();
        done();
      });
  });

  it('should fetch correct url without slash at end', (done) => {
    fetchJson('https://test.firebaseio.com')
      .then(res => {
        nock.isDone();
        done();
      })
  });

  it("should load firebase data onto global object", (done) => {
    m.build((err, files) => {
      let meta = m.metadata();
      expect(meta.firebase).to.be.an('object');
      nock.isDone();
      done();
    });
  });

  it("should set firebase to null on a failed request", (done) => {
    m.build((err, files) => {
      let meta = m.metadata();
      expect(meta.firebase).to.be.a('null');
      expect(nock.isDone()).to.be.false;
      done();
    });
  });

});