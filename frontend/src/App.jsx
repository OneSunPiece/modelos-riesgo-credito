import { useState } from "react";
import Arc from "./Arc/Arc";
import Form from "./Form/Form";
import TableComponent from "./Table/Table"; 
// Styles
import "./App.css";

function App() {
  // States
  const [prediction, setPrediction] = useState(0);
  const [features, setFeatures] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicted, setIsPredicted] = useState(false);
  
  // Functions
  function CalculateScore(prediction) {
    const MAX_SCORE = 850;
    const MIN_SCORE = 300;

    const score = Math.round( (MAX_SCORE-MIN_SCORE)*prediction + MIN_SCORE);
    return score;
  }

  function CalculateAngle(score) {
    const PI = Math.PI;
    const MAX_SCORE = 850;
    angle = 2*PI*(score/MAX_SCORE);
    return angle;
  }

  // Error function approximation
  function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  
  function CalculatePercentile(score) {
    const mean = 575; // Mean of the distribution (average of 300 and 850)
    const stdDev = 137.5; // Standard deviation (approximation)
    const z = (score - mean) / stdDev;
    const percentile = 0.5 * (1 + erf(z / Math.sqrt(2)));
    return Math.round(percentile * 100);
  }

  // Variables
  var score = CalculateScore(prediction);
  var angle = CalculateAngle(score);
  var percentile = CalculatePercentile(score);

  return (
    <div className="App">

      <section className="Scoring">
        <h1>ScoringApp</h1>
        <span className="Link"><a href="https://github.com/OneSunPiece/modelos-riesgo-credito">Our code</a></span>
        <span className="Link"><a href="https://www.youtube.com/watch?v=nT8-mCH7xAo">Us</a></span>
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
      {isPredicted ? 
      <div className="PredictionData">
        <TableComponent features={features} />
      <h3>You are in the {percentile}% Percentil!</h3>
      </div> : null}
      
      </section>

      <section className="data">
        <h2>Client Information</h2>
        <p>
          Please enter the client&apos;s information to calculate the score.
        </p>
        <Form
          setPrediction={setPrediction} 
          setIsLoading={setIsLoading}
          setIsPredicted={setIsPredicted}
          onFeaturesChange={setFeatures}
        />
        {isLoading ? <h3>Loading...</h3> : null}
      </section>
    </div>
  );
}

export default App;