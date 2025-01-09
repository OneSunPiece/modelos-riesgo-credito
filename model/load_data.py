import kagglehub

def load_data():
    """
    Downloads the dataset from Kaggle
    """
    # Download latest version
    path = kagglehub.dataset_download("ranadeep/credit-risk-dataset")
    print("Path to dataset files:", path)

if __name__ == "__main__":
    load_data()