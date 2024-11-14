# app.py
from flask import Flask
import mysql.connector
from s import *


app = Flask(__name__)
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

@app.route("/authors")
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM author")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"data": data}

@app.route("/")
def home():
    return db_config['user']

if __name__ == "__main__":
    app.run(debug=True)
