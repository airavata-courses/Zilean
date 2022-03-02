from flask import Flask
from flask_cors import CORS

from routes.drs import drs_api

# Defines the Flask app
app = Flask(__name__)

# Cross Origin Resource Sharing (CORS) is enabled for the app
CORS(app)

app.register_blueprint(drs_api)


@app.route('/')
def check():
    return "Data Retrieval service running"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
