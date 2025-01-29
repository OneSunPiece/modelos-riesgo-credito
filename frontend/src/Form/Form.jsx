import { useState } from "react";
import PropTypes from 'prop-types';
import { sendPredictionRequest } from "../Api/Api";
import "./Form.css";

export default function Form({ setPrediction }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureArray = Object.entries(features).map(([key, value]) => {
      if (key === 'home_ownership') {
        return value.toUpperCase();
      } else if (key === 'pymnt_plan') {
        return value; // Mantener como texto
      } else {
        return Number(value);
      }
    });
    const result = await sendPredictionRequest(featureArray);
    setPrediction(result.prediction);
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
