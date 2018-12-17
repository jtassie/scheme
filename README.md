# scheme-jtassie

## Overview

The goal of this library is to provide nodejs parsers and validators for the [JSON Schema](https://json-schema.org/) vocabulary. The [JSON Schema](https://json-schema.org/) vocabulary is an up and coming standard that allows you to "annotate and validate" JSON documents. This is important when designing web services where a contract exists between clients and servers. In such a situation, it would be helpful if the web-service could share a [JSON Schema](https://json-schema.org/) contract for the models it will serve or accept, and have the ability to validate any incoming or outgoing models against that contract.

Current implementation supports the following [data-types](https://github.com/jtassie/scheme-jtassie/blob/master/lib/scheme-types.js):
- string
- integer
- uuid
- timestamp

## Install

```
$ npm install scheme-jtassie
```

## Usage

### Basic Setup
```
let resolve = require('path').resolve
let scheme = require('scheme-jtassie');

let schemeManger = new scheme(resolve('PATH_TO_FOLDER_CONTAINING_JSON_SCHEMES'));
```

### Example Scheme Files

Working with for example, the scheme files in the [test directory](https://github.com/jtassie/scheme-jtassie/tree/master/test/schemes):

```
let schemeManger = new scheme(resolve('PATH_TO_FOLDER_CONTAINING_JSON_SCHEMES'));

let imModel = schemeManager.getModel('IM');

//new object creation:
let im = imModel.builder
      .withUserId('jtassie')
      .withBody(
          imModel.builder.builderBody
              .withText('sdfsdfsd')
              .withMessageId('123e4567-e89b-12d3-a456-426655440000')
              .withTimestamp(new Date())
              .build()
      )
      .build(validationCb);
      
//validate an existing json instance against a scheme model:
let validationResults = imModel.builder.validateModel(im);
```

## Tests

Tests can be run via the command:

```
$ npm test
```

## License

MIT © [Jonah Tassie](https://github.com/jtassie/scheme-jtassie)
