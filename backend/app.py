from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import re


app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017")
# db = client.lin_flask
db = client['reactflaskdbsample'] ## database name

app.config['MAIL_SERVER']='smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = 'your@email.com'
app.config['MAIL_PASSWORD'] = 'yourPassword'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)
CORS(app)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/users', methods=['POST', 'GET'])
def data():
    
    # POST a data to database
    if request.method == 'POST':
        body = request.json
        firstName = body['firstName']
        lastName = body['lastName']
        emailId = body['emailId']
        phoneNumber = body['phoneNumber']
        message = body['message'] 
        # db.users.insert_one({
        db['users'].insert_one({
            "firstName": firstName,
            "lastName": lastName,
            "emailId":emailId,
            "phoneNumber":phoneNumber,
            "message":message
        })
        return jsonify({
            'status': 'Data is posted to MongoDB!',
            'firstName': firstName,
            'lastName': lastName,
            'emailId':emailId,
            'phoneNumber':phoneNumber,
            'message':message
        })

    # GET all data from database
    if request.method == 'GET':
        allData = db['users'].find()
        dataJson = []
        for data in allData:
            id = data['_id']
            firstName = data['firstName']
            lastName = data['lastName']
            emailId = data['emailId']
            phoneNumber = data['phoneNumber']
            message = data['message']
            dataDict = {
                'id': str(id),
                'firstName': firstName,
                'lastName': lastName,
                'emailId': emailId,
                'phoneNumber':phoneNumber,
                'message':message
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)

@app.route('/users/<string:id>', methods=['GET', 'DELETE', 'PUT'])
def onedata(id):

    # GET a specific data by id
    if request.method == 'GET':
        data = db['users'].find_one({'_id': ObjectId(id)})
        id = data['_id']
        firstName = data['firstName']
        lastName = data['lastName']
        emailId = data['emailId']
        phoneNumber = data['phoneNumber']
        message = data['message']
        dataDict = {
            'id': str(id),
            'firstName': firstName,
            'lastName': lastName,
            'emailId':emailId,
            'phoneNumber':phoneNumber,
            'message':message
        }
        print(dataDict)
        return jsonify(dataDict)
    
    # UPDATE a data by id
    if request.method == 'PUT':
        body = request.json
        print("logging body:", body)
        firstName = body['firstName']
        lastName = body['lastName']
        emailId = body['emailId']
        phoneNumber = body['phoneNumber']
        message = body['message']

        db['users'].update_one(
            {'_id': ObjectId(id)},
            {
                "$set": {
                    "firstName":firstName,
                    "lastName":lastName,
                    "emailId": emailId,
                    "phoneNumber":phoneNumber,
                    "message":message
                }
            }
        )

        print('\n # Update successful # \n')
        return jsonify({'status': 'Data id: ' + id + ' is updated!'})

    # DELETE a data
    if request.method == 'DELETE':
        db['users'].delete_many({'_id': ObjectId(id)})
        print('\n # Deletion successful # \n')
        return jsonify({'status': 'Data id: ' + id + ' is deleted!'})

@app.route('/users/email', methods=['GET'])
def email():
    if request.method == 'GET':
        allData = db['users'].find()
        
        for data in allData:
            recipient = data['emailId']
            messageDetail = str(data['message'])
            print("recipient:",recipient)
            print("messageDetail:",messageDetail)
            msg = Message('Welcome!', sender = 'peter@mailtrap.io', recipients = recipient)
            msg.body = messageDetail
            mail.send(msg)
        return 200

@app.route('/getAllData', methods=['POST'])
def gettingAllData():
    resultList = []
    if request.method == 'POST':
        regex = r'[\w\.-]+@[\w\.-]+(\.[\w]+)+'
        print("Logging request:", request.get_json())
        dataJson = request.get_json()
        dataQueryParam = str(dataJson['query'])
        print("Logging request:", dataQueryParam)
        if ('@' in dataQueryParam):
            allData = db['users'].find({"emailId": dataQueryParam})
        elif dataQueryParam.isdigit():
            allData = db['users'].find({"phoneNumber": dataQueryParam})
        else:
            allData = db['users'].find({"firstName": dataQueryParam})

        for dataQueryParam in allData:
            dataDict = {
            'id': str(id),
            'firstName': dataQueryParam['firstName'],
            'lastName': dataQueryParam['lastName'],
            'emailId':dataQueryParam['emailId'],
            'phoneNumber':dataQueryParam['phoneNumber'],
            'message':dataQueryParam['message']
            }
            resultList.append(dataDict)
        return jsonify(resultList)


if __name__ == '__main__':
    app.debug = True
    app.run()