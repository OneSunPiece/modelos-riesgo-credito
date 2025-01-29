# How It Works?
(In linux)

- Create virtual environment
```ZSH
python3 -m venv .venv
```

- Activate it
```ZSH
source .venv/bin/activate
```

- Install python dependencies
```ZSH
pip install requirements.txt
```

## Notebooks

- `main.ipynb` notebook has the code necessary to produce the artifacts (The model and the preprocessor files)
- `analisis.ipynb` made all the statistical analisis and feature engineering
- `prediction.ipynb` has an ready to use example of how to consume this models

## Scripts

- `load_data.py` has a brief code to bring the raw data set into memory
- `utilities.py` store all the functions that are use to process data


### Data example
For the purpose of testing as an input, here the an example of the input data:

| Column                     | Value     |
|----------------------------|-----------|
| loan_amnt                  | 13000.0   |
| funded_amnt                | 13000.0   |
| funded_amnt_inv            | 13000.0   |
| term                       | 0.0       |
| int_rate                   | 8.39      |
| installment                | 409.72    |
| sub_grade                  | 7.0       |
| home_ownership             | MORTGAGE  |
| annual_inc                 | 85000.0   |
| verification_status        | 0.0       |
| pymnt_plan                 | n         |
| dti                        | 20.1      |
| delinq_2yrs                | 0.0       |
| revol_util                 | 91.0      |
| total_acc                  | 34.0      |
| out_prncp                  | 6545.54   |
| total_rec_prncp            | 6454.46   |
| total_rec_int              | 1330.22   |
| total_rec_late_fee         | 0.0       |
| recoveries                 | 0.0       |
| collection_recovery_fee    | 0.0       |
| collections_12_mths_ex_med | 0.0       |
| policy_code                | 1.0       |
| acc_now_delinq             | 0.0       |
| tot_cur_bal                | 214810.0  |
| total_rev_hi_lim           | 45300.0   |

#### Categorical data
There are two categorycal variables:

- Home Ownership

| Home Ownership | Count  |
|----------------|--------|
| MORTGAGE       | 443557 |
| RENT           | 356117 |
| OWN            | 87470  |
| OTHER          | 182    |
| NONE           | 50     |
| ANY            | 3      |

- Payment Plan

| Payment Plan | Count |
|--------------|-------|
| n            | 887369|
| y            | 10    |