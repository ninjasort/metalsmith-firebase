# metalsmith-firebase [![npm](https://img.shields.io/npm/v/metalsmith-firebase.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/metalsmith-firebase) [![Travis](https://img.shields.io/travis/axisdefined/metalsmith-firebase.svg?maxAge=2592000?style=flat-square)](https://travis-ci.org/cameronroe/metalsmith-firebase) [![Codecov](https://img.shields.io/codecov/c/github/cameronroe/metalsmith-firebase.svg?maxAge=2592000?style=flat-square)](https://codecov.io/gh/cameronroe/metalsmith-firebase) 

> Load firebase data into metalsmith.

## Installation

```
$ npm install metalsmith-firebase --save
```

## Usage

#### CLI

Add `metalsmith-firebase` to your `metalsmith.json` plugins and specify your firebase options:

```json
{
  "plugins": {
    "metalsmith-firebase": {
      "url": "https://myfirebase.firebaseio.com",
      "options": {
        "collections": [
          "pages",
          "posts"
        ]
      }
    }
  }
}
```

#### JS

Pass `options` to the firebase plugin and pass it to Metalsmith with the `use` method:

```js
import firebase from 'metalsmith-firebase';

metalsmith.use(firebase({
  url: 'https://myfirebase.firebaseio.com',
  options: {
    collections: [
      "pages",
      "posts"
    ]
  }
}));
```

You can specify options to merge data into files. By including "collections", you can specify the references that will be used to create pages from a `_key` property. For example, if I have `_key: posts/2016-09-05-metalsmith-firebase`, a file will be created with that `_key`, the property will be removed, and all the data will be assigned to that object, including contents which will be transformed to a buffer for other metalsmith plugins.

Access the data on the `firebase` object within the template file.


## License 

[MIT](/LICENSE)