# Genfun.js [![Build Status](https://travis-ci.org/sykopomp/genfun.js.png)](https://travis-ci.org/sykopomp/genfun.js) ![Dependencies Status](https://www.david-dm.org/sykopomp/genfun.js.png)

`genfun.js` is
[hosted at Github](http://github.com/sykopomp/genfun.js). `genfun.js` is a
public domain work, dedicated using
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Feel
free to do whatever you want with it.

# Quickstart

### Browser support

[![browser support](http://ci.testling.com/sykopomp/genfun.js.png)](http://ci.testling.com/sykopomp/genfun.js)

### Install

`genfun.js` is available through both [NPM](http://npmjs.org) and
[Bower](http://bower.io) as `genfun`.

`$ npm install genfun`
or
`$ bower install genfun`

The `npm` version includes a build/ directory with both pre-built and
minified [UMD](https://github.com/umdjs/umd) versions of `genfun.js` which
are loadable by both [AMD](http://requirejs.org/docs/whyamd.html) and
[CommonJS](http://www.commonjs.org/) module systems. UMD will define
window.Genfun if neither AMD or CommonJS are used. To generate these files
in `bower`, or if you fetched `genfun.js` from source, simply run:

```
$ npm install
...dev dependencies installed...
$ make
```

And use `build/genfun.js` or `build/genfun.min.js` in your application.

### Example

Various examples are availble to look at in the examples/ folder included
in this project. Most examples are also runnable with node, or by just
doing `make example-<name>` (for example, `make example-fmap`).

```javascript
// Based on examples/hellodog.js
var Genfun = require("genfun"),
    addMethod = Genfun.addMethod;

function Person() {}
function Dog() {}

// Creates a generic function. This is a regular, callable function.
var frobnicate = new Genfun();

// addMethod is used to define new methods on genfuns, with the most
// "specific"  method firing when multiple methods are applicable to a set of
// arguments when the genfun is called.
//
// addMethod(<genfun>, <selector>, <method function>)
//
addMethod(frobnicate, [Person.prototype], function(person) {
  console.log("Got a person!");
});

addMethod(frobnicate, [Dog.prototype], function(dog) {
  console.log("Got a dog!");
});

// Selectors can include multiple arguments, which correspond to argument
// positions when the genfun is called.
//
// This last method will dispatch only when a string, a Person, and a Dog
// are the arguments to frobnicate (in that order).
//
addMethod(
  frobnicate,
  [String.prototype, Person.prototype, Dog.prototype],
  function(greeting, person, dog) {
    console.log(person, " greets ", dog, ", '"+greeting+"'");
  });

var person = new Person(),
    dog = new Dog();
frobnicate(person); // Got a person!
frobnicate(dog); // Got a dog!
frobnicate("Hi, dog!", person, dog); // {} greets {}, 'Hi, dog!'

```

# Introduction

### Prototype-friendly multiple dispatch

`genfun.js` is a library that provides multimethod/generic function
capabilities in a prototype-friendly way. Inspired by
[Slate](http://slatelanguage.org/),
[CLOS](http://en.wikipedia.org/wiki/CLOS) and
[Sheeple](http://github.com/sykopomp/sheeple). In this case,
'prototype-friendly' means that it doesn't keep references from methods to
objects, so they will be garbage collected normally even if a method has
been directly defined on them.
