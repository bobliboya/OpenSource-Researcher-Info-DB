# app.py
from flask import Flask, jsonify
import mysql.connector
from s import *
from api.query import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

db_config = {
    'user': db_user,
    'password': db_password,
    'host': db_connection_name,  # Use the Public IP address, not the instance connection name
    'database': db_name
}



# Initialize the connection
def get_db_connection():
    print("Connecting...")
    conn = mysql.connector.connect(**db_config)
    print("Connected!")
    return conn

@app.route("/api/authors")
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    query = generate_query(get_colnames("author"), "author")
    cursor.execute(query)
    data = cursor.fetchall()
    
    column_names = [desc[0] for desc in cursor.description]
    authors = [dict(zip(column_names, row)) for row in data]

    cursor.close()
    conn.close()
    return jsonify(authors)

@app.route("/")
def home():
    return "Backend for Team 096. Used as an API"

if __name__ == "__main__":
    app.run(debug=True)