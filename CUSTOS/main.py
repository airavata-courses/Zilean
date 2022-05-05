from urllib import response
from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse

import os
import json
import random, string

from custos.clients.user_management_client import UserManagementClient
from custos.clients.group_management_client import GroupManagementClient
from custos.clients.resource_secret_management_client import ResourceSecretManagementClient
from custos.clients.sharing_management_client import SharingManagementClient
from custos.clients.identity_management_client import IdentityManagementClient


from custos.transport.settings import CustosServerClientSettings
import custos.clients.utils.utilities as utl

from google.protobuf.json_format import MessageToJson


app = Flask(__name__)
api = Api(app)

global custosTest
class CUSTOS_TEST():
    def __init__(self):
        try :
            # read settings
            self.custos_settings = CustosServerClientSettings(custos_host='custos.scigap.org',
                            custos_port='31499', 
                            custos_client_id='custos-kds75gnub6foethk7th1-10003428',
                            custos_client_sec='3w5y913TLN97rbstWslEkfKUMU6h7gSEsw4mbs6w')

            # create custos user management client
            self.user_management_client = UserManagementClient(self.custos_settings)

            # create custos group management client
            self.group_management_client = GroupManagementClient(self.custos_settings)

            # create custos resource secret client
            self.resource_secret_client = ResourceSecretManagementClient(self.custos_settings)

            # create sharing management client
            self.sharing_management_client = SharingManagementClient(self.custos_settings)

            # create identity management client
            self.identity_management_client = IdentityManagementClient(self.custos_settings)


            # obtain base 64 encoded token for tenant
            self.b64_encoded_custos_token = utl.get_token(custos_settings=self.custos_settings)
            print(self.b64_encoded_custos_token)

            self.created_groups = {}

            self.admin_user_name = "pkapil@iu.edu"
            self.admin_password = "Parthkapil25#"
            
            #   admin_user_name = "I_WONT_SHARE_MY_USER_NAME"
            #   admin_password = "GUESS_IT_IF_YOU_CAN"
            
            self.resource_ids = []
            print("Successfully configured all custos clients")
        except Exception as e:
            raise e
            print("Custos Id and Secret may wrong "+ str(e))
            
            
    def register_users(self, user):
        print("Registering user: " + user['username'])
        try:
            self.user_management_client.register_user(token=self.b64_encoded_custos_token,
                                                username=user['username'],
                                                first_name=user['first_name'],
                                                last_name=user['last_name'],
                                                password=user['password'],
                                                email=user['email'],
                                                is_temp_password=False)
            self.user_management_client.enable_user(token=self.b64_encoded_custos_token, username=user['username'])
        except Exception:
            print("User may be already exist")
                
    def create_groups(self, groups):
        for group in groups:
            try:
                print("Creating group: " + group['name'])
                grResponse = self.group_management_client.create_group(token=self.b64_encoded_custos_token,
                                                                name=group['name'],
                                                                description=group['description'],
                                                                owner_id=group['owner_id'])
                resp = MessageToJson(grResponse)
                print(resp)
                respData = json.loads(resp)
                print("Created group id of "+ group['name'] + ": " +respData['id'] )
                self.created_groups[respData['name']] = respData['id']
            except Exception as e:
                print(e)
                print("Group may be already created")
                
                
class RegisterUser(Resource):
    def post(self):
        try:
            req_data = request.get_json()
        except:
            response = {
                "code": "error",
                "message": "unable to load request"
            }
            
            return jsonify(response)
            
        print(req_data)
        try:
            global custosTest
            custosTest.register_users(req_data)
            
            response = {
                "code": "success",
                "message": "User Registered!"
            }
            
            return jsonify(response)
        
        except BaseException as error:
            print(error)
            err_str = "errro is : " + str(error)
            response = {
                "code": "error",
                "message": err_str
            }
            return jsonify(response)
            
                
                
                

class IsWorking(Resource):
    def get(self):
        return {"message": "CUSTOS TEST API WORKING!!!"}
        

api.add_resource(IsWorking, "/isworking")
api.add_resource(RegisterUser, "/register-user")

def initialize():
    global custosTest
    custosTest = CUSTOS_TEST()
    
if __name__ == "__main__":
    initialize()
    app.run(host='0.0.0.0', port=8765)
