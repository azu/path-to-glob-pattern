// MIT © 2017 azu
"use strict";
const pathToGlobPattern = require("./src/path-to-glob-pattern");
const processPatternJs = pathToGlobPattern({
    extensions: ["js"],
    cwd: __dirname
});
/* ## Pass directory */
console.log(processPatternJs("src"));
// => src/**/*.js

/* ## Pass file path */
console.log(processPatternJs("src/path-to-glob-pattern.js"));
// => src/path-to-glob-pattern.js

/* ## Pass not match file path */
console.log(processPatternJs("src/unknown.ext"));
// => src/unknown.ext

/* ## Multiple extensions */
const processPatternMultiple = pathToGlobPattern({
    extensions: ["js", "md"],
    cwd: __dirname
});
console.log(processPatternMultiple("."));
// => **/*.{js,md}
