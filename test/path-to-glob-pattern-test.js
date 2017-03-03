// MIT © 2017 azu
"use strict";
const pathToGlobPattern = require("../src/path-to-glob-pattern");
const assert = require("assert");
const path = require("path");
const os = require("os");
const sh = require("shelljs");
const fs = require("fs");
let fixtureDir;

/**
 * Returns the path inside of the fixture directory.
 * @returns {string} The path inside the fixture directory.
 * @private
 */
function getFixturePath() {
    const args = Array.prototype.slice.call(arguments);

    args.unshift(fs.realpathSync(fixtureDir));
    return path.join.apply(path, args);
}

function pathsToGlobPatterns(patterns, options = {}) {
    const processPatterns = pathToGlobPattern({
        extensions: options.extensions || [],
        cwd: options.cwd || process.cwd()
    });
    return patterns.map(processPatterns);
}
describe("path-to-glob-pattern.js", () => {
    before(() => {
        fixtureDir = `${os.tmpdir()}/eslint/tests/fixtures/`;
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", path.join(__dirname, "/fixtures/*"), fixtureDir);
    });

    after(() => {
        sh.rm("-r", fixtureDir);
    });

    describe("resolveFileGlobPatterns()", () => {

        it("should convert a directory name with no provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("find-util")
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*"]);
        });

        it("should convert an absolute directory name with no provided extensions into a posix glob pattern", () => {
            const patterns = [getFixturePath("find-util", "one-js-file")];
            const opts = {
                cwd: getFixturePath("find-util")
            };
            const result = pathsToGlobPatterns(patterns, opts);
            const expected = [`${getFixturePath("find-util", "one-js-file").replace(/\\/g, "/")}/**/*`];

            assert.deepEqual(result, expected);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("find-util"),
                extensions: [".jsx"]
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.jsx"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("find-util"),
                extensions: [".jsx", ".js"]
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", () => {
            const patterns = ["one-js-file", "two-js-files"];
            const opts = {
                cwd: getFixturePath("find-util")
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*", "two-js-files/**/*"]);
        });

        it("should remove leading './' from glob patterns", () => {
            const patterns = ["./one-js-file"];
            const opts = {
                cwd: getFixturePath("find-util")
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", () => {
            const patterns = ["one-js-file/"];
            const opts = {
                cwd: getFixturePath("find-util")
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*"]);
        });

        it("should return filenames as they are", () => {
            const patterns = ["some-file.js"];
            const opts = {
                cwd: getFixturePath("find-util")
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", () => {
            const patterns = ["one-js-file\\example.js"];
            const opts = {
                cwd: getFixturePath()
            };
            const result = pathsToGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/example.js"]);
        });

    });
});
