import React, { useState } from "react";
import { sendPredictionRequest } from "./Api";

function App() {
  const [features, setFeatures] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureArray = features.split(",").map(Number);
    const result = await sendPredictionRequest(featureArray);
    setPrediction(result.prediction);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Prediction App</h1>
        <input
          type="text"
          placeholder="Enter features (comma-separated)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />
        <button type="submit">Predict</button>
      </form>
      {prediction !== null && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
