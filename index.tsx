import * as React from "react";
import * as ReactDOM from "react-dom";
import * as moment from "moment";

import App from "./src/Components/App"

let root = document.createElement("div");
root.id = "root";
document.getElementsByTagName("body")[0].appendChild(root);

const startDate = moment().subtract(1, "week");

ReactDOM.render(<App startDate={startDate} numWeeks={20} />, root);
