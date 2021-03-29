import { useState, useEffect } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    /*
      - wait a bit before kicking off 
        the bundling
    */
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  const initialValue = `const App = () => {
    return (
      <div>
        <h1>Hi There</h1>
        <button>Click Me</button>
      </div>
    );
  };
  `;

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={initialValue}
            onChange={(value) => setInput(value)}
          />
        </Resizable>

        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
