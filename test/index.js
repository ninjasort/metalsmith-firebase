import {expect} from 'chai';
import nock from 'nock';
import firebase from '../lib';
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

    m = Metalsmith('test/fixtures')
        .use(firebase({
          url: 'https://test.firebaseio.com'
        }));
  });

  it("should have a firebase object attached", (done) => {
    m.build((err, files) => {
      Object.keys(files).map((file) => {
        let meta = files[file];
        expect(meta.firebase).to.be.ok;
      });
      done();
    });
  });
  
  it("should build the correct ref url", (done) => {
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

  it("should load json data into file", (done) => {
    m.build((err, files) => {
      Object.keys(files).map((file) => {
        let meta = files[file];
        expect(meta.firebase_data).to.be.a('object');
      });
      done();
    });
  });

});