# app.py
from flask import Flask, jsonify, request
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

# this function will return the authors, topics, and publication year for a given title
@app.route("/api/GetWorkInfo/", methods=["GET"])
def get_output_info():
    title = request.args.get('title')

    if not title:
        return jsonify({"error": "Title parameter is required"}), 400
    print("title is " + title)
    try:
        # Establish a connection to the database
        connection = get_db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Query the database for a work object with the given title
            queryWork = """
                SELECT title, publication_year 
                FROM work
                WHERE title = %s
            """
            queryAuthors = """
                SELECT author_name 
                FROM work 
                    JOIN work_author ON work.work_id = work_author.work_id
                    JOIN author on author.author_id = work_author.author_id
                WHERE work.title = %s; 
            """
            queryTopics = """
                SELECT topic_name 
                FROM work 
                    JOIN topic_work ON work.work_id = topic_work.work_id
                    JOIN topic on topic.topic_id = topic_work.topic_id
                WHERE work.title = %s 
            """

            cursor.execute(queryWork, (title,))
            workTitle = cursor.fetchall()
            cursor.execute(queryAuthors, (title,))
            authors = cursor.fetchall()
            cursor.execute(queryTopics, (title,))
            topics = cursor.fetchall()

            if workTitle:
                work_data = {
                    "title": workTitle[0]['title'],
                    "publication_year": workTitle[0]['publication_year'],
                    "authors": authors,
                    "topics": topics,
                }
                print(work_data)
                return jsonify(work_data), 200
            else:
                return jsonify({"error": "Title Does Not Exist"}), 400

    except Error as e:
        print(f"Error connecting to the database: {e}")
        return jsonify({"error": "Database connection error"}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


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