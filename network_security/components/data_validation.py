from network_security.entity.artifact_entity import DataIngestionArtifact,DataValidationArtifact
from network_security.entity.config_entity import DataValidationConfig
from network_security.exception.exception import NetworkSecurityException 
from network_security.logging.logger import logging 
from network_security.constant.training_pipeline import SCHEMA_FILE_PATH
from scipy.stats import ks_2samp
import pandas as pd
import os,sys
from network_security.utils.main_utils.utils import read_yaml_file, write_yaml_file

class DataValidation:
    def __init__(self,data_ingestion_artifact:DataIngestionArtifact,
                 data_validation_config:DataValidationConfig):
        
        try:
            self.data_ingestion_artifact=data_ingestion_artifact
            self.data_validation_config=data_validation_config
            self._schema_config = read_yaml_file(SCHEMA_FILE_PATH)
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
    @staticmethod       #means that this method can be called without an instance(self) of the class
    def read_data(file_path)->pd.DataFrame:
        try:
            return pd.read_csv(file_path)
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
    def validate_number_of_columns(self,dataframe:pd.DataFrame)->bool:
        try:
            # Only count columns under the 'columns' key in schema.yaml
            schema_columns = []
            if isinstance(self._schema_config, dict) and 'columns' in self._schema_config:
                schema_columns = [list(col.keys())[0] for col in self._schema_config['columns'] if isinstance(col, dict)]
            logging.info(f"Schema columns: {schema_columns}")
            number_of_columns = len(schema_columns)
            logging.info(f"Required number of columns from schema: {number_of_columns}")
            logging.info(f"Train/Test DataFrame columns: {list(dataframe.columns)}")
            logging.info(f"Data frame has columns: {len(dataframe.columns)}")
            if len(dataframe.columns) == number_of_columns:
                return True
            logging.warning(f"Column count mismatch: expected {number_of_columns}, got {len(dataframe.columns)}")
            return False
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
    def detect_dataset_drift(self,base_df,current_df,threshold=0.05)->bool:
        try:
            status=True     #means no drift found
            report={}       #to store the drift report
            for column in base_df.columns:
                d1=base_df[column]
                d2=current_df[column]
                is_same_dist=ks_2samp(d1,d2)        #KS test to check if two samples are drawn from the same distribution
                #ks_2samp returns a p-value, which is the probability that the two samples are drawn from the same distribution or not
                if threshold<=is_same_dist.pvalue:
                    is_found=False  #means no drift found
                else:
                    is_found=True
                    status=False
                report.update({column:{
                    "p_value":float(is_same_dist.pvalue),
                    "drift_status":is_found
                    
                    }})
            #Artifacts/date/data_validation/drift_report/report.yaml
            drift_report_file_path = self.data_validation_config.drift_report_file_path

            #Create directory
            dir_path = os.path.dirname(drift_report_file_path)
            os.makedirs(dir_path,exist_ok=True)
            write_yaml_file(file_path=drift_report_file_path,content=report)
            return status
        except Exception as e:
            raise NetworkSecurityException(e,sys)
        
    
    def initiate_data_validation(self)->DataValidationArtifact:
        try:
            train_file_path=self.data_ingestion_artifact.trained_file_path
            test_file_path=self.data_ingestion_artifact.test_file_path

            ## read the data from train and test
            train_dataframe=DataValidation.read_data(train_file_path)
            test_dataframe=DataValidation.read_data(test_file_path)
            
            ## validate number of columns

            valid_train_path = self.data_validation_config.valid_train_file_path
            valid_test_path = self.data_validation_config.valid_test_file_path
            invalid_train_path = self.data_validation_config.invalid_train_file_path 
            invalid_test_path = self.data_validation_config.invalid_test_file_path 

            train_valid = self.validate_number_of_columns(dataframe=train_dataframe)
            test_valid = self.validate_number_of_columns(dataframe=test_dataframe)

            # Save valid/invalid train dataframe
            if train_valid:
                dir_path = os.path.dirname(valid_train_path)
                os.makedirs(dir_path, exist_ok=True)
                train_dataframe.to_csv(valid_train_path, index=False, header=True)
            else:
                if invalid_train_path:
                    dir_path = os.path.dirname(invalid_train_path)
                    os.makedirs(dir_path, exist_ok=True)
                    train_dataframe.to_csv(invalid_train_path, index=False, header=True)

            # Save valid/invalid test dataframe
            if test_valid:
                dir_path = os.path.dirname(valid_test_path)
                os.makedirs(dir_path, exist_ok=True)
                test_dataframe.to_csv(valid_test_path, index=False, header=True)
            else:
                if invalid_test_path:
                    dir_path = os.path.dirname(invalid_test_path)
                    os.makedirs(dir_path, exist_ok=True)
                    test_dataframe.to_csv(invalid_test_path, index=False, header=True)

            # Only run drift detection if both are valid
            drift_status = None
            if train_valid and test_valid:
                drift_status = self.detect_dataset_drift(base_df=train_dataframe, current_df=test_dataframe)
            else:
                drift_status = False        # means drift found

            data_validation_artifact = DataValidationArtifact(
                validation_status=drift_status,
                valid_train_file_path=valid_train_path if train_valid else None,
                valid_test_file_path=valid_test_path if test_valid else None,
                invalid_train_file_path=invalid_train_path if not train_valid else None,
                invalid_test_file_path=invalid_test_path if not test_valid else None,
                drift_report_file_path=self.data_validation_config.drift_report_file_path,
            )
            return data_validation_artifact
        except Exception as e:
            raise NetworkSecurityException(e,sys)



