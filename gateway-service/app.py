from flask import Flask, request, jsonify
from flask_cors import CORS
import sys

from routes.audit import audit_api
from routes.user import user_api
from routes.session import session_api
from routes.data_retrieval import data_fetch_api
from routes.plot import plot_api

import os
from os.path import join, dirname
from dotenv import load_dotenv

from utils import gateway as gateway_util
load_dotenv()

# Defines the Flask app
app = Flask(__name__)

# Cross Origin Resource Sharing (CORS) is enabled for the app
CORS(app)

app.register_blueprint(audit_api)
app.register_blueprint(user_api)
app.register_blueprint(session_api)
app.register_blueprint(data_fetch_api)
app.register_blueprint(plot_api)

@app.route('/')
def check():
    return gateway_util.starter()

if __name__ == '__main__':
    app.run(host='localhost', port=5006, debug=True)