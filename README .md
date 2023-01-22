
# Flask Project

Instruction

To create a basic functioning flask app with database setup.

Framework

    Flask

Backend

    Python

Frontend
    
    ReactJS

Database

    MongoDB

Backend Task

    Create a MongoDB model for users with the following fields:
        1)  First name, last name, email, phone and an embedded field that contains a string field for message
        2)  API to update any of these fields 
        3)  API to create/delete the user
        4)  API to fetch users using any of the 4 fields (first name, last name, email, phone - if multiple users exist return all of them)
        5)  API to send an email to all users in the DB with Subject “Welcome” and body containing the “message” field.

Frontend Task
    
    Create a react server for a simple UI for the above functionality
        1   Creation of user - input all the fields and send to backend
        2)  Update user - take the field to update
        3)  Search user - to search for all users with the same name, phone or email.
        4)  Email all users - button that will send out the emails


Intallation:

    Backend
        
        1)  pip install flask
        2)  pip install flask_cors
        3)  pip install pymongo

    Frontend

        1) npx create-react-app reactfrontend
        2)npm i bootstrap axios react-router-dom@5.2.0








