'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {

  return function (files, metalsmith, done) {
    var data = {};
    var promises = []; // and they still feel all so wasted on myself..

    Object.keys(files).forEach(function (filename) {
      var file = files[filename];
      var dfd = _q2.default.defer();

      // make a promise
      promises.push(dfd.promise);

      // set the firebase url for this file
      if (file.firebase) {
        file.firebase_url = setFirebaseUrl(options.url, file.firebase);
      }

      // load the firebase contents as json
      if (file.firebase_url) {
        fetchJson(file.firebase_url).then(function (data) {
          file.firebase_data = data;
          // integrity
          dfd.resolve(data);
        }).catch(function (res) {
          file.firebase_data = res;
        });
      }
    });

    _q2.default.allSettled(promises).then(function (results) {
      done();
    });
  };
};

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch Firebase json
 * @param  {string} url the firebase ref url
 * @return {object} a promise
 */
function fetchJson(url) {
  var d = _q2.default.defer();

  _axios2.default.get(url + '/.json').then(function (res) {
    if (res.data) {
      d.resolve(res.data);
    } else {
      d.reject(null);
    }
  });

  return d.promise;
}

/**
 * Set Firebase url from ref(s)
 * @param {string} base the base url
 * @param {string, array} ref  the ref to the firebase child
 * @return {string} a firebase ref url
 */
function setFirebaseUrl(base, ref) {

  if (typeof ref !== 'string' && !Array.isArray(ref)) {
    return null;
  }

  // check for / at end of url
  if (base.indexOf('/', 8) > -1) {
    base = base.split('/')[0];
  }

  var parts = [base];

  if (Array.isArray(ref)) {
    parts = parts.concat(ref);
  } else if (ref.indexOf('/') > -1) {
    // split refs via / (ex. 'home/featured_posts' -> ['home', 'featured_posts'])
    parts = parts.concat(ref.split('/'));
  } else {
    parts.push(ref);
  }

  return parts.join('/');
}