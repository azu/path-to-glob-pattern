// MIT © 2017 azu
"use strict";
import { pathToGlobPattern } from "./src/path-to-glob-pattern";

const processPatternJs = pathToGlobPattern({options : {
    extensions: ["js"],
    cwd: __dirname
}});
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
const processPatternMultiple = pathToGlobPattern({options : {
    extensions: ["js", "md"],
    cwd: __dirname
}});
console.log(processPatternMultiple("."));
// => **/*.{js,md}
