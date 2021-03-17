import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      /*
        onLoad
        - load up the file (using axios) 
      */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }

        /*
          - you must type the item you are retrieving
            so that TS won't complain
        */
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        /*
          - type the result so TS won't complain
        */
        const result: esbuild.OnLoadResult = {
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

        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
