import "bulmaswatch/superhero/bulmaswatch.min.css";
import ReactDom from "react-dom";

import CodeCell from "./components/code-cell";

const App = () => {
  return (
    <div>
      <CodeCell />
    </div>
  );
};

ReactDom.render(<App />, document.querySelector("#root"));
