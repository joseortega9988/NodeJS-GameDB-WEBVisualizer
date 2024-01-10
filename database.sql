CREATE DATABASE steam_games;


CREATE TABLE trailers (
    trailers_id INT AUTO_INCREMENT NOT NULL,
    trailers_URL VARCHAR(200),
    PRIMARY KEY (trailers_id)

);

CREATE TABLE screenshots (
    screenshots_id INT AUTO_INCREMENT NOT NULL,
    screenshots_URL VARCHAR(200),
    PRIMARY KEY (screenshots_id)
);


CREATE TABLE tags (
    tags_id INT AUTO_INCREMENT NOT NULL,
    tags_names VARCHAR(50),
    PRIMARY KEY (tags_id)
);

CREATE TABLE categories (
    categories_id INT AUTO_INCREMENT NOT NULL,
    categories_names VARCHAR(50),
    PRIMARY KEY (categories_id)
);

CREATE TABLE genres (
    genres_id INT AUTO_INCREMENT NOT NULL,
    genres_names VARCHAR(50),
    PRIMARY KEY (genres_id)
);


CREATE TABLE publishers (
    publishers_id INT AUTO_INCREMENT NOT NULL,
    publishers_names VARCHAR(100),
    PRIMARY KEY (publishers_id)
);

CREATE TABLE developers (
    developers_id INT AUTO_INCREMENT NOT NULL,
    developers_names VARCHAR(100),
    PRIMARY KEY (developers_id)
);

CREATE TABLE languages (
    languages_id INT AUTO_INCREMENT NOT NULL,
    languages_names VARCHAR(100),
    PRIMARY KEY (languages_id)
);

CREATE TABLE reviews_of_media (
    reviews_of_media_id INT AUTO_INCREMENT NOT NULL,
    review TEXT,
    PRIMARY KEY (reviews_of_media_id)
);


CREATE TABLE games (
    games_id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(100),
    realise_date DATE,
    price DECIMAL(6, 2),
    total_DLC_packs INT,
    age_rating INT,
    sinopsis TEXT,
    support_web VARCHAR(200),
    support_email VARCHAR(100),
    PRIMARY KEY (games_id)
);

CREATE TABLE game_tags (
    game_tags_id INT AUTO_INCREMENT NOT NULL,
    tags_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (tags_id) REFERENCES tags(tags_id),
    PRIMARY KEY (game_tags_id)
);

CREATE TABLE game_categories (
    game_categories_id INT AUTO_INCREMENT NOT NULL,
    categories_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (categories_id) REFERENCES categories(categories_id),
    PRIMARY KEY (game_categories_id)
);


CREATE TABLE game_genres (
    game_genres_id INT AUTO_INCREMENT NOT NULL,
    genres_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (genres_id) REFERENCES genres(genres_id),
    PRIMARY KEY (game_genres_id)
);

CREATE TABLE game_publishers (
    game_publishers_id INT AUTO_INCREMENT NOT NULL,
    publishers_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (publishers_id) REFERENCES publishers(publishers_id),
    PRIMARY KEY (game_publishers_id)
);

CREATE TABLE game_developers (
    game_developers_id INT AUTO_INCREMENT NOT NULL,
    developers_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (developers_id) REFERENCES developers(developers_id),
    PRIMARY KEY (game_developers_id)

);

CREATE TABLE system_support (
    system_support_id INT AUTO_INCREMENT NOT NULL,
    games_id INT UNIQUE,
    Windows BOOLEAN,
    Mac BOOLEAN,
    Linux BOOLEAN,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    PRIMARY KEY (system_support_id)
);

CREATE TABLE game_trailers (
    game_trailers_id INT AUTO_INCREMENT NOT NULL,
    trailers_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (trailers_id) REFERENCES trailers(trailers_id),
    PRIMARY KEY (game_trailers_id)
);

CREATE TABLE game_screenshots (
    game_screenshots_id INT AUTO_INCREMENT NOT NULL,
    screenshots_id INT UNIQUE,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (screenshots_id) REFERENCES screenshots(screenshots_id),
    PRIMARY KEY (game_screenshots_id)
);

CREATE TABLE game_audios  (
    game_audios_id INT AUTO_INCREMENT NOT NULL,
    languages_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (languages_id) REFERENCES languages(languages_id),
    PRIMARY KEY (game_audios_id)
);

CREATE TABLE game_subtitles (
    game_subtitles_id INT AUTO_INCREMENT NOT NULL,
    languages_id INT,
    games_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (languages_id) REFERENCES languages(languages_id),
    PRIMARY KEY (game_subtitles_id)
);

CREATE TABLE game_reviews_of_media (
    game_reviews_of_media_id INT AUTO_INCREMENT NOT NULL,
    games_id INT,
    reviews_of_media_id INT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    FOREIGN KEY (reviews_of_media_id) REFERENCES reviews_of_media(reviews_of_media_id),
    PRIMARY KEY (game_reviews_of_media_id)
);

CREATE TABLE reviews (
    reviews_id INT AUTO_INCREMENT NOT NULL,
    games_id INT UNIQUE,
    Metacritic_score INT,
    Metacritic_url VARCHAR(200),
    positive_reviews INT,
    negative_reviews INT,
    recommendations INT,
    notes TEXT,
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    PRIMARY KEY (reviews_id)
);

CREATE TABLE users_data (
    users_data_id  INT AUTO_INCREMENT NOT NULL,
    games_id INT UNIQUE,
    current_users INT,
    min_estimated_owners INT,
    max_estimated_owners INT,
    Average_playtime INT,
    Median_playtime INT,

    FOREIGN KEY (games_id) REFERENCES games(games_id),
    PRIMARY KEY (users_data_id)
);

CREATE TABLE media (
    media_id INT AUTO_INCREMENT,
    games_id INT UNIQUE,
    cover_img VARCHAR(200),
    game_website VARCHAR(200),
    FOREIGN KEY (games_id) REFERENCES games(games_id),
    PRIMARY KEY (media_id)
);



