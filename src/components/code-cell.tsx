import { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

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
    <div>
      <CodeEditor
        initialValue={initialValue}
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
