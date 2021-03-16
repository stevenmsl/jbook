import * as esbuild from "esbuild-wasm";
import axios from "axios";
/*
  purpose of this plugin
  - by default esbuild will access the local file system to
    locate and load up files, which will not work in
    a browser environment
  - override the onResolve and onLoad methods of the
    build process to change that behavior 
*/

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin", // this is more for debugging purpose
    // build: represents the bundling process
    setup(build: esbuild.PluginBuild) {
      /* 
        onResolve
        - figure out where the index.js is stored
        - figure out where the requested files are
          for any import/require/export statement
        - use filter to set up what type of files
          you want to process 
      */
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }

        /*
          resolving relative path
          - use URL to resolve relative path
          
          dealing with nested imports correctly
          - check nested-imports.txt for the background info

        */

        if (args.path.includes("./") || args.path.includes("../")) {
          console.log("resolveDir: " + args.resolveDir);

          return {
            namespace: "a",

            path: new URL(
              args.path,
              // it's important to add a trailing slash to the base
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
      /*
        onLoad
        - load up the file (using axios) 
      */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              const message = require('react');
              console.log(message);
            `,
          };
        }

        const { data, request } = await axios.get(args.path);
        return {
          loader: "jsx",
          contents: data,
          /*
             - use request.responseURL to get the actual URL 
               from where the file is downloaded
             - use URL object to strip off the file name from the path
             - seems ESBuild is stripping off the trailing slash,
               you need to add it back in in the onResolve method
               to be able to find the right location file 
             - the resolveDir will be served as the base to correctly 
               resolve the file in the OnResolve method   
          */
          resolveDir: new URL("./", request.responseURL).pathname,
        };
      });
    },
  };
};
