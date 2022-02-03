from uuid import uuid4
from flask import Flask, jsonify, request
import moment
from werkzeug.security import generate_password_hash, check_password_hash

from pymongo import MongoClient

app = Flask(__name__)

uri = "mongodb://localhost:27017"
db = MongoClient(uri)['user-service']

@app.route("/v1/user/signup", methods=["POST"])
def register():
    email = request.json.get("email")
    existingUser = db.user.find_one({"email": email})
        
    if existingUser:
        return jsonify(message="User with email {email} Already Exist".format(email=email)), 409

    hash_password = generate_password_hash(request.json.get("password"))
    db.user.insert_one({
        "email": request.json.get("email"),
        "password": hash_password,
        "uuid": uuid4(),
        "updated_at": moment.utcnow(),
        "created_at": moment.utcnow()
    })
    return jsonify(message="User registered sucessfully"), 200


@app.route("/v1/user/login", methods=["GET"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    existingUser = db.user.find_one({"email": email})

    if not existingUser:
        return jsonify(message="User does not exist"), 401

    if not check_password_hash(existingUser.get("password"), password):
        return jsonify(message="Bad password"), 401

    return jsonify({
        "user_id": existingUser.get("uuid")
    }), 200
        

if __name__ == '__main__':
    app.run(host = "localhost",port=5005)