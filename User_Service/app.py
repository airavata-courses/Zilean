# -*- coding: utf-8 -*-
"""
Created on Thu Jan 27 00:30:46 2022

@author: aishw
"""

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import jwt
from passlib.hash import pbkdf2_sha256 as sha256
from flask_restful import Resource, reqparse
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_raw_jwt
from flask_jwt_extended import jwt_refresh_token_required
from werkzeug.security import generate_password_hash, check_password_hash
import pdb

import psycopg2 #pip install psycopg2 
import psycopg2.extras
from flask_cors import CORS

# Making a Connection with postgres

app = Flask(__name__)
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "this-is-secret-key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:aish@4125@localhost:5000/ADSProject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app) 
 
DB_HOST = "localhost"
DB_NAME = "ADSProject"
DB_USER = "postgres"
DB_PASS = "aish@4125"
     
conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)  

class RevokedTokenModel():

    """
    Save Token in DB
    """
    def add(self,email,access_token):
        
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("INSERT INTO session_history (email, access_token) VALUES (%s,%s)", (email,access_token))
        conn.commit()
        return jsonify(message="revoked token added sucessfully"), 201
        
@app.route("/register", methods=["POST"])
def register():
    _email = request.json["email"]
    # test = User.query.filter_by(email=email).first()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
          
    sql = "SELECT * FROM registration_data WHERE email=%s"
    sql_where = (_email,)
      
    cursor.execute(sql, sql_where)
    row = cursor.fetchone()  
    if row:
        return jsonify(message="User Already Exist"), 409
    else:
        _name = request.json["name"]
        _email = request.json["email"]
        _password = request.json["password"]
        hash_password = generate_password_hash(_password)
        cursor.execute("INSERT INTO registration_data (name, email, password) VALUES (%s,%s,%s)", (_name, _email, hash_password))
        conn.commit()
        return jsonify(message="User added sucessfully"), 201


@app.route("/login", methods=["POST"])
def login():
    _email = request.json["email"]
    _password = request.json["password"]

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
          
    sql = "SELECT * FROM registration_data WHERE email=%s"
    sql_where = (_email,)
      
    cursor.execute(sql, sql_where)
    row = cursor.fetchone()
    email = row['email']
    password = row['password'] 
    if email == _email:
        if check_password_hash(password, _password):
            access_token = create_access_token(identity=_email)
            refresh_token = create_refresh_token(identity=_email)
            
            sql = "SELECT * FROM session_data WHERE email=%s"
            sql_where = (_email,)
            cursor.execute(sql, sql_where)
            row = cursor.fetchone()
            if row:
                sql_update_query = "Update session_data set access_token = %s where email = %s"
                cursor.execute(sql_update_query, (access_token, _email))    
                conn.commit()
            else:
                cursor.execute("INSERT INTO session_data (email, access_token,refresh_token) VALUES (%s,%s,%s)", 
                           (_email, access_token,refresh_token))
                conn.commit()
            return jsonify(message="Login Succeeded!", 
                           access_token=access_token,
                           refresh_token=refresh_token), 201
        else:
            return jsonify(message="Bad password"), 401
    else:
        return jsonify(message="Bad Email"), 401

@app.route('/refresh', methods=['POST'])
def refresh():
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    current_user = request.json["email"]
    sql = "SELECT * FROM session_data WHERE email=%s"
    sql_where = (current_user,)
    cursor.execute(sql, sql_where)
    row = cursor.fetchone()
    access_token = row['access_token']
    revoked_token = RevokedTokenModel()
    revoked_token.add(current_user,access_token)
    
    new_access_token = create_access_token(identity=current_user)
    sql_update_query = "Update session_data set access_token = %s where email = %s"
    cursor.execute(sql_update_query, (new_access_token, current_user))    
    conn.commit()
    return {'message' : 'New Access Token Created',
        'access_token': access_token}

@app.route('/logout',methods=['POST'])
def logout():
    _email = request.json["email"]
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
          
    sql = "SELECT * FROM session_data WHERE email=%s"
    sql_where = (_email,)
    cursor.execute(sql, sql_where)
    row = cursor.fetchone()
    access_token = row['access_token']
    revoked_token = RevokedTokenModel()
    revoked_token.add(_email,access_token)
    return {'message': 'Access token has been revoked'}

if __name__ == '__main__':
    app.run()