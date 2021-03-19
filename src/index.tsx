import ReactDom from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState("");

  const startService = async () => {
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

    ref.current = true;
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    /*
      Reload the iframe
      - user code can delete the DOM objects
        inside the iframe which might break the
        app
      - reload the iframe before each execution
        to address these issues   
    */
    iframe.current.srcdoc = html;

    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
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

    /*
      About using postMessage 
      - pass the bundled code from the main app 
        down to the iframe
      - bypass the access restriction between
        our main app and the iframe but still
        maintain the security
      - iframe needs to setup the listener properly
        to receive the bundled code from the main
        app 
    */
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:  red;" ><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            } 
          }, false);
        </script>
      </body>
    </html>
  `;

  /*
    About using iframe to run user's code
    - you can load the bundled script to the iframe via 
      srcDoc property to run the user code. However, the
      size of the code might be too big when users
      import a lot of packages
    - use iframe and its sandbox property to restrict the
      access from user code back to our main app for better
      security, such as preventing user code to manipulate
      the DOM objects of our main app
    - iframe will have its own context
  
  */
  return (
    <h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        ref={iframe}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </h1>
  );
};

ReactDom.render(<App />, document.querySelector("#root"));
