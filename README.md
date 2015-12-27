# metalsmith-firebase

> Load firebase data into metalsmith.

## Installation

```
$ npm install metalsmith-firebase
```

## Usage

#### CLI

Add `metalsmith-firebase` to your `metalsmith.json` plugins and specify your firebase options:

```json
{
  "plugins": {
    "metalsmith-firebase": {
      "url": "https://myfirebase.firebaseio.com"
    }
  }
}
```

#### JS

Pass `options` to the firebase plugin and pass it to Metalsmith with the `use` method:

```js
import firebase from 'metalsmith-firebase';

metalsmith.use(firebase({
  url: 'https://myfirebase.firebaseio.com'
}));
```

#### Front-matter

```md
---
firebase: ref
---
```
or
```
---
firebase: ref/namespace
---
```

Access the data on the `firebase_data` object within the template file.


## License

[MIT]()