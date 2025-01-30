import { useState } from 'react';
import PropTypes from 'prop-types';
import './Table.css'; // Optional: Add styles for the modal and table

const TableComponent = ({features}) => {
  // props
  TableComponent.propTypes = {
    features: PropTypes.func.isRequired
  };
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Variables
  var scoreboard_info = [
    {name: "loan_amnt", value: 0.1},
    {name: "funded_amnt", value: 0.2},
    {name: "funded_amnt_inv", value: 0.3},
    {name: "term", value: 0.4},
    {name: "int_rate", value: 0.5},
    {name: "installment", value: 0.6},
    {name: "sub_grade", value: 0.7},
    {name: "home_ownership", value: 0.8},
    {name: "annual_inc", value: 0.9},
    {name: "verification_status", value: 0.10},
    {name: "pymnt_plan", value: 0.11},
    {name: "dti", value: 0.12},
    {name: "delinq_2yrs", value: 0.13},
    {name: "revol_util", value: 0.14},
    {name: "total_acc", value: 0.15},
    {name: "out_prncp", value: 0.16},
    {name: "total_rec_prncp", value: 0.17},
    {name: "total_rec_int", value: 0.18},
    {name: "total_rec_late_fee", value: 0.19},
    {name: "recoveries", value: 0.20},
    {name: "collection_recovery_fee", value: 0.21},
    {name: "collections_12_mths_ex_med", value: 0.22},
    {name: "policy_code", value: 0.23},
    {name: "acc_now_delinq", value: 0.24},
    {name: "tot_cur_bal", value: 0.25},
    {name: "total_rev_hi_lim", value: 0.26}
  ]

  // Functions
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='table-component'>
      <button onClick={handleButtonClick}>Show Table</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <table>
              <thead>
                <tr>
                  <th>Variables</th>
                  <th>Aproxmated Importance</th>
                  <th>score</th>
                </tr>
              </thead>
              <tbody>
              {scoreboard_info.map((info, index) => (
                  <tr key={index}>
                    <td>{info.name}</td>
                    <td>{features[index]}</td>
                    <td>{features[index]*info.value} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;