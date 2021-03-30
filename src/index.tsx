import "bulmaswatch/superhero/bulmaswatch.min.css";
import ReactDom from "react-dom";
//import CodeCell from "./components/code-cell";
import TextEditor from "./components/text-editor";

const App = () => {
  return (
    <div>
      <TextEditor />
    </div>
  );
};

ReactDom.render(<App />, document.querySelector("#root"));
