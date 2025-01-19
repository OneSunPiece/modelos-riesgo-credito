import { useState } from "react";
import { sendPredictionRequest } from "../Api/Api";
import "./Form.css";

export default function Form() {
  const [features, setFeatures] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureArray = features.split(",").map(Number);
    const result = await sendPredictionRequest(featureArray);
    setPrediction(result.prediction);
  };

  return (
      <form onSubmit={handleSubmit} className="data-input">

        
        <input
          type="text"
          placeholder="Enter features (comma-separated)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />
        <button type="submit">Predict</button>
      </form>
  );
}
