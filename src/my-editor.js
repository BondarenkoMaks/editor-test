import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import EditorJs from "./editorjs";

function MyEditor() {
  const [data, setData] = useState([]);
  const readOnly = false;

  return (
    <div className="myEditor">
      <EditorJs
        readOnly={readOnly}
        data={data || []}
        hideToolbar={readOnly}
        onUpdate={(d) => setData(d)}
      />
    </div>
  );
}

export default MyEditor;
