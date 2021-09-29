// <-- Functions -->
// <-- Function vectorization -->

import { DefaultFunctions } from "expression/functions";
import { parseEval, simpleContext } from "test/common";

test("Evaluate lower(list)", () => {
    expect(parseEval('lower(list("A", "B"))')).toEqual(["a", "b"]);
});

// <-- Length -->

test("Evaluate length(array)", () => {
    expect(DefaultFunctions.length(simpleContext(), [1, 2])).toEqual(2);
    expect(DefaultFunctions.length(simpleContext(), [])).toEqual(0);
});

test("Evaluate length(string)", () => {
    expect(DefaultFunctions.length(simpleContext(), "hello")).toEqual(5);
    expect(DefaultFunctions.length(simpleContext(), "no")).toEqual(2);
    expect(DefaultFunctions.length(simpleContext(), "")).toEqual(0);
});

// <-- contains() -->

test("Evaluate contains(object)", () => {
    expect(parseEval('contains(object("hello", 1), "hello")')).toEqual(true);
    expect(parseEval('contains(object("hello", 1), "no")')).toEqual(false);
});

test("Evaluate contains(array)", () => {
    expect(parseEval('contains(list("hello", 1), "hello")')).toEqual(true);
    expect(parseEval('contains(list("hello", 1), 6)')).toEqual(false);
});

test("Evaluate fuzzy contains(array)", () => {
    expect(parseEval(`contains(list("hello"), "he")`)).toEqual(true);
    expect(parseEval(`contains(list("hello"), "no")`)).toEqual(false);
});

test("Evaluate contains(string)", () => {
    expect(parseEval('contains("hello", "hello")')).toEqual(true);
    expect(parseEval('contains("meep", "me")')).toEqual(true);
    expect(parseEval('contains("hello", "xd")')).toEqual(false);
});

test("Evaluate non-fuzzy econtains(array)", () => {
    expect(parseEval(`econtains(list("hello"), "he")`)).toEqual(false);
    expect(parseEval(`econtains(list("hello"), "hello")`)).toEqual(true);
    expect(parseEval(`econtains(list("hello", 19), 1)`)).toEqual(false);
    expect(parseEval(`econtains(list("hello", 19), 19)`)).toEqual(true);
});

// <-- reverse() -->

test("Evaluate reverse(list)", () => {
    expect(parseEval("reverse(list(1, 2, 3))")).toEqual(parseEval("list(3, 2, 1)"));
    expect(parseEval('reverse(list("a", "b", "c"))')).toEqual(parseEval('list("c", "b", "a")'));
});

// <-- sort() -->

describe("sort()", () => {
    test("Evaluate sort(list)", () => {
        expect(parseEval("sort(list(2, 3, 1))")).toEqual(parseEval("list(1, 2, 3)"));
        expect(parseEval('sort(list("a", "c", "b"))')).toEqual(parseEval('list("a", "b", "c")'));
    });

    test("Evaluate sort(list, func)", () => {
        expect(parseEval("sort(list(2, 3, 1), (k) => 0-k)")).toEqual(parseEval("list(3, 2, 1)"));
    });
});

// <-- default() -->

test("Evaluate default()", () => {
    expect(parseEval("default(null, 1)")).toEqual(1);
    expect(parseEval("default(2, 1)")).toEqual(2);
    expect(parseEval("default(list(1, null, null), 2)")).toEqual([1, 2, 2]);
});

test("Evaluate ldefault()", () => {
    expect(parseEval("ldefault(null, 1)")).toEqual(1);
    expect(parseEval("ldefault(2, 1)")).toEqual(2);
});

// <-- choice() -->

test("Evaluate choose()", () => {
    expect(parseEval("choice(true, 1, 2)")).toEqual(1);
    expect(parseEval("choice(false, 1, 2)")).toEqual(2);
});

// <-- extract() -->

test("Evaluate 1 field extract()", () => {
    let res = parseEval('extract(object("mtime", 1), "mtime")');
    expect(res).toEqual({ mtime: 1 });
});

test("Evaluate 2 field extract()", () => {
    let res = parseEval('extract(object("mtime", 1, "yes", "hello"), "yes", "mtime")');
    expect(res).toEqual({
        yes: "hello",
        mtime: 1,
    });
});

// <-- nonnull() -->

test("Evaluate nonnull()", () => {
    expect(DefaultFunctions.nonnull(simpleContext(), null, null, 1)).toEqual([1]);
    expect(DefaultFunctions.nonnull(simpleContext(), "yes")).toEqual(["yes"]);
});
