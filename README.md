# Phishing URL Detection using Machine Learning

This project implements an end-to-end machine learning pipeline to detect phishing URLs. The system is built with a modular architecture, designed for scalability, maintainability, and production readiness. It features a complete workflow from data ingestion and validation to model training, experiment tracking with MLflow, and deployment via a REST API.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture and Workflow](#architecture-and-workflow)
- [Tech Stack and Libraries](#tech-stack-and-libraries)
- [Directory Structure](#directory-structure)
- [Conclusion and Real-World Applications](#conclusion-and-real-world-applications)

## Project Overview

The goal of this project is to build a robust classifier that can distinguish between legitimate and malicious (phishing) URLs based on their features. The project follows best practices in MLOps, creating a reproducible training pipeline and a serving API for real-time predictions. The entire system is designed to be automated, from sourcing data from a MongoDB database to serving predictions via a web interface.

## Key Features

-   **Modular and Scalable Architecture**: The project is broken down into independent, reusable components (`data_ingestion`, `data_validation`, `data_transformation`, `model_trainer`). This modular design makes the system easy to understand, test, and extend.
-   **End-to-End ML Pipeline**: A fully automated pipeline orchestrates the entire machine learning workflow, ensuring consistency and reproducibility.
-   **Automated Hyperparameter Tuning**: The model training component uses `GridSearchCV` to systematically find the best hyperparameters for multiple classification models, ensuring optimal performance.
-   **Experiment Tracking with MLflow**: All training runs, parameters, metrics, and model artifacts are logged to an MLflow Tracking Server (integrated with DagsHub), providing full traceability and allowing for easy comparison of experiments.
-   **Model Registry for Lifecycle Management**: The best models are registered in the MLflow Model Registry, enabling versioning and staging for production deployment.
-   **RESTful API for Serving**: A FastAPI application serves the trained model, providing endpoints for both triggering the training pipeline and making real-time predictions on new data.
-   **Interactive Web Frontend**: A simple but effective web UI allows users to upload a CSV file of URLs and view the prediction results in a clean, interactive dashboard with summary stats and charts.

## Architecture and Workflow

The project is built around a central `TrainingPipeline` that executes a sequence of components. Each component takes an artifact from the previous step and produces a new artifact for the next.

1.  **Data Ingestion**: Pulls the raw phishing dataset from a MongoDB database, cleans it, and splits it into training and testing sets.
2.  **Data Validation**: Validates the ingested data against a predefined schema and checks for data drift between the training and testing sets to ensure data quality.
3.  **Data Transformation**: Applies data preprocessing steps, such as handling missing values using `KNNImputer`, and prepares the data for model training.
4.  **Model Trainer**: Trains multiple classification models (e.g., Random Forest, Gradient Boosting), performs hyperparameter tuning, and selects the best-performing model based on evaluation metrics.
5.  **Experiment Logging**: Throughout the training process, all relevant information is logged to MLflow.
6.  **API Serving**: A FastAPI server loads the final, trained model and exposes it via a `/predict` endpoint.

## Tech Stack and Libraries

-   **Backend**: Python
-   **API Framework**: FastAPI
-   **Web Server**: Uvicorn
-   **Database**: MongoDB (via MongoDB Atlas)
-   **Machine Learning**: Scikit-learn, Pandas, NumPy
-   **Experiment Tracking & MLOps**: MLflow, DagsHub
-   **Web Frontend**: HTML5, CSS3, JavaScript, Jinja2
-   **Infrastructure**: Environment variables (`python-dotenv`), Custom Logging & Exception Handling

## Directory Structure

```plaintext
└── ish-i-ka-network-security/
    ├── README.md
    ├── app.py
    ├── Dockerfile
    ├── LICENSE
    ├── main.py
    ├── push_data.py
    ├── requirements.txt
    ├── setup.py
    ├── test_mongodb.py
    ├── data_schema/
    │   └── schema.yaml
    ├── network_security/
    │   ├── __init__.py
    │   ├── cloud/
    │   │   └── __init__.py
    │   ├── components/
    │   │   ├── __init__.py
    │   │   ├── data_ingestion.py
    │   │   ├── data_transformation.py
    │   │   ├── data_validation.py
    │   │   └── model_trainer.py
    │   ├── constant/
    │   │   ├── __init__.py
    │   │   └── training_pipeline/
    │   │       └── __init__.py
    │   ├── entity/
    │   │   ├── __init__.py
    │   │   ├── artifact_entity.py
    │   │   └── config_entity.py
    │   ├── exception/
    │   │   ├── __init__.py
    │   │   └── exception.py
    │   ├── logging/
    │   │   ├── __init__.py
    │   │   └── logger.py
    │   ├── pipeline/
    │   │   ├── __init__.py
    │   │   ├── batch_prediction.py
    │   │   └── training_pipeline.py
    │   └── utils/
    │       ├── __init__.py
    │       ├── main_utils/
    │       │   ├── __init__.py
    │       │   └── utils.py
    │       └── ml_utils/
    │           ├── __init__.py
    │           ├── metric/
    │           │   ├── __init__.py
    │           │   └── classification_metric.py
    │           └── model/
    │               ├── __init__.py
    │               └── estimator.py
    ├── templates/
        ├── table.html
        └── upload.html
   
```

## Conclusion and Real-World Applications

This project demonstrates the power of a modular, MLOps-driven approach to building a reliable machine learning system. By separating concerns into distinct components and creating an automated, reproducible pipeline, the system is not just a one-off model but a robust platform for continuous improvement and deployment.

**Real-world applications for this system include:**

-   **Email Security Gateway Integration**: The `/predict` API endpoint can be integrated into corporate email servers. Every link in an incoming email can be sent to the API for a real-time risk score, allowing the system to block or flag suspicious links before they reach the user.
-   **Web Browser Extension**: A browser plugin could be developed that captures the URL a user is about to visit, sends it to the API, and displays a warning page if the URL is predicted to be a phishing site, preventing credential theft.
-   **Incident Response and Analysis**: Security Operations Center (SOC) analysts can use the web UI to perform batch analysis on large lists of URLs collected from security logs or threat intelligence feeds, quickly triaging thousands of potential threats.
-   **Content Filtering Systems**: The model can be used as a component in larger web filtering products for schools, libraries, or enterprises to proactively block access to known and newly-discovered phishing domains.

The modular architecture ensures that any part of the system—from the data source to the model type—can be upgraded independently, making it a sustainable and effective tool in the ongoing fight against cyber threats.
