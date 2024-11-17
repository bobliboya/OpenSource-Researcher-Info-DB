# app.py
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

# Replace placeholders with your actual GCP and DB details
db_user = 'FlaskPJ'
db_password = '12opensource34'
db_name = 'opensource'
cloud_sql_connection_name = 'opensource-394028:us-central1:db-opensource-fa24'

app = Flask(__name__)
db_config = {
    'user': db_user,
    'password': db_password,
    'host': cloud_sql_connection_name,  # Use the Public IP address, not the instance connection name
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

# Your MySQL connection id is 394028

# Configuring SQLAlchemy Database URI for GCP Cloud SQL
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{db_user}:{db_password}@/{db_name}"
    f"?unix_socket=/cloudsql/{cloud_sql_connection_name}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db = SQLAlchemy(app)


# Define a model
class DataModel(db.Model):
    __tablename__ = 'your_table_name'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(200), nullable=False)


# # API endpoint to fetch all data
# @app.route('/api/data', methods=['GET'])
# def get_data():
#     try:
#         data = DataModel.query.all()
#         return jsonify([{"id": d.id, "name": d.name, "value": d.value} for d in data])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return render_template('index.html')

# Root endpoint
@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

