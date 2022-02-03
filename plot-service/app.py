from flask import Flask
from flask_cors import CORS

from routes.plot import plot_api

# Defines the Flask app
app = Flask(__name__)

# Cross Origin Resource Sharing (CORS) is enabled for the app
CORS(app)

app.register_blueprint(plot_api)


@app.route('/')
def check():
    return "Plot service running"


if __name__ == '__main__':
    app.run(host='localhost', port=5002)
