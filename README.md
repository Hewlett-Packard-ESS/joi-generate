# joi-generate [![Build Status](https://secure.travis-ci.org/docker/joi-generate.png?branch=master)](http://travis-ci.org/docker/joi-generate) [![Coverage Status](https://coveralls.io/repos/docker/joi-generate/badge.png?branch=master)](https://coveralls.io/r/docker/joi-generate?branch=master) [![Dependency Status](https://david-dm.org/docker/joi-generate.svg)](https://david-dm.org/docker/joi-generate)

Generates sample data from Joi schema.

__NOTE__: This is absolutely not a complete or really working solution, i'm just implementing bits and bobs as I require them.  Feel free to contribute handlers for other types.

## Getting Started
Install the module with: `npm install joi-generate`

```javascript
var Joi = require('joi');
var generate = new require('joi-generate').Generate();

var schema = Joi.object({
	details: Joi.string().min(100).max(200)
});

var model = generate(schema);
/*
 * model = { details: 'some random string between 100 and 200 chars' }
 */
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Karl Stoney  
Licensed under the MIT license.
