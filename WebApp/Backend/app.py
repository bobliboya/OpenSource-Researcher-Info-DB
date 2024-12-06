# app.py
from flask import Flask, jsonify, request, send_file
import mysql.connector
from s import *
from api.query import *
import utils
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

people_info_set = set()
topic_info_set = set()
university_info_set = set()

# people_info_set = {frozenset({'name': 'Alice', 'university_name': 'University A'}.items()),
#                    frozenset({'name': 'Bob', 'university_name': 'University A'}.items())}
# university_info = {'Institution_Name': 'University A'}
# topic_info_set = [{'topic_name': 'Computer Science'}, {'topic_name': 'Mathematics'}]

db_config = {
    'user': db_user,
    'password': db_password,
    'host': db_connection_name,  # Use the Public IP address, not the instance connection name
    'database': db_name
}

def get_topic_id(topic_name):
    if not topic_name:
        return None  # Return None if no author name is provided

    try:
        # Establish connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Create a query to fetch the author ID for a specific name
        query = "SELECT topic_id FROM topic WHERE topic_name = %s"
        
        # Execute query with the author's name
        cursor.execute(query, (topic_name,))

        # Fetch the result
        result = cursor.fetchone()

        # If an ID is found, return it; otherwise return None
        return result[0] if result else None

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

    finally:
        # Clean up resources
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def get_author_id(author_name):
    if not author_name:
        return None  # Return None if no author name is provided

    try:
        # Establish connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Create a query to fetch the author ID for a specific name
        query = "SELECT author_id FROM author WHERE author_name = %s"
        
        # Execute query with the author's name
        cursor.execute(query, (author_name,))

        # Fetch the result
        result = cursor.fetchone()

        # If an ID is found, return it; otherwise return None
        return result[0] if result else None

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

    finally:
        # Clean up resources
        if cursor:
            cursor.close()
        if conn:
            conn.close()

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
            
            if university_info:
                # Generate the relationship graph
                output_file = 'relationship_graph.png'
                utils.draw_relationship_graph(people_info_set, university_info, topic_info_set, output_file)

                conn.commit()
                return send_file(output_file, mimetype='image/png')
            else:
                return jsonify({"error": "University not found after insertion"}), 404

            # if university_info:
            #     # compare university with other people
            #     for people_info in people_info_set:
            #         print("start comparing")
            #         if utils.find_relationship(people_info, university_info):
            #             print("YESSSSSSSSSSS")
            #             print(people_info, university_info)
            #         else:
            #             print("NOOOOOOOOOOOOOOO")
            #             print(people_info, university_info)
            #     # draw the graph after inserting the university
            #     print("start drawing")
            #     output_file = 'relationship_graph.png'
            #     utils.draw_relationship_graph(people_info_set, university_info, topic_info_set, output_file)
            #     print("end drawing")
            #     return send_file(output_file, mimetype='image/png')
            #     # utils.draw_relationship_graph(people_info_set, university_info, topic_info_set)

            #     # conn.commit()
            #     # print(university_info)
            #     # return jsonify(university_info), 200
            # else:
                return jsonify({"error": "University not found after insertion"}), 404

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route('/draw_graph', methods=['GET'])
def draw_graph():
    output_file = 'relationship_graph.png'
    utils.draw_relationship_graph(people_info_set, university_info_set, topic_info_set, output_file)
    return send_file(output_file, mimetype='image/png')


@app.route("/api/insertTopic", methods=["POST"])
def insert_topic():
    data = request.json
    topic_name = data.get('topic')

    if not topic_name:
        return jsonify({"error": "Topic name is required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            select_query = """
                SELECT topic_id, topic_name, category
                FROM m_topic
                WHERE topic_name = %s
            """
            cursor.execute(select_query, (topic_name,))
            topic_info = cursor.fetchone()
            if topic_info:
                # compare the topic name with the other topics
                # matching_topics = []
                # for topic in topic_set:
                #     if find_relationship(topic, topic_name):
                #         matching_topics.append(topic)
                
                conn.commit()
                print(topic_info)
                return jsonify(topic_info), 200
                # return jsonify({
                #     "topic_info": topic_info,
                #     "matching_topics": matching_topics
                # }), 200
            else:
                return jsonify({"error": "Topic not found after insertion"}), 404

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route("/api/insertPeople", methods=["POST"])
def insert_people():
    data = request.json
    people_name = data.get('people')
    print("PeopleName:", people_name)

    if not people_name:
        return jsonify({"error": "People name is required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            select_query = """
                SELECT author_id, author_name, university_name
                FROM m_author
                WHERE author_name = %s
            """
            cursor.execute(select_query, (people_name,))
            people_info = cursor.fetchone()
            if people_info:
                # people_info_set.add(people_info)
                # Convert people_info dictionary to a frozenset of its items
                people_info_frozenset = frozenset(people_info.items())

                # Add the frozenset to the people_info_set
                people_info_set.add(people_info_frozenset)

                conn.commit()
                print("people_info: ", people_info)
                print("people_info_set: ", people_info_set)
                print("people_info_frozenset: ", people_info_frozenset)
                return jsonify(people_info), 200
            else:
                return jsonify({"error": "People not found after insertion"}), 404

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()


@app.route("/api/UpdateWorkInfo", methods=["PUT"])
def update_work():
    data = request.json
    work_id = "https://openalex.org/" + data.get('work_id')
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
            # delete all author entries in the work_author table
            for author in authors:
                author_id = get_author_id(author)
                query_del_author = """
                    DELETE FROM work_author 
                    WHERE author_id = %s AND work_id = %s
                    """
                print(work_id)
                cursor.execute(query_del_author, (author_id, work_id))
            
            # update the authors works relational table 
            for author in authors:
                # get the author id
                author_id = get_author_id(author)

                query_work_author = """
                    INSERT 
                    INTO work_author (work_id, author_id)
                    VALUES (%s, %s)
                """
                cursor.execute(query_work_author, (work_id, author_id))
            
            for topic in topics:
                topic_id = get_topic_id(topic)
                query_del_topic = """
                    DELETE FROM topic_work 
                    WHERE topic_id = %s AND work_id = %s
                    """
                cursor.execute(query_del_topic, (topic_id, work_id))
            
            # update the topic works relational table 
            for topic in topics:
                # get the author id
                topic_id = get_topic_id(topic)

                query_work_topic = """
                    INSERT 
                    INTO topic_work (work_id, topic_id)
                    VALUES (%s, %s)
                """
                cursor.execute(query_work_topic, (work_id, topic_id))

        conn.commit()
        return jsonify({"message": "Work info updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        print(e)
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

@app.route("/api/music")
def get_music():
    title = request.args.get('title')
    if not title:
        return jsonify({"error": "Title parameter is required"}), 400
    print("title is " + title)
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
            SELECT genre
            FROM genre_category
            WHERE category =(
                            SELECT category
                            FROM topic
                            WHERE topic_id =( 
                                            SELECT topic_id
                                            FROM topic_work
                                            WHERE work_id = (
                                                            SELECT work_id
                                                            FROM work
                                                            WHERE title = %s
                                                            )
                                            Limit 1
                                            )
                            )
            """
    cursor.execute(query, (title,))
    genre= cursor.fetchall()

    if conn.is_connected():
        cursor.close()
        conn.close()
    return jsonify([{"genre": row[0]} for row in genre])

@app.route("/api/music/delete", methods=["DELETE"])
def delete_music():
    music_id = request.args.get('musicId')
    if not music_id:
        return jsonify({"error": "MusicId parameter is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL Delete Command
        query = "DELETE FROM m_music WHERE MusicId = %s"
        cursor.execute(query, (music_id,))

        # Commit the changes
        conn.commit()

        # Close the database connection
        cursor.close()
        conn.close()

        return jsonify({"message": f"Music with ID {music_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Backend for Team 096. Used as an API"

if __name__ == "__main__":
    app.run(debug=True)




