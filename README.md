# NodeJS-GameDB-WEBVisualizer
This is a Node.js and EJS web app displaying games from a MySQL database, transformed from CSV via a Python script. It features intuitive browsing and detailed game insights

## How to run it 

1)	Open MYSQL or open terminal and put the command mysql
2)	Connect a user in mysql environment and the make have all access. Copy this lines in mysql terminal:
   
    **CREATE USER 'sqluser'@'127.0.0.1';**
    
    **'sqluser'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'password';**
    
    **GRANT ALL ON *.* TO 'sqluser'@'127.0.0.1' WITH GRANT OPTION ;**
    
    **FLUSH PRIVILEGES;**

3)	Copy all the database.sql file in mysql terminal as it is

4)	Open a new terminal and install pandas and mySQL connector in python with the command

    **pip install pandas mysql-connector-python**

5)	Run the python cvs_injector.py (be patient, this script take around 30-40 minutes to be completed)

6)	Start the app with the command:

    **node index.js**

7)	Open the port localhost:8800

# Web Application Overview

This web application is developed using Node.js with EJS templating to present a visual interface for a MySQL database. The primary function of this web application is to display data that has been meticulously normalized and imported from an originally extensive CSV file into a MySQL database.

## Features and Functionalities

- **Visualization**: The web interface, as shown in the screenshot, provides a clear and intuitive display of the database contents, allowing for easy browsing and analysis of the data.
- **Data Volume**: The original CSV file comprised 4,000 rows and 39 columns, reflecting a rich dataset that has been streamlined for efficient database storage and access.
- **Normalization and Conversion**: A Python script was utilized to transform the CSV data into a format suitable for the MySQL database, ensuring data integrity and normalization.
- **Interactive Elements**: The interface includes links to detailed views for each database entry, such as synopses, reviews, media reviews, and system requirements, among others, facilitating a comprehensive understanding of each game's profile.
- **Search and Filter**: A search feature enables users to find specific entries within the database quickly by filtering the results by title.

## Database Schema

The web application's database schema is organized to reflect the multifaceted nature of the data, with tables for game information, reviews, system support, user data, and more. Each entry in the database corresponds to a unique game, with associated metadata such as title, release date, price, and user ratings.

## Design and Aesthetics

The design of the web application is intentionally simple, as the goal for the project was more focused on the structure of the data rather than the aesthetics of the web.

## Database Summary

Database link : https://www.kaggle.com/datasets/fronkongames/steam-games-dataset

The database for this project is derived from an expansive Kaggle dataset on Steam games, initially consisting of 74,690 games across 39 attributes. Prioritizing data quality, the dataset was refined to include only 4,000 games with a Metacritic score of 80 or higher. Columns predominantly filled with null or irrelevant values were omitted, reducing the dataset to a more manageable 35 attributes, thus ensuring a balance between complexity and practicality for analysis.

## Data Transformation

The transition from a CSV file to a MySQL database was accomplished through a custom Python script. This script performed the critical task of data normalization, preserving the relational structure needed for the MySQL database and ensuring that the data's integrity was maintained during the conversion process.

## Web Architecture

At the heart of our web application's architecture is the `main.js` file, which functions as the central nervous system for routing and server-side logic. This core script orchestrates the flow of data by handling HTTP requests, executing queries to the MySQL database, and processing the responses. The data fetched from MySQL is then passed dynamically to one of the 34 EJS pages, each designed to render specific portions of the data according to the page's role and user requests. Whether it's displaying detailed game information, user reviews, or system requirements, each EJS template is finely tuned to present the information in a coherent and styled manner that enhances user interaction and experience. This modular approach ensures that the server-side operations are efficient, and the user interface remains responsive and precise, catering to the diverse informational needs of each page.

## Backend Technology

- **Node.js**: The runtime environment for executing JavaScript on the server side, ensuring high performance and asynchronous processing.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications, making the handling of HTTP requests and routing more convenient.
- **EJS**: An embedded JavaScript templating engine that generates HTML markup with plain JavaScript, allowing for the creation of dynamic web pages based on data from the MySQL database.
- **MySQL2**: A fast and efficient MySQL client for Node.js, which provides compatibility with the latest MySQL features and an improved API for dealing with MySQL protocols.
- **MySQL2-promise**: A wrapper for the MySQL2 client, adding support for JavaScript promises, thus enabling better handling of asynchronous database operations.
- **Nodemon**: A utility that monitors for any changes in the source code and automatically restarts the server, improving the development process by reducing downtime and manual restarts.
- 
## Conclusion

This web application stands as a testament to the power of full-stack development, combining Node.js, EJS, MySQL, and Python to transform raw data into an interactive, user-friendly web interface that serves as a valuable resource for browsing and analyzing game data.

**FOR MORE DETAILS, INFORMATION, AND QUESTIONS ABOUT THE WEB, PLEASE SEE THE DOCUMENTATION.**
