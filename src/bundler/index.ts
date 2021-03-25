import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let serviceReady = false;

const bundle = async (rawCode: string) => {
  if (!serviceReady) {
    /*
     - copy the esbuild.wasm from the node_modules
       to the public folder, or download it from
       the unpkg.com
     - use useRef to check if the esbuild 
       is ready later
  */
    await esbuild.initialize({
      worker: true,
      /*
      - you must specify a particular version to download or 
        you might encouter the binary veriosn (the wasm downloaded) 
        is not matching the host version error (the npm package installed).
    */
      wasmURL: "https://unpkg.com/esbuild-wasm@0.9.3/esbuild.wasm",
      //wasmURL: "/esbuild.wasm", // look at the public folder
    });
    serviceReady = true;
  }
  const result = await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    /*
      - deal with the warnnings when the packages
        you are downloading need to access nodejs
        environment variables
    */
    define: {
      "process.env.NODE_ENV": '"production"',
      global: "window",
    },
  });

  return result.outputFiles[0].text;
};

export default bundle;
