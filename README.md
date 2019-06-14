# search-printers

Node.js module to search for EPSON (and similar) thermal printers in the connected networks.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](https://github.com/hadeeb/search-printers/blob/master/LICENSE)

## Install

```bash
# Yarn
yarn add search-printers

# NPM
npm install search-printers
```

## Usage

```js
const SearchPrinters = require("search-printers");

const printers = await SearchPrinters();

// or in a different port
const printers = await SearchPrinters({ port: 9090 });
```

> Use [node-thermal-printer](https://www.npmjs.com/package/node-thermal-printer) to connect to and use the printers

## API

### SearchPrinters

Search for printers

**Parameters**

- `Options` **Object**

  **All parameters are optional**

  - `timeout` **Number** Socket connection timeout (in ms)

    _default: `3000`_

  - `port` **Number** Network port to search for printers

    _default: `9100`_

  - `buffer` **Buffer** Buffer to get printer name

Returns **Array&lt;Printer&gt;**

**Printer**

- `host` **string** : IPv4 address of the printer
- `port` **number** : Network port in which printer is listening
- `name` **string** : Name of the printer

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](https://github.com/hadeeb/search-printers/issues).
If not, just open a [new clear and descriptive issue](https://github.com/hadeeb/search-printers/issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

- Fork it!
- Make your changes.
- Submit a pull request with full remarks documenting your changes.
