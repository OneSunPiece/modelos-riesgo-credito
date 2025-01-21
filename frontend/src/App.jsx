import { useState } from "react";
import Arc from "./Arc/Arc";
import Form from "./Form/Form";
// Styles
import "./App.css";

function App() {
  // States
  const [prediction, setPrediction] = useState(0);
  
  // Functions
  function CalculateScore(prediction) {
    const MAX_SCORE = 850;
    const MIN_SCORE = 300;

    const score = Math.round( (MAX_SCORE-MIN_SCORE)*prediction + MIN_SCORE );
    return score;
  }

  function CalculateAngle(score) {
    const PI = Math.PI;
    const MAX_SCORE = 850;
    angle = 2*PI*(score/MAX_SCORE);
    return angle;
  }

  // Variables
  var score = CalculateScore(prediction);
  var angle = CalculateAngle(score);

  return (
    <div className="App">

      <section className="Scoring">
        <h1>ScoringApp</h1>
        <p>
        ML, top notch technology, integrated with state of art designs and methodologies
        to provide you with the best scoring experience. Enhance your business with our scoring app.
        </p>

        <h2>Puntaje: {score}</h2>
        <Arc
          innerRadius={75}
          outerRadius={150}
          startAngle={0}
          endAngle={angle}
          width={300}
          height={300}
        />
      </section>

      <section className="data">
        <h2>Client Information</h2>
        <p>
          Please enter the client&apos;s information to calculate the score.
        </p>
        <Form setPrediction={setPrediction} />
      </section>
    </div>
  );
}

export default App;