from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import requests
import os
from os.path import join, dirname
from dotenv import load_dotenv

from .utils import plot

load_dotenv()

# Defines the Flask app
app = Flask(__name__)

# Cross Origin Resource Sharing (CORS) is enabled for the app
CORS(app)

# app.register_blueprint(audit_api)


@app.route('/')
def check():
    return plot.starter()

if __name__ == '__main__':
    app.run(host='localhost', port=5005)