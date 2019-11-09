<!-- Links -->
[npm-image]: https://img.shields.io/npm/v/strif.svg?style=flat-square
[npm-url]: https://npmjs.org/package/strif

[code-quality-badge]: http://npm.packagequality.com/shield/strif.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=strif

[downloads-badge]: https://img.shields.io/npm/dm/strif.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/strif

[dependencies-badge]: https://img.shields.io/david/nombrekeff/strif.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/strif?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/strif/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/strif

<div align="center">

# :card_index: strif <!-- omit in toc -->

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![](https://img.shields.io/bundlephobia/min/strif.svg?style=flat-square)]()  
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]

<p>Format strings easily</p>
</div>

****

## Features <!-- omit in toc -->
* ✔︎ Expandable/Configurable
* ✔︎ No Dependencies
* ✔︎ Lighweighted [![](https://img.shields.io/bundlephobia/min/strif.svg?style=flat-square)]()


## Table Of Content <!-- omit in toc -->
- [Introduction](#introduction)
- [Overview](#overview)
- [Installation](#installation)
- [Importing](#importing)
- [Usage](#usage)
  - [Using in Node](#using-in-node)
  - [Using in Browser](#using-in-browser)
- [Api](#api)
  - [strif](#strif)
    - [strif.Formatter](#strifformatter)
    - [strif.Template](#striftemplate)
    - [strif.Prop](#strifprop)
    - [strif.PropOptions](#strifpropoptions)
    - [strif.TemplateOptions](#striftemplateoptions)
    - [strif.FormatterOptions](#strifformatteroptions)
  - [Transformers](#transformers)
  - [Plugins](#plugins)
- [Found a bug or have a feature request](#found-a-bug-or-have-a-feature-request)
- [Contributing](#contributing)

## Introduction
First of all thanks for checking this project out!  
**Strif** was initially created for one of my other libraries [Loggin'JS](https://github.com/loggin-js/loggin-js) which needed some features I could not find in other libraries and decided to do it myself. What I needed was to be able to **process a string in segments**, and apply some **format** to them, with the option to **enable/disable** which parts are formatted and which parts are not. For example:
* In Loggin'JS if **color is enabled** in the logger, I want to **apply** the **color format**.


Now let me explain the concepts used here:
* `Formatter` 
  - This class is created with a set of options, to then create templates from it _(see below)_.
  ```js
    let formatter = strif.create({
      transformers: {
        date: s => new Date(s),
        lds:  d => d.toLocaleString()
      }
    });
  ```
   - Above we create a formatter, to which we pass in an object containing a set of transformers _(see below)_,
   in this case, `date` processes a string and converts it to a Date object, and `lds` calls [`.toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString).
  
* `Template` 
  - This class holds a string template i.e: `{date} - {message}`, and a set of options for each segment.
  ```js
    let template = formatter.template(`[{date}] - {message}`, {
      props: {
        date: { transformers: [`date`, `lds`] },
      }
    });
    
    let result = template.compile({ date: '10-10-2019 00:00', message: 'Hey there!' });
    // [2019-10-10 00:00] - Hey there!
  ```
  - Above we create a template `{date} - {message}`, then we pass in an object containing `.props`, which are options specific for each segment `{...}`, in this case we pass in `date` and `lds` **transformers** _(see below)_, they will process the date into a localized date format.

* `Transformer`  
  * Transformers are functions passed into the Formatter, that process some segments of the log _(when applied)_.

[back to top](#table-of-content-)

## Some Usecases
Here are some usecases that **Strif** could work for:
* Dinamic formating
* User inputed data
* Internationalization

## Overview 
```js
let data = {
  time: '10-10-2019',
  user: 'keff',
  message: 'What time is it?'
};

let template = strif.template('[{time}] {user} {message}');
template.compile(data);
// Or easier
strif.compile('[{time}] {user} {message}', data);
// > [10-10-2019] keff What time is it?
```
> [example](./examples/example.overview.js)

[back to top](#table-of-content-)

## Installation
Install from npm:
```
$ npm install strif
```

## Importing
With require: 
```js
const strif = require('strif');
```

With ES6 import:
```js
import strif from 'strif';
```

In the browser:
```html
<script src="node_modules/strif/dist/strif.dist.js"></script>
```
> ! NOTICE: Plugins currently don't work in browser, woking on it. PRs Welcome

[back to top](#table-of-content-)

## Usage
### Using in Node
The easiest way to use **strif** is to use the default formatter under **strif**
```js
const strif = require('strif');

let template = strif.template('{time} {user} {message}');
template.compile(data);
// Or
strif.compile('{time} {user} {message}', data);
```
or you can create a custom one by using `strif.create(opts)`, this means you can pass in additional [transformers](#transformers) and other [options](#strifformatteroptions)
```js
const strif = require('strif');

const formatter = strif.create({
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  }
});

let template = formatter
  .template('[{time}] {user} - {message}')
  .prop('user', { accessor: 'user.name' }) // You can use accessor to access object properties
  .prop('time', { transformers: [`date`, `lds`] });

let result = template.compile({
  time: 11223322,
  message: 'This is a super long message ',
  user: { name: 'Bob' }
});
```
> [example](./examples/example.custom-formatter.js)

[back to top](#table-of-content-)

### Using in Browser
Using **strif** in the browser is as simple as in node, just import the script `strif/dist/strif.dist.js`
```html
<html lang="en">
  <head>
    <script src="node_modules/strif/dist/strif.dist.js"></script>
  </head>
  <body>
    <script>
      strif.create(); // strif is available
    </script>
  </body>
</html>
```
> ! NOTICE: Plugins currently don't work in browser, woking on it. PRs Welcome

[back to top](#table-of-content-)

## Api
### strif
Exported members from `strif`.
```ts
interface strif {
  create(opts: strif.StrifOptions): void;
  Formatter: strif.Formatter;
}
```

#### strif.Formatter
```ts
interface strif.Formatter {
  constructor(opts: strif.FormatterOptions);
  template(template: string, options: strif.TemplateOptions): strif.Template;
  fromFile(path: string, options: strif.TemplateOptions): strif.Template;
}
```

#### strif.Template
```ts
interface strif.Template {
  constructor(template: string, transformers: { [key: string]: (v) => v }, options: strif.TemplateOptions);
  prop(name: string, options: strif.PropOptions): this;
  print(): void;
  compile(data: object, options: { ignoreTransformers: string[] }): string;
}
```

#### strif.Prop
```ts
interface strif.Prop {
  constructor(name, opts: strif.PropOptions);
  getFromObject(obj: object): any;
}
```

#### strif.PropOptions
```ts
interface strif.PropOptions {
  accessor: string;
  type: string;
  transformers: string[];
}
```

#### strif.TemplateOptions
```ts
interface strif.TemplateOptions {
  props: strif.StrifProp[];
}
```

#### strif.FormatterOptions
```ts
interface strif.FormatterOptions {
  transformers: { [key: string]: (v) => v };
  plugins: string[]; 
}
```

[back to top](#table-of-content-)

### Transformers
Transformers are **functions** that are used to process some segment of the template,  
they will **receive a value** and they **must** also **return a value**, here are some example:
```js
{
  transformers: {
    date: s => new Date(s),
    lds:  d => d.toLocaleString()
  }
}
```

[back to top](#table-of-content-)


### Plugins
I added a little bit of plugin support, what a plugin actually is, is an object _(for now)_ wich contains transformers _(also for now)_, and will be attached to any [template](#striftemplate) generated by that [transformer](#striftransformer).
Here are some example:
```js
const chalk = require('chalk');
module.exports = {
  transformers: {
    blue:  s => chalk.blue(s),
    gray:  s => chalk.gray(s),
    green: s => chalk.green(s),
  }
};
```
>  Check this [demo](./tests/plugins/strif-color.js) for another example.

[back to top](#table-of-content-)

## Found a bug or have a feature request
If you found a **bug** or have a **feature request** please dont hesitate on leaving a [issue]()

## Contributing
If you would like to collaborate please check [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## Considerations <!-- omit in toc -->
This project was in some way inspired by [@davidchambers/string-format](https://github.com/davidchambers/string-format#formatcreatetransformers), at least in the sense of the transformers concept.
