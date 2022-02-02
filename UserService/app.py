# -*- coding: utf-8 -*-
"""
Created on Thu Jan 27 00:30:46 2022

@author: aishw
"""

from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash

from pymongo import MongoClient

# Making a Connection with MongoDB

app = Flask(__name__)

uri = "mongodb://localhost:27017"
db = MongoClient(uri)['User_service']
#collection = 'Registration_data'
 
@app.route("/register", methods=["POST"])
def register():
    _email = request.json["email"]
    dbemail = db.Registration_data.find_one({"email": _email})
        
    if dbemail:
        return jsonify(message="User Already Exist"), 409
    else:
        hash_password = generate_password_hash(request.json["password"])
        dc = {"name" : request.json["name"], 
                           "email":request.json["email"],
                           "password":hash_password}
        db.Registration_data.insert_one(dc)
        return jsonify(message="User added sucessfully"), 201


@app.route("/login", methods=["POST"])
def login():
    _email = request.json["email"]
    _password = request.json["password"]

    dbemail = db.Registration_data.find_one({"email": _email})

    if dbemail['email'] == _email:
        if check_password_hash(dbemail["password"], _password):
            
            return jsonify(message="Login Succeeded!"), 201
        else:
            return jsonify(message="Bad password"), 401
    else:
        return jsonify(message="Bad Email"), 401

if __name__ == '__main__':
    app.run()