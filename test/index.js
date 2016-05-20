import {expect} from 'chai';
import nock from 'nock';
import firebase, {fetchJson} from '../lib';
import Metalsmith from 'metalsmith';

describe("metalsmith-firebase", () => {
  
  var m, data;

  beforeEach(() => {
    nock('https://test.firebaseio.com')
      .get('/home/.json').reply(200, {
        title: 'Home Page'
      });
    nock('https://test.firebaseio.com')
      .get('/some/namespace/.json').reply(200, {
        title: 'Some Namespace'
      });
    nock('https://test.firebaseio.com')
      .get('/.json')
      .reply(200, {
        title: 'Giant Self'
      });
    nock('https://test.firebaseio.com')
      .get('/.json')
      .reply(200, {
        title: 'Giant Self'
      });

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

  xit("should have a firebase object attached", (done) => {
    m.build((err, files) => {
      Object.keys(files).map((file) => {
        let meta = files[file];
        expect(meta.firebase).to.be.ok;
      });
      done();
    });
  });
  
  xit("should build the correct ref url", (done) => {
    m.build((err, files) => {
      Object.keys(files).map((file) => {
        var ref;
        let meta = files[file];
        if (Array.isArray(meta.firebase)) {
          ref = meta.firebase.join('/');
        } else {
          ref = meta.firebase;
        }
        expect(meta.firebase_url).to.equal('https://test.firebaseio.com/' + ref);
      });
      done();
    })
  });

  it("should load firebase data on to global object", (done) => {
    m.build((err, files) => {
      let meta = m.metadata();
      expect(meta.firebase).to.be.an('object');
      nock.isDone();
      done();
    });
  });

});