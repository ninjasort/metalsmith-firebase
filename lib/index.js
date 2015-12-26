import axios from 'axios';
import _ from 'lodash';

export default function (options) {

  return function (files, metalsmith, done) {
    var data = {};

    Object.keys(files).forEach((filename) => {
      var file = files[filename];
      if (file.firebase) {
        file.firebase_url = setFirebaseUrl(options.url, file.firebase);
      }
    })

    done();
  }
}

/**
 * Set Firebase url from ref(s)
 * @param {string} base the base url
 * @param {string, array} ref  the ref to the firebase child
 */
function setFirebaseUrl(base, ref) {
  // check for / at end of url
  if (base.indexOf('/', 8) > -1) {
    base = base.split('/')[0];
  }

  var parts = [base];
  
  if (Array.isArray(ref)) {
    // split refs via / (ex. 'home/featured_posts' -> ['home', 'featured_posts'])
    parts = parts.concat( ref.split('/') );
  } else {
    parts.push(ref);
  }

  return parts.join('/');
}