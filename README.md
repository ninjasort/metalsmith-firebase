# metalsmith-firebase

> Load firebase data into metalsmith.

## Installation

```
$ npm install metalsmith-firebase
```

## CLI Usage

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

## Javascript Usage

Pass `options` to the firebase plugin and pass it to Metalsmith with the `use` method:

```js
import firebase from 'metalsmith-firebase';

metalsmith.use(firebase({
  url: 'https://myfirebase.firebaseio.com'
}));
```

## License

[MIT]()