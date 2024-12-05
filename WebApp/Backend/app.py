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


@app.route("/api/insertUniversity", methods=["POST"])
def insert_university():
    data = request.json
    university_name = data.get('university')

    if not university_name:
        return jsonify({"error": "University name is required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            # Insert university if it doesn't exist
            # insert_query = """
            #     INSERT INTO universities (name)
            #     VALUES (%s)
            #     ON DUPLICATE KEY UPDATE name = name
            # """
            # cursor.execute(insert_query, (university_name,))

            # Query the inserted/updated university information
            select_query = """
                SELECT InstitutionId, Institution_Name, City, Country
                FROM m_university
                WHERE Institution_Name = %s
            """
            cursor.execute(select_query, (university_name,))
            university_info = cursor.fetchone()
            print("AAAAAAAAAAAAAA")
            if university_info:
                conn.commit()
                print("AAAAAAAAAAAAAA")
                print(university_info)
                return jsonify(university_info), 200
            else:
                return jsonify({"error": "University not found after insertion"}), 404

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()



@app.route("/api/UpdateWorkInfo", methods=["PUT"])
def update_work():
    data = request.json
    work_id = data.get('work_id')
    title = data.get('title')
    publication_year = data.get('publication_year')
    authors = data.get('authors', [])
    topics = data.get('topics', [])
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Update title and publication_year in `work` table
            query_work = """
                UPDATE work
                SET title = %s, publication_year = %s
                WHERE work_id = %s
            """
            cursor.execute(query_work, (title, publication_year, work_id))
            
            # Delete existing authors/topics and re-insert them
            query_delete_authors = """
                DELETE FROM work_author
                WHERE work_id = (SELECT work_id FROM work WHERE work_id = %s)
            """
            cursor.execute(query_delete_authors, (work_id,))

            for author in authors:
                query_add_author = """
                    INSERT INTO author (author_name)
                    VALUES (%s)
                    ON DUPLICATE KEY UPDATE author_name = author_name
                """
                cursor.execute(query_add_author, (author,))

                query_work_author = """
                    INSERT INTO work_author (work_id, author_id)
                    SELECT work.work_id, author.author_id
                    FROM work, author
                    WHERE work.title = %s AND author.author_name = %s
                """
                cursor.execute(query_work_author, (title, author))
            
            query_delete_topics = """
                DELETE FROM work_topic
                WHERE work_id = (SELECT work_id FROM work WHERE title = %s)
            """
            cursor.execute(query_delete_topics, (title,))

            for topic in topics:
                query_add_topic = """
                    INSERT INTO topic (topic_name)
                    VALUES (%s)
                    ON DUPLICATE KEY UPDATE topic_name = topic_name
                """
                cursor.execute(query_add_topic, (topic,))

                query_work_topic = """
                    INSERT INTO work_topic (work_id, topic_id)
                    SELECT work.work_id, topic.topic_id
                    FROM work, topic
                    WHERE work.title = %s AND topic.topic_name = %s
                """
                cursor.execute(query_work_topic, (title, topic))

        conn.commit()
        return jsonify({"message": "Work info updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

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
                SELECT work_id, title, publication_year 
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
                    "id": workTitle[0]['work_id'][21:],
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