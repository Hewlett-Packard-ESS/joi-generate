# joi-generate

Generates sample data from Joi schema.

__NOTE__: This is absolutely not a complete or really working solution, i'm just implementing bits and bobs as I require them.  Feel free to contribute handlers for other types.

Currently implemented:
```
  Array
    ✓ should generate an array
    ✓ should handle arrays with multiple objects

  Boolean
    ✓ should generate a boolean value

  Date
    ✓ should generate a date value
    ✓ should handle custom date formats
    ✓ should handle custom iso formats

  Number
    ✓ should generate a random number
    ✓ should be able to specify a minimum length
    ✓ should be able to specify a maximum length
    ✓ should be able to specify a minimum and maximum length

  Object
    ✓ should generate an object

  String
    ✓ should generate a random string
    ✓ strings should be able to specify a minimum length
    ✓ strings should be able to specify a maximum length
    ✓ strings should be able to specify a minimum and maximum length
    ✓ should be able to generate an email
    ✓ should be able to generate a guid
    ✓ should be able to generate an ip
    ✓ should be able to generate a hostname

```

## Getting Started
Install the module with: `npm install joi-generate`

```javascript
var Joi = require('joi');
var generate = new require('joi-generate').Generate();

var schema = Joi.object({
	details: Joi.string().min(100).max(200)
});

generate(schema, function(err, model) {
  /*
   * model = { details: 'some random string between 100 and 200 chars' }
   */
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 0.1.0 Initial Release
* 0.1.1 Added bool and email
* 0.1.2 Added basic date
* 0.1.3 Version bump for 0.1.2
* 0.1.4 Added date format support

## License
Copyright (c) 2015 Hewlett-Packard. 
Licensed under the MIT license.
