import {expect} from 'chai';
import nock from 'nock';
import firebase, {
  fetchJson,
  transform
} from '../src';
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
          url: 'https://test.firebaseio.com',
          options: {
            collections: [
              "posts",
              "pages"
            ]
          }
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
  
  after(() => {
    nock.cleanAll();
  })

});


describe('transform', () => {
  
  let m;
  let firebaseSettings = {
    url: 'https://test.firebaseio.com',
    options: {
      collections: [
        "posts",
        "pages"
      ]
    }
  };
  
  beforeEach(() => {
    
    nock('https://test.firebaseio.com')
      .get('/.json')
      .reply(200, {
        'posts': {
          '001': {
            _key: 'pages/page-1.md',
            title: 'Page 1',
            contents: 'Page 1 Contents'
          }
        }
      });

    m = Metalsmith('test/fixtures')
        .use(firebase(firebaseSettings));

  });

  it('should set an object on the right key', (done) => {
    m.use(transform(firebaseSettings.options))
    m.build((err, files) => {
      var page = files['pages/page-1.md'];
      var contents = page.contents.toString();
      expect(page).to.be.a('object');
      expect(page.title).to.equal('Page 1');
      expect(contents).to.equal('Page 1 Contents');
      expect(nock.isDone()).to.be.true;
      done();
    });
  });

  it('should throw if no options are passed', (done) => {
    m.use(transform());
    const cb = (err, files) => { done() };
    m.build(cb);
    expect(cb).to.throw(Error);
  });

  afterEach(() => {
    m = null;
    nock.cleanAll();
  })

})