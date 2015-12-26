import {expect} from 'chai';
import firebase from '../lib';
import fs from 'fs';
import Metalsmith from 'metalsmith';

describe("metalsmith-firebase", () => {
  
  var m;

  beforeEach(() => {
    m = Metalsmith('test/fixtures')
        .use(firebase({
          url: 'https://onetake.firebaseio.com'
        }));
  });

  it("should have a firebase object attached", (done) => {
    m.build((err, files) => {
      Object.keys(files).map((file) => {
        let meta = files[file];
        expect(meta.firebase).to.be.a('string');
      });
      done();
    });
  });
  
  it("should build the correct ref url", (done) => {
    m.build((err, files) => {
      Object.keys(files).map((file) => {
        let meta = files[file];
        expect(meta.firebase_url).to.equal('https://onetake.firebaseio.com/home');
      });
      done();
    })
  });

});