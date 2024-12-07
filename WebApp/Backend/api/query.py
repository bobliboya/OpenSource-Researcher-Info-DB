author_colnames = ["author_id", "author_name", "university_name"]
music_colnames = ["MusicID", "filename", "genre"]
topic_colnames = ["topic_id", "topic_name", "category"]
topic_work_colnames = ["topic_id", "work_id"]
university_colnames = ["InstitutionId", "Institution_Name", "City", "Country"]
work_colnames = ["work_id", "title", "publication_year"]
work_author_colnames = ["work_id", "author_id"]
genre_category = ["category", "genre"]

# SELECT 
# FROM
# WHERE
# GROUP BY
# ORDER BY



def get_colnames(table):
    if (table == "author"):
        return author_colnames
    elif (table == "music"):
        return music_colnames
    elif (table == "topic"):
        return topic_colnames
    elif (table == "topic_work"):
        return topic_work_colnames
    elif (table == "university"):
        return university_colnames
    elif (table == "work"):
        return work_colnames
    elif (table == "work_author"):
        return work_author_colnames


def generate_query(col_names, table):
    select = "SELECT " + list_to_comma(col_names)
    source = "FROM " + table
    output = select + ' ' + source
    return output




def list_to_comma(list):
    return ', '.join(list)