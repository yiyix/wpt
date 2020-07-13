"use strict";

// Relative URL-like specifier.
window.promises.push(import(
    "./import.js?pipe=header(Access-Control-Allow-Origin,*)&label=" + Math.random()));

// Relative URL-like specifier.
window.promises.push(import(
    "http://{{domains[www1]}}:{{ports[http][0]}}/html/semantics/scripting-1/the-script-element/module/dynamic-import/gamma/import.js?pipe=header(Access-Control-Allow-Origin,*)&label=" + Math.random()));
