from setuptools import setup, find_packages
from typing import List

def get_requirements() -> List[str]:
    """
    This function reads a requirements file and returns a list of requirements.
    """
    requirement_lst: List[str] = []
    try:
        with open('requirements.txt', 'r') as file:
            #Reads lines from the file
            lines = file.readlines()
            #process each line
            for line in lines:
                requirement = line.strip()      #removing every emoty space from lines
                #ignore empty lines and -e .
                if requirement and requirement != '-e .':
                    requirement_lst.append(requirement)
    
    except FileNotFoundError:
        print("requirements.txt file not found. Please ensure it exists in the current directory.")
    
    return requirement_lst

setup(
    name='Network-Security',
    version='0.0.1',
    author='Ishika Saha', 
    author_email = 'ishika.sahajuly21@gmail.com',
    packages = find_packages(),
    install_requires=get_requirements(),
)