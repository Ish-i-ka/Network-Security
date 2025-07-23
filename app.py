import sys
import os

'''import certifi
ca = certifi.where()'''

from dotenv import load_dotenv
load_dotenv()

mongo_db_url = os.getenv("MONGO_DB_URL")

import pymongo

from network_security.exception.exception import NetworkSecurityException
from network_security.logging.logger import logging
from network_security.pipeline.training_pipeline import TrainingPipeline

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile,Request
from uvicorn import run as app_run
from fastapi.responses import Response
from starlette.responses import RedirectResponse
import pandas as pd

from network_security.utils.main_utils.utils import load_object

from network_security.utils.ml_utils.model.estimator import NetworkModel


client = pymongo.MongoClient(os.getenv("MONGO_DB_URL"))

from network_security.constant.training_pipeline import DATA_INGESTION_COLLECTION_NAME
from network_security.constant.training_pipeline import DATA_INGESTION_DATABASE_NAME

database = client[DATA_INGESTION_DATABASE_NAME]
collection = database[DATA_INGESTION_COLLECTION_NAME]

    
app = FastAPI()
origins = ["*"]

#This configures the CORS rules
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from fastapi.templating import Jinja2Templates
templates = Jinja2Templates(directory="./templates")       # tells FastAPI to look for HTML files in templates directory

@app.get("/", tags=["prediction_ui"])
async def index(request: Request):
    """
    This route serves the main upload page.
    """
    return templates.TemplateResponse("upload.html", {"request": request})        # immediately redirects the user to the upload page

@app.get("/train")
async def train_route():
    try:
        train_pipeline=TrainingPipeline()
        train_pipeline.run_pipeline()
        return Response("Training is successful")       #If the pipeline completes without errors
    except Exception as e:
        raise NetworkSecurityException(e,sys)
   
   
#for batch prediction 
@app.post("/predict")
async def predict_route(request: Request,file: UploadFile = File(...)):
    """
    Endpoint to handle file upload by user at frontend and make predictions.
    """
    try:
        df=pd.read_csv(file.file)
        #print(df)
        preprocesor=load_object("final_model/preprocessor.pkl")
        final_model=load_object("final_model/model.pkl")
        network_model = NetworkModel(preprocessor=preprocesor,model=final_model)
        print(df.iloc[0])
        y_pred = network_model.predict(df)
        print(y_pred)
        df['predicted_column'] = y_pred
        print(df['predicted_column'])
        #df['predicted_column'].replace(-1, 0)
        #return df.to_json()
        
        threat_explanations = []
        for threat_level in y_pred:
            if threat_level == 0:
                threat_explanations.append("Legitimate")
            else:
                threat_explanations.append("Suspicious")
            
        
        df['threat_explanation'] = threat_explanations
        
        # Save results
        df.to_csv('prediction_output/output.csv',index=False)
        
        #Generate HTML table
        table_html = df.to_html(classes='table table-hover',index=False, escape=False)
        #print(table_html)
        return templates.TemplateResponse("table.html", {"request": request, "table": table_html})
        
    except Exception as e:
            raise NetworkSecurityException(e,sys)
    

if __name__=="__main__":
    app_run(app,host="0.0.0.0",port=8000)
