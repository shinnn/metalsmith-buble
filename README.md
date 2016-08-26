# metalsmith-buble

[![NPM version](https://img.shields.io/npm/v/metalsmith-buble.svg)](https://www.npmjs.com/package/metalsmith-buble)
[![Build Status](https://travis-ci.org/shinnn/metalsmith-buble.svg?branch=master)](https://travis-ci.org/shinnn/metalsmith-buble)
[![Build status](https://ci.appveyor.com/api/projects/status/nevjeddyndcl5ubo/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/metalsmith-buble/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/metalsmith-buble.svg)](https://coveralls.io/r/shinnn/metalsmith-buble)
[![dependencies Status](https://david-dm.org/shinnn/metalsmith-buble/status.svg)](https://david-dm.org/shinnn/metalsmith-buble)
[![devDependencies Status](https://david-dm.org/shinnn/metalsmith-buble/dev-status.svg)](https://david-dm.org/shinnn/metalsmith-buble?type=dev)

[Bublé](https://buble.surge.sh/guide/) plugin for [Metalsmith](http://www.metalsmith.io/)

## Installation

[Use npm](https://docs.npmjs.com/cli/install):

```
npm install metalsmith-buble
```

## Usage

### [CLI](https://github.com/metalsmith/metalsmith#cli)

Add the `metalsmith-buble` field to your `metalsmith.json`.

```javascript
{
  "plugins": {
    "metalsmith-buble": {
      "transforms": {
        "modules": false,
        "dangerousForOf": true
      },
      "sourceMap": "inline"
    }
  }
}
```

### [API](https://github.com/metalsmith/metalsmith#api)

```javascript
const Metalsmith = require('metalsmith');
const buble = require('metalsmith-buble');

new Metalsmith('./source')
.use(buble({
  sourceMap: true
}))
.build((err, files) => {
  if (err) {
    throw err;
  }

  console.log('Completed.');
});
```

### Options

All [Bublé options](https://buble.surge.sh/guide/#using-the-javascript-api) are available except for `file` and `source` that will be automatically set.

In addition the following option is supported:

#### options.sourceMap

Value: `true`, `false` or `'inline'`  
Default: `false`

* `true` generates a separate source map file with `.map` extension, for exmaple `script.js.map` along with `script.js`.
* `'inline'` appends an inline source map to the transformed file.

## License

Copyright (c) 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
