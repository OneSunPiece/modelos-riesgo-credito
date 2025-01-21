import React, { useState } from "react";
import * as d3 from "d3";
import Arc from "./Arc/Arc";
import Form from "./Form/Form";
// Styles
import "./App.css";

function App() {
  const [data, setData] = useState(
    () => d3.ticks(-2, 2, 200).map(Math.sin)
  );
  const [payProbability, setpayProbability] = useState(0);
  
  function CalculateScore(payProbability) {
    const MAX_SCORE = 850;
    const MIN_SCORE = 300;

    const sum = (MAX_SCORE-MIN_SCORE)*payProbability + MIN_SCORE;
    return Math.round((sum / data.length) * 100);
  }

  var score = CalculateScore(payProbability);

  return (
    <div className="App">
      <section className="header">
        <h1>ML Model Deployment</h1>
        <p>Deploying a machine learning model with FastAPI and React</p>
      </section>

      <section className="graph">
        <h2>Puntaje: {score}</h2>
        <Arc
          innerRadius={50}
          outerRadius={100}
          startAngle={0}
          endAngle={Math.PI / 0.7}
          width={200}
          height={200}
        />
      </section>

      <section className="data">
        <p>Enter features to predict:</p>
        <Form />
      </section>
    </div>
  );
}

export default App;