import pandas as pd
import numpy as np

from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Define functions to preprocess the data
def map_loan_status(df):
    """
    Dado que se quiere obtener el riesgo de impago de una persona, se mapean los valores de la
    variable dependiente a binario, donde 1 representa que el prestamo fue pagado y 0 que no fue pagado.
    return: df with the loan_status column mapped to binary values
    params: df (DataFrame)
    raises: None
    """
    # Diccionario para clasificar los estados en binario
    status_map_binary = {
        "Current": 1,
        "Fully Paid": 1,
        "Issued": 1,
        "Does not meet the credit policy. Status:Fully Paid": 1,
        "Charged Off": 0,
        "Late (31-120 days)": 0,
        "Late (16-30 days)": 0,
        "In Grace Period": 0,
        "Default": 0,
        "Does not meet the credit policy. Status:Charged Off": 0
    }
    modfied_df = df.copy()

    modfied_df['loan_status'] = modfied_df['loan_status'].map(status_map_binary)
    
    return modfied_df

def drop_nulls_percentage(df, threshold=0.2):
    """
    Preprocesamiento de los datos
    return: df preprocesado
    params: df (DataFrame), threshold (float)
    raises: None
    """
    modified_df = df.copy()
    
    columns_to_drop_by_nullity = modified_df.columns[modified_df.isnull().mean() > threshold].to_list()
    modified_df.drop(columns=columns_to_drop_by_nullity)

    return modified_df

def clean_categorical_data(df):
    """
    Debido a que las columnas categóricas no pueden ser procesadas por el modelo, se procede a eliminar
    las columnas que contienen más de 10 valores únicos.
    return: df preprocesado
    params: df (DataFrame)
    raises: None
    """
    df_modified = df.copy()

    categorical_columns = df_modified.select_dtypes(include=['object']).columns
    unique_values = pd.DataFrame(df_modified[categorical_columns].nunique(), columns=['unique_values'])
    columns_to_drop_by_uniqueness = unique_values[(unique_values['unique_values'] > 10)].index.to_list()
    columns_to_drop_by_uniqueness.remove('sub_grade')
    df_modified = df_modified.drop(columns=columns_to_drop_by_uniqueness)

    return df_modified

def apply_grades_encoding(df):
    """
    Debido a que la columna 'sub_grade' tiene un significado ordinal, se procede a codificarla
    de manera que el modelo pueda interpretarla de manera adecuada.
    return: df preprocesado
    params: df (DataFrame)
    raises: None
    """
    modified_df = df.copy()

    # Diccionarios para los valores segun la codificación
    letter_map = {'A': 7, 'B': 6, 'C': 5, 'D': 4, 'E': 3, 'F': 2, 'G': 1}
    number_map = {'1': 0.8, '2': 0.6, '3': 0.4, '4': 0.2, '5': 0.0}

    # Función para codificar la columna 'subgrade'
    def sub_grades_encoding(x):
        letter, number = x[0], x[1]
        return letter_map[letter] + number_map[number]

    # codificacion de la columna 'sub_grade'
    modified_df['sub_grade'] = modified_df['sub_grade'].apply(sub_grades_encoding)
    # se puede eliminar la columna 'grade' ya que 'sub_grade' es una versión más detallada
    modified_df = modified_df.drop(columns=['grade'])
    return modified_df

def encode_columns(df):
    """
    Se procede a codificar las columnas categóricas para que el modelo pueda interpretarlas de manera adecuada.
    return: df preprocesado
    params: df (DataFrame)
    raises: None
    """
    modified_df = df.copy()
    
    term_mapping = {' 36 months': 0, ' 60 months': 1}
    verification_status_mapping = {'Not Verified': 0, 'Verified': 1, 'Source Verified': 1}
    
    modified_df['term'] = modified_df['term'].map(term_mapping)
    modified_df['verification_status'] = modified_df['verification_status'].map(verification_status_mapping)
    
    return modified_df

def delete_numerical_columns(df):
    """
    Respecto a las columnas numericas, se buscan aquellas que tienen mas de 99% de valores distintos,
    y se eliminan de manera similar a las columnas categoricas.
    return: pipeline
    params: None
    raises: None
    """
    df_modified = df.copy()

    df_modified.drop(columns=['id', 'member_id'], inplace=True, errors='ignore')

    numerical_columns = df_modified.select_dtypes(include=['float64', 'int64']).columns

    # Se imputan los valores nulos con la mediana
    imputer = SimpleImputer(strategy='median')
    df_modified[numerical_columns] = imputer.fit_transform(df_modified[numerical_columns])

    return df_modified


def get_preprocessor(df):
    """
    Por último, se define el pipeline de preprocesamiento de los datos,
    donde se codifican las variables categoricas restantes con one hot encoding,
    y se normalizan las variables numericas.
    return: pipeline
    params: None
    raises: None
    """
    # Se separan las columnas categoricas y numericas
    categorical_columns = df.select_dtypes(include=['object']).columns
    numerical_columns = df.select_dtypes(include=['float64', 'int64']).columns


    # Se define el preprocesamiento de las columnas
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_columns),
            ('cat', OneHotEncoder(), categorical_columns)
        ]
    )

    return preprocessor

def get_pipeline():
    """
    Se crea el pipeline con las funciones de preprocesamiento
    return: pipeline
    params: None
    raises: None
    """

    # Se crea el pipeline

    pipeline = Pipeline([
        ('map_loan_status', FunctionTransformer(map_loan_status)),
        ('drop_nulls_percentage', FunctionTransformer(drop_nulls_percentage)),
        ('clean_categorical_data', FunctionTransformer(clean_categorical_data)),
        ('apply_grades_encoding', FunctionTransformer(apply_grades_encoding)),
        ('encode_columns', FunctionTransformer(encode_columns)),
        ('sda', FunctionTransformer(delete_numerical_columns))
    ])

    return pipeline