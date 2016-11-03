import axios from 'axios';
import _ from 'lodash';
import q from 'q';

export default function (options) {
  return function (files, metalsmith, done) {

    let url = options.url;
    let meta = metalsmith.metadata();

    // fetch global firebase data
    fetchJson(url).then(res => {
      meta['firebase'] = res;
      done();
    })
    .catch(err => {
      meta['firebase'] = err;
      done();
    });

  }
}

export function transform(options) {
  return function (files, m, next) {
    if (!options) {
      throw new Error('Did no specify firebase.options');
      return;
    }
    if (!m.metadata().firebase) {
      throw new Error('Firebase was not loaded first.');
      return;
    }
    if (!options.collections) {
      throw new Error('Did not specify "options.collections" array in Firebase options. (ex. {"collections": ["posts", "pages"]}');
      return;
    }

    // console.log(m.metadata().firebase);

    // we need a way to map over all the data in firebase such as posts, pages, assets, etc.
    // and write them in here so what we need to do is map a structure to firebase. We can pass this into the plugin.
    // {
    //   url: '',
    //   collections: [
    //     "posts",
    //     "pages"
    //   ]
    // }
    
    // A NOTE ON COLLECTIONS.
    // ----------------------
    // We can allow for clients to create new collections, however they will not be able to create any size collection they want.
    // We will need to make sure these collections are limited to what characters are used, how big, etc. 
    // We can do this with some basic regexing. Let's get a list in Todoist around regexing and master it. We can include some regex
    // videos from harddrive.

    function updateCollectionData(files, name) {
      if (m.metadata().firebase[name]) { // loop over all the collections
        var data = m.metadata().firebase[name];
        for (var item in data) {
          var entry = data[item]; // get each entry
          if (entry.contents) { // if it has contents
            entry.contents = Buffer.from(entry.contents, 'utf8'); // create a buffer version
          } else {
            entry.contents = Buffer.from('', 'utf8');
          }
          files[entry._key] = _.omit(entry, ['_key']); // set their _key as file path and remove it from object
        }
      }
    }

    options.collections.map((collection) => {
      updateCollectionData(files, collection);
    });

    next();

  }
}

// old
// Object.keys(files).forEach((filename) => {
//   var file = files[filename];
//   var dfd = q.defer();

//   // set the firebase url for this file
//   if (file.firebase) {
//     // make a promise
//     promises.push(dfd.promise);
//     file.firebase_url = setFirebaseUrl(options.url, file.firebase);
//   }
  
//   // load the firebase contents as json
//   if (file.firebase_url) {
//     fetchJson(file.firebase_url)
//       .then((data) => {
//         file.firebase_data = data;
//         // integrity
//         dfd.resolve(data);
//       })
//       .catch((res) => {
//         file.firebase_data = res;
//       });
//   }
// })

// q.allSettled(promises).then((results) => {
//   done();
// });

/**
 * Fetch Firebase json
 * @param  {string} url the firebase ref url
 * @return {object} a promise
 */
export function fetchJson(url) {
  var d = q.defer();

  // handle slash at end
  if (url.indexOf('/', url.length-1) !== -1) {
    url = url.replace(/\/$/, '');
  }
  

  axios.get(url + '/.json')
    .then(res => {
      if (res.data) {
        d.resolve(res.data);
      } else {
        d.reject(null);
      }
    })
    .catch(err => {
      d.reject(null);
    })

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
    parts = parts.concat( ref.split('/') );
  } else {
    parts.push(ref);
  }

  return parts.join('/');
}