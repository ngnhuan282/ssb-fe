import React from "react";
import ReactDOM from "react-dom";
import { Header } from "./Header";
import { MapComponent } from "./Map";

const App = () => (
  <div>
    <Header />
    <MapComponent />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
