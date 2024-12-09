# app.py
from flask import Flask, jsonify, request, send_file
import mysql.connector
from s import *
from api.query import *
import utils
from flask_cors import CORS
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

people_info_set = set()
topic_info_set = set()
university_info_set = set()
work_info_set = set()

work_author_dict = {}
topic_work_dict = {}

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
        conn = get_db_connection()
        cursor = conn.cursor()

        query = "SELECT topic_id FROM topic WHERE topic_name = %s"
        
        cursor.execute(query, (topic_name,))

        result = cursor.fetchone()

        return result[0] if result else None

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

    finally:
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

        query = "SELECT author_id FROM author WHERE author_name = %s"
        
        cursor.execute(query, (author_name,))

        result = cursor.fetchone()

        return result[0] if result else None

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_work_author_table():
    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            # Query to get the relational table
            select_query = """
                SELECT work_id, author_id
                FROM m_work_author
            """
            cursor.execute(select_query)
            results = cursor.fetchall()

            # Convert the results to a dictionary
            global work_author_dict
            work_author_dict = {}
            for row in results:
                work_id = row['work_id']
                author_id = row['author_id']
                if work_id in work_author_dict:
                    work_author_dict[work_id].append(author_id)
                else:
                    work_author_dict[work_id] = [author_id]
            print(work_author_dict)

    except Exception as e:
        print("Error:", e)

    finally:
        conn.close()


def get_topic_work_table():
    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            # Query to get the relational table
            select_query = """
                SELECT topic_id, work_id
                FROM topic_work
            """
            cursor.execute(select_query)
            results = cursor.fetchall()

            # Convert the results to a dictionary
            global topic_work_dict
            topic_work_dict = {}
            for row in results:
                topic_id = row['topic_id']
                work_id = row['work_id']
                if topic_id in topic_work_dict:
                    topic_work_dict[topic_id].append(work_id)
                else:
                    topic_work_dict[topic_id] = [work_id]
            # print(topic_work_dict)

    except Exception as e:
        print("Error:", e)

    finally:
        conn.close()


def get_work_tag(work_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT tag FROM work WHERE work_id = %s"
        cursor.execute(query, (work_id,))
        result = cursor.fetchone()
        return result['tag'] if result else None

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

    finally:
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
                university_info_set.add(frozenset(university_info.items()))
                output_file = 'relationship_graph.png'
                print(university_info_set)
                utils.draw_relationship_graph(topic_work_dict, work_author_dict, work_info_set, people_info_set, university_info_set, topic_info_set, output_file)

                # conn.commit()
                # return send_file(output_file, mimetype='image/png')
                # Encode the image in base64
                with open(output_file, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

                conn.commit()
                return jsonify({
                    "university_info": university_info,
                    "image": encoded_string
                }), 200
            else:
                return jsonify({"error": "University not found after insertion"}), 404


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

    if not work_author_dict:
        get_work_author_table()

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
                people_info_set.add(people_info_frozenset)
                output_file = 'relationship_graph.png'
                utils.draw_relationship_graph(topic_work_dict, work_author_dict, work_info_set, people_info_set, university_info_set, topic_info_set, output_file)
                
                with open(output_file, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                

                conn.commit()
                return jsonify({
                    "people_info": people_info,
                    "image": encoded_string
                }), 200
            else:
                return jsonify({"error": "People not found after insertion"}), 404

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()





def get_total_pop_of_category(category):
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        # query = "CALL GetTotalPop('%s', @result); SELECT @result;"
        query = """
            SELECT SUM(pop) AS total_pop
            FROM work
            WHERE work_id IN (
                SELECT tw.work_id
                FROM topic_work tw
                JOIN topic t ON tw.topic_id = t.topic_id
                WHERE t.category = %s
            );
            """
        cursor.execute(query, (category,))
        # print("result:", result)
        # result = cursor.fetchone()
        # new_query = "SELECT @total AS total_pop;"
        # cursor.execute(new_query)
        result = cursor.fetchone()
        print("result:", result)
        return result['total_pop'] if result else None

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()





# @app.route('/draw_graph', methods=['GET'])
# def draw_graph():
#     output_file = 'relationship_graph.png'
#     utils.draw_relationship_graph(people_info_set, university_info_set, topic_info_set, output_file)
#     return send_file(output_file, mimetype='image/png')


@app.route("/api/insertTopic", methods=["POST"])
def insert_topic():
    data = request.json
    topic_name = data.get('topic')

    if not topic_name:
        return jsonify({"error": "Topic name is required"}), 400
    
    if not topic_work_dict:
        get_topic_work_table()

    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            select_query = """
                SELECT topic_id, topic_name, category
                FROM topic
                WHERE topic_name = %s
            """
            print("finish query")
            cursor.execute(select_query, (topic_name,))
            topic_info = cursor.fetchone()
            # print("topic_info:", topic_info)
            if topic_info:
                # print("staart getting total pop")
                new_value = get_total_pop_of_category(topic_info['category'])
                # print("finished getting total pop")
                print("new_value:", new_value)
                topic_info['total_popularity'] = new_value
                # print("topic_info: ", topic_info)
                topic_info_set.add(frozenset(topic_info.items()))
                output_file = 'relationship_graph.png'
                utils.draw_relationship_graph(topic_work_dict, work_author_dict, work_info_set, people_info_set, university_info_set, topic_info_set, output_file)

                with open(output_file, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

                conn.commit()
                print(topic_info)
                return jsonify({
                    "topic_info": topic_info,
                    "image": encoded_string
                }), 200
            else:
                return jsonify({"error": "Topic not found after insertion"}), 404

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        conn.close()

@app.route("/api/insertWork", methods=["POST"])
def insert_work():
    data = request.json
    work_name = data.get('work')
    print("WorkName:", work_name)

    if not work_name:
        return jsonify({"error": "Work name is required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            select_query = """
                SELECT work_id, title, publication_year
                FROM work
                WHERE title = %s
            """
            cursor.execute(select_query, (work_name,))
            work_info = cursor.fetchone()
            print("WorkInfo:", work_info)
            if work_info:
                # Call the stored procedure to get the tag value
                tag_value = get_work_tag(work_info['work_id'])
                print("Tag Value:", tag_value)
                if tag_value == 1:
                    print("i should modify the work info")
                    work_info['title'] += '*'
                # node_color = 'orange' if tag_value == 1 else 'default_color'
                # print(f"Node Color: {node_color}")
                print(f"Modified WorkInfo: {work_info}")

                work_info_set.add(frozenset(work_info.items()))
                output_file = 'relationship_graph.png'
                print("start drawing")
                utils.draw_relationship_graph(topic_work_dict, work_author_dict, work_info_set, people_info_set, university_info_set, topic_info_set, output_file)
                print("end drawing")
                with open(output_file, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

                conn.commit()
                print("work_info:", work_info)
                return jsonify({
                    "work_info": work_info,
                    "image": encoded_string
                }), 200
            else:
                return jsonify({"error": "Work not found after insertion"}), 404

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
            SELECT filename 
            FROM music
            WHERE genre = (
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
                        )
            ORDER BY RAND()
            Limit 1;
            """
    cursor.execute(query, (title,))
    result = cursor.fetchone()  # Fetch the single row

    if conn.is_connected():
        cursor.close()
        conn.close()

    if not result:
        return jsonify({"error": "No file found for the given title"}), 404

    filename = result[0]  # Extract the first element of the tuple
    file_url = f"/static/audio/{filename}"  # Construct the file URL
    return jsonify({"file_url": file_url})


@app.route("/api/music/delete", methods=["DELETE"])
def delete_music():
    music_id = request.args.get('musicId')
    if not music_id:
        return jsonify({"error": "MusicId parameter is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL Delete Command
        query = "DELETE FROM music WHERE MusicId = %s"
        cursor.execute(query, (music_id,))

        # Commit the changes
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": f"Music with ID {music_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics', methods=['POST'])
def get_statistics():
    category = request.json.get('category')  # Expecting JSON input
    if not category:
        return jsonify({"error": "Category parameter is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Query 1: Publications by Year
        query_by_year = """
        SELECT work.publication_year,
               COUNT(work.work_id)
        FROM   work
               JOIN topic_work
                 ON topic_work.work_id = work.work_id
               JOIN topic
                 ON topic_work.topic_id = topic.topic_id
        WHERE  topic.category = %s
        GROUP  BY work.publication_year
        ORDER  BY work.publication_year ASC;
        """
        cursor.execute(query_by_year, (category,))
        publications_by_year = [{"year": row[0], "count": row[1]} for row in cursor.fetchall()]

        # Query 2: Publications by University
        query_by_university = """
        SELECT   COUNT(work.work_id),
                 author.university_name
        FROM     work
        JOIN     author
        JOIN     work_author
        JOIN     topic
        JOIN     topic_work
        ON       work_author.work_id = work.work_id
        AND      work_author.author_id = author.author_id
        AND      topic_work.topic_id = topic.topic_id
        AND      topic_work.work_id = work.work_id
        WHERE topic.category = %s
        AND author.university_name != 'Unknown'
        GROUP BY author.university_name
        ORDER BY COUNT(work.work_id) DESC
        LIMIT 100;
        """
        cursor.execute(query_by_university, (category,))
        publications_by_university = [{"university": row[1], "count": row[0]} for row in cursor.fetchall()]

        # Update Query
        update_query = """
        UPDATE work
        SET pop = pop + 1
        WHERE work_id IN (
        SELECT work_id 
        FROM topic_work 
        WHERE topic_id IN (
        SELECT topic_id 
        FROM topic 
        WHERE category = %s
        ));
        """
        cursor.execute(update_query, (category,))
        conn.commit()

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

    return jsonify({
        "publications_by_year": publications_by_year,
        "publications_by_university": publications_by_university,
        "update_message": "Database updated successfully."
    })

@app.route("/")
def home():
    return "Backend for Team 096. Used as an API"

if __name__ == "__main__":
    app.run(debug=True)




