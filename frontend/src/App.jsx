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
  const [score, setScore] = useState(0);

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
          endAngle={Math.PI / 0.7} // 90 degrees in radians
          width={200}
          height={200}
        />
      </section>

      <section className="data">
        <p>Enter features to predict:</p>
        <Form />
        <p>
        loan_amnt,term,int_rate,installment,grade,emp_length,home_ownership,annual_inc,verification_status,purpose,label
        </p>
        <p>
        5000.00,0.00,10.65,162.87,4.00,12.00,1.00,24000.00,2.00,1.00,0.00
        </p>
      </section>
    </div>
  );
}

export default App;