# pip install pandas mysql-connector-python
import html
import pandas as pd
import mysql.connector
import pymysql
import logging


# Configure logging
logging.basicConfig(
    filename='my_script.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
# Replace these with your MySQL connection details
DB_HOST = 'localhost'
DB_USER = 'sqluser'
DB_PASSWORD = 'password'
DB_DATABASE = 'steam_games'

# CSV file path and filename
CSV_FILE = './databaseCVS/games_test_copy9.csv'


# Connect to MySQL using a context manager
try:
    with pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_DATABASE
    ) as connection:
        # Create a cursor to execute SQL queries
        cursor = connection.cursor()

        # Read the CSV data using pandas
        data = pd.read_csv(CSV_FILE, encoding='UTF-8')

        # Create lists to store tuples for GAMES 

        games_turples = []

        # Create lists to store tuples for trailers and screenshots
        trailers_tuples = []

        unique_publishers = []
        
        # Create lists to store media reviews and media

        reviews_tuples = []
        media_reviews_tuples = []

        game_publishers_data = []  # List to store tuples for game_publishers table
        game_developers_data = []  # List to store tuples for game_developers table
        game_tags_data = []  # List to store tuples for game_tags table
        game_genres_data = []  # List to store tuples for game_genres table
        game_categories_data = []  # List to store tuples for game_categories table
        game_trailers_data = []  # List to store tuples for game_trailers table
        game_screenshots_data = []  # List to store tuples for game_screenshots table
        game_audio_data = []  # List to store tuples for game_audio_data table
        game_subtitles_data = []  # List to store tuples for game_subtitles_data table
        game_reviews_of_media_turples = []  # List to store tuples for game_reviews_of_media table

        # Sets to store unique data for database insertion
        unique_titles = set()  # Set to store unique game titles
        unique_publishers = set()
        unique_developers = set()
        tags_data = set()
        genres_data = set()
        categories_data = set()
        unique_languages = set()
        unique_reviews = set()
        screenshot_data = set()

        trailers_tuples= set()

        media_reviews_data = set ()

        unique_reviews = set()

        # Define the batch size
        batch_size = 1000  # You can adjust this based on your needs

        # Create an empty list to hold data for each batch
        batch_data = []

        # Maximum lengths for URL and email fields
        MAX_URL_LENGTH = 200
        MAX_MAIL_LENGHT = 100


        for index, row in data.iterrows():


            #***************************** GAMES VALUES **********************************
            # Fetch existing game titles from the 'games' table
            name = row['Name']

            # Check if the game already exists in the 'games' table
            if name in unique_titles:
                continue  # Skip this row if the game title already exists

            # Add the title to the unique_titles set
            unique_titles.add(name)

            # Process other data and collect it for insertion into the database
            release_date = pd.to_datetime(row['Release date']).date()
            if pd.isna(release_date):
                release_date = None
                try:
                    release_date = pd.to_datetime(row['Release date']).date()
                except pd.errors.OutOfBoundsDatetime as err:
                        print(f"Error converting 'Release date' to datetime for game '{name}':", err)
                        release_date = None

            price = float(row['Price'])
            total_DLC_packs = int(row['DLC count'])
            age_rating = int(row['Required age'])

            # Handling the attributes with missing rows
            sinopsis = row['About the game']
            if pd.isna(sinopsis):
                sinopsis = None

            # Handle missing support_web and support_email values (replace with None/NULL)
            support_web = row['Support url']

            if pd.isna(support_web):
                support_web = None

            elif support_web is not None and len(support_web) > MAX_URL_LENGTH:  # Truncate the URL if it's too long

                support_web = support_web[:MAX_URL_LENGTH]

            support_email = row['Support email']
            if pd.isna(support_email):
                support_email = None
            elif support_email is not None and len(support_email) > MAX_MAIL_LENGHT:  # Truncate the URL if it's too long
                support_email = support_email[:MAX_MAIL_LENGHT]

            # Extract header image and website data
            header_image = row['Header image']
            if pd.isna(header_image):
                header_image = None

            website = row['Website']
            if pd.isna(website):
                website = None

            # Append the data as a tuple to the games_turples list
            games_turples.append(
                (name, release_date, price, total_DLC_packs, age_rating, sinopsis, support_web, support_email,website,header_image)
            )

    
            #***************************** TAGS AND GAME_TAGS VALUES  **********************************

            tags = row['Tags']
            if pd.isna(tags):
                tags = None

            if pd.notna(tags):
                tags_list = tags.split(',')
                tags_data.update(tags_list)

                for tag in tags_list:
                    game_tags_data.append((name, tag))  # Add to game_tags data list

            
            # **********************************  LANGUAGES AND GAME_SUBTITLES VALUES **********************************
            supported_languages = row['Supported languages']
            if pd.notna(supported_languages):
                supported_languages_list = supported_languages.replace('&amp;lt;', '').replace('&amp;gt;', '').replace('/', '').replace('strong', '').replace('br', '').split(',')
                decoded_languages = [lang.strip() for lang in supported_languages_list]
                unique_languages.update(decoded_languages)

                for language in supported_languages_list:
                    game_subtitles_data.append((name, language)) 

            # **********************************  LANGUAGES AND GAME_AUDIO VALUES **********************************

            full_audio_languages = row['Full audio languages']
            if pd.notna(full_audio_languages):
                full_audio_languages_list = full_audio_languages.split(',')  # Split by comma
                decoded_audio_languages = [audio_lang.replace('&amp;lt;', '').replace('&amp;gt;', '').replace('/', '').replace('strong', '').replace('br', '').strip() for audio_lang in full_audio_languages_list]
                unique_languages.update(decoded_audio_languages)

                for audio in decoded_audio_languages:
                    game_audio_data.append((name, audio))

            # Convert the unique_languages set to a list
            languages_list = list(unique_languages)
            
            #***************************** publishers VALUES **********************************
            publishers = row['Publishers']
            if pd.isna(publishers):
                publishers = None
            if pd.notna(publishers):
                publisher_list = publishers.replace(' in collaboration with', '').replace('and', '').replace(', S.L.', 'S.L').replace(', Inc.', 'Inc.').replace(', INC.', 'INC.').replace(', Inc', 'Inc').replace(', LLC', 'LLC').replace(', Ltd.', 'Ltd').replace(',Ltd.', 'Ltd').replace(', LTD.', 'LTD').replace(', LTD', 'LTD').replace(' (Mac, Linux)', '(Mac & Linux)').replace('(Mac, Linux, & Windows Update)', '(Mac & Linux & Windows)').split(',')
                decoded_publishers = [deco_publishers.strip() for deco_publishers in publisher_list]
                if decoded_publishers == "" or decoded_publishers == " " or decoded_publishers is None or decoded_publishers == '':
                    decoded_publishers = None
                else:
                    unique_publishers.update(decoded_publishers)

                for publisher in decoded_publishers:
                    game_publishers_data.append((name, publisher))

            #***************************** Developers VALUES **********************************
            developers = row['Developers']
            if pd.isna(developers):
                developers = None

            if pd.notna(developers):
                developers_list = developers.replace(' in collaboration with', '').replace('and', '').replace(', S.L.', 'S.L').replace(', Inc.', 'Inc.').replace(', INC.', 'INC.').replace(', Inc', 'Inc').replace(', LLC', 'LLC').replace(', Ltd.', 'Ltd').replace(',Ltd.', 'Ltd').replace(', LTD.', 'LTD').replace(', LTD', 'LTD').replace(' (Mac, Linux)', '(Mac & Linux)').replace('(Mac, Linux, & Windows Update)', '(Mac & Linux & Windows)').split(',')
                decoded_developers = [deco_developers.strip() for deco_developers in developers_list]
                if decoded_developers == "" or decoded_developers == " " or decoded_publishers is None or decoded_publishers == '':
                    decoded_developers = None
                else:
                    unique_developers.update(decoded_developers)

                for developer in decoded_developers:
                    game_developers_data.append((name, developer))


            # ********************************** GENRE AND GAME_GENRES VALUES **********************************
            genres = row['Genres']
            if pd.isna(genres):
                genres = None
            if pd.notna(genres):

                genres_list = genres.split(',')
                genres_data.update(genres_list)

                for genre in genres_list:
                    game_genres_data.append((name, genre))  # Add to game_genres data list

            # ********************************** CATEGORIES GAME_CATEGORIES VALUES **********************************
            categories = row['Categories']
            if pd.isna(categories):
                categories = None

            if pd.notna(categories):
                categories_list = categories.split(',')
                categories_data.update(categories_list)

                for category in categories_list:
                    game_categories_data.append((name, category))  # Add to game_categories data list


            # ********************************** SCREENSHOTS AND GAME_SCREENSHOTS VALUES **********************************

            # Extract screenshots URLs and trailers URLs and split them by comma
            screenshots = row['Screenshots']
            if pd.isna(screenshots):
                screenshots = None
            if pd.notna(screenshots):
                screenshots_list = screenshots.split(',')
                screenshot_data.update(screenshots_list)
                for screenshot in screenshots_list:
                    game_screenshots_data.append((name, screenshot))  # Add to game_screenshots data list
            
            # ********************************** trailers AND GAME_trailers VALUES **********************************
            trailers = row['Movies']
            if pd.isna(trailers):
                trailers = None

            if pd.notna(trailers):
                trailers_list = trailers.split(',')
                trailers_tuples.update(trailers_list)

                for trailer in trailers_list:
                    game_trailers_data.append((name, trailer))  # Add to game_trailers data list
        # ********************************** INSERTING VALUES THOUGHT TURPLES AND SQL_QUERYS*******************

        # Check if games_turples is not empty before inserting into games table
        if games_turples :

            # ********************************** INSERTING GAMES TABLE *******************
            sql_query = "INSERT INTO games (title, realise_date, price, total_DLC_packs, age_rating, sinopsis, support_web, support_email ,game_website, cover_img ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s,%s)  ON DUPLICATE KEY UPDATE title = VALUES (title),realise_date=VALUES(realise_date), price=VALUES(price), total_DLC_packs=VALUES(total_DLC_packs), age_rating=VALUES(age_rating), sinopsis=VALUES(sinopsis), support_web=VALUES(support_web), support_email=VALUES(support_email),game_website=VALUES(game_website), cover_img=VALUES(cover_img) "
            print("Adding data to the Games Table")
            try:
                cursor.executemany(sql_query, games_turples)
                connection.commit()


                # Loop through the rows again to process tags data
                for index, row in data.iterrows():
                    #*********************************************************** INSERTING SYSTEM SUPPORT TABLE *****************************************************************
                    # Inserting system_support data to the system_support table
                    windows = bool(row['Windows'])
                    mac = bool(row['Mac'])
                    linux = bool(row['Linux'])
                    sql_query = "INSERT INTO system_support (games_id, Windows, Mac, Linux) VALUES ((SELECT CAST(games_id AS SIGNED) FROM games WHERE title = %s), %s, %s, %s) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), Windows=VALUES(Windows), Mac=VALUES(Mac), Linux=VALUES(Linux)"
                    system_values = (row['Name'],windows, mac, linux)
                    cursor.execute(sql_query, system_values)

                    # ************************************************************************ INSERTING USER DATA TABLE ********************************************************************
                    # Split the "Estimated owners" range into min and max values
                    min_estimated_owners, max_estimated_owners = map(int, row['Estimated owners'].split('-'))

                    # Extract other data as before
                    average_playtime = int(row['Average playtime forever'])
                    median_playtime = int(row['Median playtime forever'])
                    current_users = int(row['Peak CCU'])

                    sql_query = "INSERT INTO users_data (games_id, min_estimated_owners, max_estimated_owners, Average_playtime, Median_playtime, current_users) VALUES ((SELECT games_id FROM games WHERE title = %s), %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE min_estimated_owners=VALUES(min_estimated_owners), max_estimated_owners=VALUES(max_estimated_owners), Average_playtime=VALUES(Average_playtime), Median_playtime=VALUES(Median_playtime), current_users=VALUES(current_users)"
                    users_values = (row['Name'], current_users, min_estimated_owners,max_estimated_owners,average_playtime,median_playtime)
                    cursor.execute(sql_query, users_values)



                    #*********************************************************** INSERTING REVIEWS TABLE *****************************************************************

                    metacritic_score = int(row['Metacritic score'])
                    if metacritic_score == 0 :
                        metacritic_score = None
                    metacritic_url = row['Metacritic url']
                    if pd.isna(metacritic_url):
                        metacritic_url = None
                    positive_reviews = int(row['Positive'])
                    negative_reviews = int(row['Negative'])
                    recommendations = int(row['Recommendations'])
                    notes = row['Notes']
                    # Handle NaN values in the 'notes' column
                    if pd.isna(notes):
                        notes = None
    
                    sql_query = "INSERT INTO reviews (games_id, Metacritic_score, Metacritic_url, positive_reviews, negative_reviews, recommendations, notes) VALUES ((SELECT games_id FROM games WHERE title = %s), %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE Metacritic_score=VALUES(Metacritic_score), Metacritic_url=VALUES(Metacritic_url), positive_reviews=VALUES(positive_reviews), negative_reviews=VALUES(negative_reviews), recommendations=VALUES(recommendations), notes=VALUES(notes)"
                    reviews_values = (row['Name'], metacritic_score, metacritic_url,positive_reviews,negative_reviews,recommendations,notes)
                    cursor.execute(sql_query, reviews_values)


                    # Loop through the rows again to process publishers data
                    

                
                # ********************************** INSERTING tags table AND CHECKING ERROS ******************************************


                if tags_data:
                    # Use an INSERT query to add tags data to the tags table
                    sql_query = "INSERT INTO tags (tags_names) VALUES (%s) ON DUPLICATE KEY UPDATE tags_names=VALUES(tags_names)"
                    try:
                        cursor.executemany(sql_query, [(tag,) for tag in tags_data])
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into tags table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                for developers in unique_developers:
                    # Use an INSERT query to add developers data to the developers table
                    sql_query = "INSERT INTO developers (developers_names) VALUES (%s) ON DUPLICATE KEY UPDATE developers_names=VALUES(developers_names)"
                    try:
                        cursor.execute(sql_query, (developers,))
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into developers table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

    
                # ********************************** INSERTING genres table  AND CHECKING ERROS ******************************************
                if genres_data:
                    # Use an INSERT query to add genres data to the genres table
                    sql_query = "INSERT INTO genres (genres_names) VALUES (%s) ON DUPLICATE KEY UPDATE genres_names=VALUES(genres_names)"
                    try:
                        cursor.executemany(sql_query, [(genre,) for genre in genres_data])
                        connection.commit()

                    except pymysql.Error as err:
                        print("Error inserting data into genres table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING categories table  AND CHECKING ERROS ******************************************
                if categories_data:
                    # Use an INSERT query to add categories data to the categories table
                    sql_query = "INSERT INTO categories (categories_names) VALUES (%s) ON DUPLICATE KEY UPDATE categories_names=VALUES(categories_names)"
                    try:
                        cursor.executemany(sql_query, [(category,) for category in categories_data])
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into categories table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()


                # ********************************** INSERTING game_developers_data table  AND CHECKING ERROS ******************************************

                if game_developers_data:
                    sql_query = "INSERT INTO game_developers (games_id, developers_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT developers_id FROM developers WHERE developers_names = %s LIMIT 1)) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), developers_id=VALUES(developers_id)"
                    try:
                        cursor.executemany(sql_query, game_developers_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_developers table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING game_tags table  AND CHECKING ERROS ******************************************
                if game_tags_data:
                    sql_query = "INSERT INTO game_tags (games_id, tags_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT tags_id FROM tags WHERE tags_names = %s)) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), tags_id=VALUES(tags_id)"
                    try:
                        cursor.executemany(sql_query, game_tags_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_tags table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING game_genres table  AND CHECKING ERROS ******************************************
                if game_genres_data:
                    
                    sql_query = "INSERT INTO game_genres (games_id, genres_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT genres_id FROM genres WHERE genres_names = %s)) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), genres_id=VALUES(genres_id)"

                    try:
                        cursor.executemany(sql_query, game_genres_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_genres table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING game_categories table  AND CHECKING ERROS ******************************************
                if game_categories_data:
                    # TODO::look here
                    sql_query = "INSERT INTO game_categories (games_id,categories_id ) VALUES ((SELECT games_id FROM games WHERE title = %s),(SELECT categories_id FROM categories WHERE categories_names = %s)) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), categories_id=VALUES(categories_id)"
                    try:
                        cursor.executemany(sql_query, game_categories_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_categories table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING screenshots table  AND CHECKING ERROS ******************************************

                # Check if screenshots_tuples is not empty before inserting into screenshots table
                if screenshot_data:
                    sql_query = "INSERT INTO screenshots (screenshots_URL) VALUES (%s) ON DUPLICATE KEY UPDATE screenshots_URL=VALUES(screenshots_URL)"
                    try:
                        cursor.executemany(sql_query, [(screenshot,) for screenshot in screenshot_data])
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into screenshots table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()
                # ********************************** PUBLISHER SQL QUERIES **********************
                # Loop through the rows again to process publishers data
                if unique_publishers:
                    # Use an INSERT query to add publisher data to the publishers table
                    sql_query = "INSERT INTO publishers (publishers_names) VALUES (%s) ON DUPLICATE KEY UPDATE publishers_names=VALUES(publishers_names)"
                    try:
                        # Convert unique_publishers to a list of tuples
                        publisher_values = [(publisher,) for publisher in unique_publishers]
                        cursor.executemany(sql_query, publisher_values)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into publishers table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()
                    if game_publishers_data:
                        sql_query = "INSERT INTO game_publishers (games_id, publishers_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT publishers_id FROM publishers WHERE publishers_names = %s LIMIT 1)) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), publishers_id=VALUES(publishers_id)"
                        try:
                            cursor.executemany(sql_query, game_publishers_data)
                            connection.commit()
                        except pymysql.Error as err:
                            print("Error inserting data into game_publishers table:", err)
                            connection.rollback()
                            cursor.close()
                            exit()
                            
                # ********************************** INSERTING trailers table  AND CHECKING ERROS ******************************************

                # Check if trailers_tuples is not empty before inserting into trailers table

                if trailers_tuples:
                    sql_query = "INSERT INTO trailers (trailers_URL) VALUES (%s) ON DUPLICATE KEY UPDATE trailers_URL=VALUES(trailers_URL)"

                    try:
                        cursor.executemany(sql_query, [(trailer,) for trailer in trailers_tuples])
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into trailers table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING game_trailers table  AND CHECKING ERROS ******************************************

                if game_trailers_data:
                    sql_query = "INSERT INTO game_trailers (games_id, trailers_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT trailers_id FROM trailers WHERE trailers_URL = %s))"
                    try:
                        cursor.executemany(sql_query, game_trailers_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_trailers table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()


                # ********************************** INSERTING languages table  AND CHECKING ERROS ******************************************

                if languages_list:
                    sql_query = "INSERT INTO languages (languages_names) VALUES (%s) ON DUPLICATE KEY UPDATE languages_names=VALUES(languages_names)"
                    try:
                        cursor.executemany(sql_query, [(language,) for language in languages_list])
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into languages table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING game_audios table  AND CHECKING ERROS ******************************************

                if game_audio_data:
                    sql_query = "INSERT INTO game_audios (games_id, languages_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT languages_id FROM languages WHERE languages_names = %s))"
                    try:
                        cursor.executemany(sql_query, game_audio_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_audio_data table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                # ********************************** INSERTING game_subtitles table  AND CHECKING ERROS ******************************************

                if game_subtitles_data:
                    sql_query = "INSERT INTO game_subtitles (games_id, languages_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT languages_id FROM languages WHERE languages_names = %s))"
                    try:
                        cursor.executemany(sql_query, game_subtitles_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_subtitles_data table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()


                # ********************************** INSERTING game_screenshots table  AND CHECKING ERROS ******************************************

                # Check if game_screenshots_data is not empty before inserting into game_screenshots table

                if game_screenshots_data:
                    sql_query = "INSERT INTO game_screenshots (games_id, screenshots_id) VALUES ((SELECT games_id FROM games WHERE title = %s), (SELECT screenshots_id FROM screenshots WHERE screenshots_URL = %s)) ON DUPLICATE KEY UPDATE games_id=VALUES(games_id), screenshots_id=VALUES(screenshots_id)"
                    try:
                        cursor.executemany(sql_query, game_screenshots_data)
                        connection.commit()
                    except pymysql.Error as err:
                        print("Error inserting data into game_screenshots table:", err)
                        connection.rollback()
                        cursor.close()
                        exit()

                    #************************* INSERTING MEDIA REVIEWS TABLE ***********************************
                    media_reviews = row['Reviews'].split("“") if pd.notna(row['Reviews']) else []
                    media_reviews = [review for review in media_reviews if review.strip()]  # Filter out empty reviews

                    for review in media_reviews:
                        # Check if the review is already in the set, if not, insert it into the database
                        if review not in unique_reviews:
                            sql_query = """
                                INSERT INTO reviews_of_media (review)
                                SELECT %s
                                WHERE NOT EXISTS (SELECT 1 FROM reviews_of_media WHERE review = %s)
                            """
                            values = (review, review)
                            try:
                                cursor.execute(sql_query, values)
                                unique_reviews.add(review)
                            except pymysql.IntegrityError:
                                # Duplicate review, just ignore it
                                pass


                            # Insert into game_reviews_of_media table using the review and game title
                            sql_query = """
                                INSERT INTO game_reviews_of_media (games_id, reviews_of_media_id)
                                SELECT g.games_id, rm.reviews_of_media_id
                                FROM games g
                                JOIN reviews_of_media rm ON g.title = %s AND rm.review = %s
                            """
                            values = (row['Name'], review)
                            try:
                                cursor.execute(sql_query, values)
                                unique_reviews.add(review)
                            except pymysql.IntegrityError:
                                # Duplicate review, just ignore it
                                pass 
            except pymysql.Error as err:
                    print("Error inserting data into tables:", err)
                    logging.error(f"Error connecting to MySQL: {err}")
                    connection.rollback()
                    cursor.close()
                    exit()
        cursor.close()
        print("Data import successful.")
except pymysql.Error as err:
    print("Error connecting to MySQL:", err)
    exit()
