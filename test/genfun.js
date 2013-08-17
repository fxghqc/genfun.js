/* -*- js-indent-level: 2; js2-basic-offset: 2; c-basic-offset: 2; -*- */
/* -*- indent-tabs-mode: nil; -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80; */
"use strict";
var assert = require("assert");
var Genfun = require("../src/genfun");

describe("Genfun", function() {

  describe("new Genfun()", function() {
	it("creates a new genfun", function() {
	  assert.equal("function", typeof (new Genfun));
	  assert.equal(true, (new Genfun).genfun instanceof Genfun);
	  // TODO - Not currently possible in JS
	  // assert.equal(true, (new Genfun) instanceof Genfun);
	});
  });

  describe("noApplicableMethod", function() {
	var frob = new Genfun(),
		container = { frob: frob };
	it("throws an exception if there is no applicable method", function() {
	  assert.throws(frob, function(err) { return err instanceof Error; });
	});
	it("can be modified so something different happens if dispatch fails", function() {
	  Genfun.addMethod(Genfun.noApplicableMethod, [frob], function() {
		return arguments;
	  });
	  var result = container.frob("foo");
	  assert.equal(frob, result[0]);
	  assert.equal(container, result[1]);
	  assert.equal("foo", result[2]);
	});
	it("is only called when dispatch fails", function () {
	  Genfun.addMethod(frob, [], function() {
		return "regular method";
	  });
	  assert.equal("regular method", frob());
	});
  });
  describe("#apply", function() {
	describe("basic call semantics", function() {
	  var frob = new Genfun();
	  Genfun.addMethod(frob, [], function() {
		return {"this": this, "arguments": arguments};
	  });
	  var container = {frob: frob};
	  it("can be called like a normal function", function() {
		assert.equal("success", frob("success")["arguments"][0]);
		assert.equal(container, container.frob()["this"]);
	  });
	  it("can be called using .call", function() {
		assert.equal("success", frob.call(null, "success")["arguments"][0]);
		assert.equal(container, frob.call(container)["this"]);
	  });
	  it("can be called using .apply", function() {
		assert.equal("success", frob.apply(null, ["success"])["arguments"][0]);
		assert.equal(container, frob.apply(container)["this"]);
	  });
	});
	describe("dispatch", function() {
	  it("properly dispatches methods", function() {
		var frobnicate = new Genfun(),
			addMethod = Genfun.addMethod;

		addMethod(
		  frobnicate,
          [Number.prototype],
          function(num) {
			return "one number: "+num;
          });

		addMethod(
		  frobnicate,
		  [String.prototype],
          function(str) {
			return "one string: "+str;
          });

		addMethod(
		  frobnicate,
          [String.prototype, Number.prototype],
          function(string, number) {
			return "string + number: " + string + ", " + number;
          });

		addMethod(
		  frobnicate,
          [Number.prototype, String.prototype],
          function(number, string) {
			return "number + string: " + number + ", " + string;
          });

		addMethod(
		  frobnicate,
          [],
          function() {
			return "Dispatch fell through";
          });

		addMethod(
		  frobnicate,
          [Number.prototype, , String.prototype],
          function(number, anything, string) {
			return "number + anything + string: "
              + number + ", " + anything + ", " + string;
          });

		function test(expected, args) {
		  assert.equal(expected, frobnicate.apply(null, args));
		}
		test("string + number: foo, 1", [new String("foo"), new Number(1)]);
		test("number + string: 1, foo", [1, "foo"]);
		test("one number: 1", [1, 2]);
		test("one number: 1", [1]);
		test("one string: str", ["str"]);
		test("Dispatch fell through", [true]);
		test("Dispatch fell through", []);
		test("number + anything + string: 1, true, foo", [1, true, "foo"]);
	  });
	});
  });
  
  describe("#addMethod()", function() {
	it("defines a new method on the genfun");
  });

  describe("#removeMethod()", function() {
	it("undefines a previously defined method on the genfun");
  });
});
