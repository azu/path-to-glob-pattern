// MIT ©  azu
// and
// https://github.com/eslint/eslint/blob/master/tests/lib/util/glob-util.js
// ESLint
// Copyright JS Foundation and other contributors, https://js.foundation
import path from "path";
import fs from "fs";

/**
 * Replace Windows with posix style paths
 *
 * @param {string} filePath   Path to convert
 * @returns {string}          Converted filepath
 */
function convertPathToPosix(filePath: string) {
    const normalizedFilePath = path.normalize(filePath);
    return normalizedFilePath.replace(/\\/g, "/");
}


const isDirectory = (filepath: string) => {
    try {
        return fs.statSync(filepath).isDirectory()
    } catch (error) {
        return false;
    }
};

export type PathToGlobPatternOptions = {
    // An array of accepted extensions
    extensions: string[];
    // cwd to use to resolve relative pathnames
    cwd: string
}

/**
 * Checks if a provided path is a directory and returns a glob string matching
 * all files under that directory if so, the path itself otherwise.
 *
 * Reason for this is that `glob` needs `/**` to collect all the files under a
 * directory where as our previous implementation without `glob` simply walked
 * a directory that is passed. So this is to maintain backwards compatibility.
 *
 * Also makes sure all path separators are POSIX style for `glob` compatibility.
 *
 * @param {Object}   [options]                    An options object
 * @param {string[]} [options.extensions=[]] An array of accepted extensions
 * @param {string}   [options.cwd=process.cwd()]  The cwd to use to resolve relative pathnames
 * @returns {Function} A function that takes a pathname and returns a glob that
 *                     matches all files with the provided extensions if
 *                     pathname is a directory.
 */
export function pathToGlobPattern(options: PathToGlobPatternOptions) {
    const cwd = options.cwd;
    let extensions = options.extensions;

    extensions = extensions.map(ext => ext.replace(/^\./, ""));

    let suffix = "/**";
    if (extensions.length === 0) {
        // no extension option
        suffix += "/*";
    } else if (extensions.length === 1) {
        suffix += `/*.${extensions[0]}`;
    } else {
        suffix += `/*.{${extensions.join(",")}}`;
    }

    /**
     * A function that converts a directory name to a glob pattern
     *
     * @param {string} filePath The directory path to be modified
     * @returns {string} The glob path or the file path itself
     * @private
     */
    return function (filePath: string) {
        let newPath = filePath;
        const resolvedPath = path.resolve(cwd, filePath);

        if (isDirectory(resolvedPath)) {
            newPath = filePath.replace(/[/\\]$/, "") + suffix;
        }

        return convertPathToPosix(newPath);
    };
}
