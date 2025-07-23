import os
import sys
import json
from dotenv import load_dotenv
import certifi 
import pandas as pd
import numpy as np
import pymongo 
from network_security.exception.exception import NetworkSecurityException
from network_security.logging.logger import logging

load_dotenv()

MONGO_DB_URL = os.getenv("MONGO_DB_URL")
'''print(MONGO_DB_URL)'''

ca = certifi.where()

class NetworkDataExtract():
    def __init__(self):
        try:
            pass
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
    def csv_to_json_convertor(self,file_path):
        '''To insert data from local machine into MongoDB we need to convert the CSV file into JSON format.'''
        try:
            data=pd.read_csv(file_path)
            data.reset_index(drop=True,inplace=True)                #keeps the sequence of every record from 0 to n-1
            records=list(json.loads(data.T.to_json()).values())     #df is transposed, converted to a list of dict i.e, json format
            return records
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
    def insert_data_mongodb(self,records,database,collection):
        try:
            self.database=database
            self.collection=collection
            self.records=records

            self.mongo_client=pymongo.MongoClient(MONGO_DB_URL)
            self.database = self.mongo_client[self.database]
            
            self.collection=self.database[self.collection]
            self.collection.insert_many(self.records)
            return(len(self.records))
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
if __name__=='__main__':
    FILE_PATH="Network_Data\phisingData.csv"
    DATABASE="IshikaAI"
    Collection="NetworkData"
    networkobj=NetworkDataExtract()         #instance of NetworkDataExtract class
    records=networkobj.csv_to_json_convertor(file_path=FILE_PATH)
    print(records)
    no_of_records=networkobj.insert_data_mongodb(records,DATABASE,Collection)
    print(no_of_records)
    logging.info(f"Inserted {no_of_records} records into {DATABASE}.{Collection}")