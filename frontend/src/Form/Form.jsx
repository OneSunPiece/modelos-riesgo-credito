import { useState } from "react";
import PropTypes from 'prop-types';
import { sendPredictionRequest } from "../Api/Api";
import "./Form.css";

export default function Form({ setPrediction, setIsLoading, setIsPredicted, onFeaturesChange }) {
  // Variables
  const featureNames = [
    "loan_amnt",
    "funded_amnt",
    "funded_amnt_inv",
    "term",
    "int_rate",
    "installment",
    "sub_grade",
    "home_ownership",
    "annual_inc",
    "verification_status",
    "pymnt_plan",
    "dti",
    "delinq_2yrs",
    "revol_util",
    "total_acc",
    "out_prncp",
    "total_rec_prncp",
    "total_rec_int",
    "total_rec_late_fee",
    "recoveries",
    "collection_recovery_fee",
    "collections_12_mths_ex_med",
    "policy_code",
    "acc_now_delinq",
    "tot_cur_bal",
    "total_rev_hi_lim"
];
  // props
  Form.propTypes = {
    setPrediction: PropTypes.func.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    setIsPredicted: PropTypes.func.isRequired,
    onFeaturesChange: PropTypes.func.isRequired
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
    setFeatures(
      (prevFeatures) => ({
      ...prevFeatures,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsLoading(true); // Set loading to true before the request

    const featureArray = Object.entries(features).map(([key, value]) => {
      if (key === 'home_ownership') {
        return value.toUpperCase();
      } else if (key === 'pymnt_plan') {
        return value.toLowerCase();
      } else {
        return Number(value);
      }
    });

    try {
      const result = await sendPredictionRequest(featureArray);
      setPrediction(result.prediction);
      setIsPredicted(true);
      setIsLoading(false);
      onFeaturesChange(featureArray);
    } catch (error) {
      console.error('Error sending prediction request:', error);
    } finally {
      // Set loading to false after the request is completed
      setIsLoading(false); 
      setIsPredicted(true);
    }
  };

  return (
<form onSubmit={handleSubmit} className="data-input">
      {featureNames.map((feature) => (
        <input
          key={feature}
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
