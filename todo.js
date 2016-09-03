    // change _key to this
    // 
    // -kefysghkejf: {
    //   _key: 'posts/2016-07-12-10-essential-marketing-tools-to-grow-your-business.md',
    //   layout: 'post.liquid'
    //   title: 'How to Optimize a Landing Page to Increase Conversions',
    //   author: 'Cameron Roe',
    //   tags: [ 'web design', 'landing pages' ],
    //   image: 'value-proposition.jpg',
    //   share: true,
    //   comments: true,
    //   contents: 'Contents...'
    // }
    // 
    // 
    // - [] Store the above object under /posts in firebase
    // - [] The above object needs to utilize a function in metalsmith-firebase
    //      that creates a new file with it's `_key` as the key and object as
    //      the object above without the `_key` property and the contents stored
    //      as a buffer. From there you can hand off the "fake" file to metalsmith
    //      and it will build the correct site.
    // - [] The goal at the end of this sequence will be to 
    //      store all assets, templates, markdown posts as 
    //      file objects that will get built under a hashed version.
    //      For example, when you create a new site, you can run:
    //      "Publish" and it will create a Firebase key "-fiasdfjlkw2fjk"
    //      Under that key will live all site structure with related keys:
    //      For example:
    //      
    //      {
    //        "assets": {
    //          "-fsfwhglsfk": true,
    //          "-sdflhgwkdf": true
    //        },
    //        "posts": {
    //          "-kwjfsldhgw": true,
    //          "-sfjlwhgwlj": true
    //        },
    //        "pages": {
    //          "-lakfjkwhgk": true,
    //          "-adflkhwgwd": true
    //        },
    //        "templates": {
    //          "-sdflkwjgkj": true
    //        }
    //      }
    //      
    //      Then within each parent folder it will contain all their files:
    //      For example:
    //      
    //      {
    //        "posts": {
    //          "-kwjfsldhgw": {
    //            _key: 'posts/2016-07-12-10-essential-marketing-tools-to-grow-your-business.md',
    //            layout: 'post.liquid'
    //            title: 'How to Optimize a Landing Page to Increase Conversions',
    //            author: 'Cameron Roe',
    //            tags: [ 'web design', 'landing pages' ],
    //            image: 'value-proposition.jpg',
    //            share: true,
    //            comments: true,
    //            contents: 'Contents...'
    //          }
    //        }
    //      }
    // 
    // [_key]: {
    //   layout: 'post.liquid'
    //   title: 'How to Optimize a Landing Page to Increase Conversions',
    //   author: 'Cameron Roe',
    //   tags: [ 'web design', 'landing pages' ],
    //   image: 'value-proposition.jpg',
    //   share: true,
    //   comments: true,
    //   contents: 'Contents...',
    //   date: 2016-07-11T16:00:00.000Z,
    //   slug: 'how-to-optimize-a-landing-page-to-increase-conversions',
    //   tagsUrlSafe: [ 'web-design', 'landing-pages' ]
    // }