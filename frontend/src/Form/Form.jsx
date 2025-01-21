import { useState } from "react";
import PropTypes from 'prop-types';
import { sendPredictionRequest } from "../Api/Api";
import "./Form.css";

export default function Form({ setPrediction }) {
  // Variables
  const featureNames = [
    "loan_amnt",
    "term",
    "int_rate",
    "installment",
    "grade",
    "emp_length",
    "home_ownership",
    "annual_inc",
    "verification_status",
    "purpose",
    "label"
  ];
  // props
  Form.propTypes = {
    setPrediction: PropTypes.func.isRequired,
  };

  // States
  const [features, setFeatures] = useState(
    featureNames.reduce((acc, feature) => {
      acc[feature] = "";
      return acc;
    }, {})
  );

  // Functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureArray = Object.values(features).map(Number);
    const result = await sendPredictionRequest(featureArray);
    setPrediction(result.prediction);
  };

  return (
<form onSubmit={handleSubmit} className="data-input">
      {featureNames.map((feature) => (
        <input
          key={feature}
          type="number"
          name={feature}
          placeholder={feature.replace("_", " ")}
          value={features[feature]}
          onChange={handleChange}
          required
        />
      ))}
      <button type="submit">Predict</button>
    </form>
  );
}
