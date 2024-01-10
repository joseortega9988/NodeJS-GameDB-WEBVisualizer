const { render } = require("ejs");


function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
}
// main.js
module.exports = function (app) {

    // ************************ GAMES TABLE AND   *********************************

    app.get('/', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
    
        const gamesQuery = `
        SELECT games.*, reviews.Metacritic_score
        FROM games
        LEFT JOIN reviews ON games.games_id = reviews.games_id
        WHERE games.title LIKE '%${searchQuery}%'
        ORDER BY ${sortBy} ${sortOrder}
    `;
        db.query(gamesQuery, (err, games) => {
            if (err) {
                console.error('Error fetching games:', err);
                return;
            }
            app.locals.formatDate = formatDate;
            res.render('index.ejs', { games, searchQuery, sortBy, sortOrder });
        });
    });

    app.get('/games/:id?', (req, res) => {
        const gameId = req.params.id;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
    
        let gamesQuery = `
            SELECT *
            FROM games
            WHERE title LIKE '%${searchQuery}%'
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        if (gameId) {
            // If gameId is provided, modify the query to fetch details for the specific game
            gamesQuery = `
            SELECT games.*, reviews.Metacritic_score
            FROM games
            LEFT JOIN reviews ON games.games_id = reviews.games_id
            WHERE games.games_id = ?
            `;
        }
    
        db.query(gamesQuery, [gameId], (err, games) => {
            if (err) {
                console.error('Error fetching games:', err);
                return;
            }
            app.locals.formatDate = formatDate;
            res.render('index.ejs', { games, gameId, searchQuery, sortBy, sortOrder });
        });
    });
    

    // ************************ sinopsis  *********************************

    app.get('/sinopsis/:id', (req, res) => {
        const gameId = req.params.id;
        const query = 'SELECT title, sinopsis, games_id FROM games WHERE games_id = ?';
    
        db.query(query, [gameId], (err, results) => {
            if (err) {
                console.error('Error fetching sinopsis:', err);
                return;
            }
    
            const game = results.length > 0 ? results[0] : null;
    
            res.render('sinopsis.ejs', { game });
        });
    });

    // ************************ support  *********************************

    app.get('/support/:id', (req, res) => {
        const gameId = req.params.id;
        const query = 'SELECT title, support_web, support_email FROM games WHERE games_id = ?';
    
        db.query(query, [gameId], (err, results) => {
            if (err) {
                console.error('Error fetching support:', err);
                return;
            }
    
            const game = results.length > 0 ? results[0] : null;
    
            res.render('support.ejs', { game, gameId });
        });
    });

    // ************************ reviews AND reviews/ID *********************************

    
    app.get('/reviews', (req, res) => {
        // Fetch reviews from the database along with game titles
        const searchQuery = req.query.search || ''; // Get the search query from the URL query parameter
        const sortBy = req.query.sortBy || 'reviews_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        // TODO::look here
        let reviewsQuery = `
            SELECT reviews.*, games.title, games.games_id 
            FROM reviews
            JOIN games ON reviews.games_id = games.games_id
            WHERE reviews.reviews_id = '${searchQuery}'
            ORDER BY ${sortBy} ${sortOrder}
        `;
//             WHERE games.title LIKE '%${searchQuery}%'

        db.query(reviewsQuery, (err, reviews) => {
            if (err) {
                console.error('Error fetching reviews:', err);
                return;
            }
            // Render the EJS template with the fetched reviews
            res.render('reviews.ejs', { reviews, searchQuery,sortBy, sortOrder });
        });
    });
    
    
    app.get('/reviews/:id', (req, res) => {
        const searchQuery = req.query.search || ''; // Get the search query from the URL query parameter
        const sortBy = req.query.sortBy || 'reviews_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const gameId = req.params.id;
        const query = `
            SELECT reviews.*, games.title
            FROM reviews
            JOIN games ON reviews.games_id = games.games_id
            WHERE reviews.games_id = ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, [gameId], (err, reviews) => {
            if (err) {
                console.error('Error fetching reviews:', err);
                return;
            }
            res.render('reviews.ejs', { reviews, searchQuery,sortBy,sortOrder});
        });
    });

    // ************************ system_support AND system_support/ID *********************************

    app.get('/system_support', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'system_support_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
                const systemSupportsQuery = `
            SELECT system_support.*, games.title, games.games_id
            FROM system_support
            JOIN games ON system_support.games_id = games.games_id
            WHERE games.title LIKE '%${searchQuery}%'
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(systemSupportsQuery, (err, systemsupport) => {
            if (err) {
                console.error('Error fetching system support details:', err);
                return;
            }
            // Render the EJS template with the fetched system support details
            res.render('system_support.ejs', { systemsupport, searchQuery ,sortBy,sortOrder});
        });
    });
    
    app.get('/system_support/:id', (req, res) => {
        const searchQuery = req.query.search || ''; // Get the search query from the URL query parameter
        const sortBy = req.query.sortBy || 'system_support_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const gameId = req.params.id;
        const query = `
            SELECT system_support.*, games.title
            FROM system_support
            JOIN games ON system_support.games_id = games.games_id
            WHERE system_support.games_id = ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, [gameId], (err, systemsupport) => {
            if (err) {
                console.error('Error fetching system support details:', err);
                return;
            }
            res.render('system_support.ejs', { systemsupport, searchQuery ,sortBy,sortOrder});
        });
    });

    // ************************ users_data AND users_data/ID *********************************

    app.get('/users_data', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'users_data_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    

        const usersDataQuery = `
            SELECT users_data.*, games.title, games.games_id
            FROM users_data
            JOIN games ON users_data.games_id = games.games_id
            WHERE games.title LIKE '%${searchQuery}%'
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(usersDataQuery, (err, usersData) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return;
            }
            // Render the EJS template with the fetched user data
            res.render('users_data.ejs', { usersData, searchQuery, sortBy, sortOrder});
        });
    });
    
    app.get('/users_data/:id', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'users_data_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const gameId = req.params.id;
        const query = `
            SELECT users_data.*, games.title
            FROM users_data
            JOIN games ON users_data.games_id = games.games_id
            WHERE users_data.games_id = ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
        
        db.query(query, [gameId], (err, usersData) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return;
            }
            res.render('users_data.ejs', { usersData, searchQuery, sortBy, sortOrder});
        });
    });

    // ************************ all_categories AND categories/ID *********************************
    
    app.get('/all_categories', (req, res) => {
        const sortBy = req.query.sortBy || 'categories_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const query = `
        SELECT * FROM categories
        ORDER BY ${sortBy} ${sortOrder}
        `;
        db.query(query, (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return;
            }
            res.render('all_categories.ejs', { categories,sortBy,sortOrder });
        });
    });
    
    app.get('/categories/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'game_categories_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const categoriesQuery = `
        SELECT categories.categories_id, categories.categories_names
        FROM game_categories
        JOIN categories ON game_categories.categories_id = categories.categories_id
        WHERE game_categories.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';
    
        db.query(categoriesQuery, [gameId], (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return;
            }
    
            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }
    
                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('categories.ejs', { categories, game, sortBy, sortOrder,gameId });
            });
        });
    });

    app.get('/games_by_categories/:categoryId', (req, res) => {
        const categoryId = req.params.categoryId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
    
        // Use placeholders for the searchValue and add % wildcard characters

        // TODO::look here
        const query = `
            SELECT games.games_id, games.title, categories.categories_names
            FROM games
            JOIN game_categories ON games.games_id = game_categories.games_id
            JOIN categories ON game_categories.categories_id = categories.categories_id
            WHERE game_categories.categories_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
    
        db.query(query, [categoryId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by category:', err);
                return;
            }
    
            const categoryName = gamesData.length > 0 ? gamesData[0].categories_names : 'Unknown Category';
    
            // Render the EJS template with the list of games in the specified category
            res.render('games_by_categories.ejs', { games: gamesData, categoryName, sortOrder, sortBy, searchQuery, categoryId });
        });
    });
    
    

    // ************************ all_tags AND tags/ID *********************************

    
    app.get('/all_tags', (req, res) => {
        const sortBy = req.query.sortBy || 'tags_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const query = `
        SELECT * FROM tags
        ORDER BY ${sortBy} ${sortOrder}
        `;

        db.query(query, (err, tags) => {
            if (err) {
                console.error('Error fetching tags:', err);
                return;
            }
            res.render('all_tags.ejs', { tags,sortOrder,sortBy });
        });
    });

    app.get('/tags/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'tags_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const tagsQuery = `
        SELECT tags.tags_id, tags.tags_names
        FROM game_tags
        JOIN tags ON game_tags.tags_id = tags.tags_id
        WHERE game_tags.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';
    
        db.query(tagsQuery, [gameId], (err, tags) => {
            if (err) {
                console.error('Error fetching tags:', err);
                return;
            }
            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }
    
                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('tags.ejs', { tags, game,sortBy , sortOrder, gameId});
            });
        });
    });

    app.get('/games_by_tags/:tagId', (req, res) => {
        const tagId = req.params.tagId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
        
        // Use placeholders for the searchValue and add % wildcard characters
        const query = `
            SELECT games.games_id, games.title, tags.tags_names
            FROM games
            JOIN game_tags ON games.games_id = game_tags.games_id
            JOIN tags ON game_tags.tags_id = tags.tags_id
            WHERE game_tags.tags_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
        
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
        
        db.query(query, [tagId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by tag:', err);
                return;
            }
            
            const tagName = gamesData.length > 0 ? gamesData[0].tags_names : 'Unknown Tag';
            
            // Render the EJS template with the list of games with the specified tag
            res.render('games_by_tags.ejs', { games: gamesData, tagName, sortOrder, sortBy, searchQuery, tagId });
        });
    });
    
    // ************************ all_genres AND genres/ID *********************************

    // Route to display all genres
    app.get('/all_genres', (req, res) => {
        const sortBy = req.query.sortBy || 'genres_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const query = `
        SELECT * FROM genres
        ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, (err, genres) => {
            if (err) {
                console.error('Error fetching genres:', err);
                return;
            }
            res.render('all_genres.ejs', { genres,sortBy,sortOrder });
        });
    });

    // Route to display genres for a specific game
    app.get('/genres/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'game_genres_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const genresQuery = `
        SELECT genres.genres_id, genres.genres_names
        FROM game_genres
        JOIN genres ON game_genres.genres_id = genres.genres_id
        WHERE game_genres.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';

        db.query(genresQuery, [gameId], (err, genres) => {
            if (err) {
                console.error('Error fetching genres:', err);
                return;
            }

            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }

                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('genres.ejs', { genres, game,sortBy, sortOrder, gameId});
            });
        });
    });

    app.get('/games_by_genre/:genreId', (req, res) => {
        const genreId = req.params.genreId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'game_genres_id';
        const sortOrder = req.query.sortOrder || 'asc';
        
        // Use placeholders for the searchValue and add % wildcard characters
        const query = `
            SELECT games.title, genres.genres_names, games.games_id
            FROM games
            JOIN game_genres ON games.games_id = game_genres.games_id
            JOIN genres ON game_genres.genres_id = genres.genres_id
            WHERE game_genres.genres_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
    
        db.query(query, [genreId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by genre:', err);
                return;
            }
            
            const genreName = gamesData.length > 0 ? gamesData[0].genres_names : 'Unknown Genre';
    
            // Render the EJS template with the list of game titles for the selected genre
            res.render('games_by_genre.ejs', { games: gamesData, genreName, sortOrder, sortBy, searchQuery, genreId });
        });
    });
    
      

    // ************************ all_publishers AND publishers/ID *********************************


    // Route to display all publishers
    app.get('/all_publishers', (req, res) => {
        const sortBy = req.query.sortBy || 'publishers_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const query = `
        SELECT * FROM publishers
        ORDER BY ${sortBy} ${sortOrder}
        `;
        

        db.query(query, (err, publishers) => {
            if (err) {
                console.error('Error fetching publishers:', err);
                return;
            }
            res.render('all_publishers.ejs', { publishers,sortBy,sortOrder });
        });
    });

    // Route to display publishers for a specific game
    app.get('/publishers/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'game_publishers_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const publishersQuery = `
        SELECT publishers.publishers_id, publishers.publishers_names
        FROM game_publishers
        JOIN publishers ON game_publishers.publishers_id = publishers.publishers_id
        WHERE game_publishers.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';

        db.query(publishersQuery, [gameId], (err, publishers) => {
            if (err) {
                console.error('Error fetching publishers:', err);
                return;
            }

            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }

                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('publishers.ejs', { publishers, game,sortBy,sortOrder, gameId });
            });
        });
    });

    app.get('/games_by_publishers/:publisherId', (req, res) => {
        const publisherId = req.params.publisherId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
        
        // Use placeholders for the searchValue and add % wildcard characters
        const query = `
            SELECT games.games_id, games.title, publishers.publishers_names
            FROM games
            JOIN game_publishers ON games.games_id = game_publishers.games_id
            JOIN publishers ON game_publishers.publishers_id = publishers.publishers_id
            WHERE game_publishers.publishers_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
        
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
        
        db.query(query, [publisherId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by publisher:', err);
                return;
            }
            
            const publisherName = gamesData.length > 0 ? gamesData[0].publishers_names : 'Unknown Publisher';
            
            // Render the EJS template with the list of games with the specified publisher
            res.render('games_by_publishers.ejs', { games: gamesData, publisherName, sortOrder, sortBy, searchQuery, publisherId });
        });
    });    

        // ************************ all_audios AND audios/ID ******************

    // Route to display all developers
    app.get('/all_developers', (req, res) => {
        const sortBy = req.query.sortBy || 'developers_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        const query = `
        SELECT * FROM developers
        ORDER BY ${sortBy} ${sortOrder}
        `;


        db.query(query, (err, developers) => {
            if (err) {
                console.error('Error fetching developers:', err);
                return;
            }
            res.render('all_developers.ejs', { developers,sortOrder,sortBy });
        });
    });

    // Route to display developers for a specific game
    app.get('/developers/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'game_developers_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const developersQuery = `
        SELECT developers.developers_id, developers.developers_names
        FROM game_developers
        JOIN developers ON game_developers.developers_id = developers.developers_id
        WHERE game_developers.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';

        db.query(developersQuery, [gameId], (err, developers) => {
            if (err) {
                console.error('Error fetching developers:', err);
                return;
            }

            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }

                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('developers.ejs', { developers, game,sortBy, sortOrder, gameId});
            });
        });
    });

    app.get('/games_by_developers/:developerId', (req, res) => {
        const developerId = req.params.developerId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
        
        // Use placeholders for the searchValue and add % wildcard characters
        const query = `
            SELECT games.games_id, games.title, developers.developers_names
            FROM games
            JOIN game_developers ON games.games_id = game_developers.games_id
            JOIN developers ON game_developers.developers_id = developers.developers_id
            WHERE game_developers.developers_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
        
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
        
        db.query(query, [developerId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by developer:', err);
                return;
            }
            
            const developerName = gamesData.length > 0 ? gamesData[0].developers_names : 'Unknown Developer';
            
            // Render the EJS template with the list of games with the specified developer
            res.render('games_by_developers.ejs', { games: gamesData, developerName, sortOrder, sortBy, searchQuery, developerId });
        });
    });
    

        // ************************ all_audios AND audios/ID ******************

    app.get('/all_audios', (req, res) => {
        const sortBy = req.query.sortBy || 'languages_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const query = `
        SELECT * FROM languages
        ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, (err, languages) => {
            if (err) {
                console.error('Error fetching audio:', err);
                return;
            }
            res.render('all_audios.ejs', { languages,sortOrder,sortBy});
        });
    });
    
    app.get('/audios/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'languages_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const audioQuery = `
        SELECT languages.languages_id, languages.languages_names
        FROM game_audios
        JOIN languages ON game_audios.languages_id = languages.languages_id
        WHERE game_audios.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';
    
        db.query(audioQuery, [gameId], (err, languages) => {
            if (err) {
                console.error('Error fetching audio:', err);
                return;
            }
    
            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }
    
                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('audios.ejs', { languages, game,sortBy, sortOrder,gameId});
            });
        });
    });

    app.get('/games_by_audios/:languageId', (req, res) => {
        const languageId = req.params.languageId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
        
        // Use placeholders for the searchValue and add % wildcard characters
        const query = `
            SELECT games.games_id, games.title, languages.languages_names
            FROM games
            JOIN game_audios ON games.games_id = game_audios.games_id
            JOIN languages ON game_audios.languages_id = languages.languages_id
            WHERE game_audios.languages_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
        
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
        
        db.query(query, [languageId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by audio language:', err);
                return;
            }
            
            const languageName = gamesData.length > 0 ? gamesData[0].languages_names : 'Unknown Language';
            
            // Render the EJS template with the list of games with the specified audio language
            res.render('games_by_audios.ejs', { games: gamesData, languageName, sortOrder, sortBy, searchQuery, languageId });
        });
    });
    
    // ************************ all_subtitles AND subtitles/ID ******************

    app.get('/all_subtitles', (req, res) => {
        const sortBy = req.query.sortBy || 'languages_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const query = `SELECT * FROM languages
        ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, (err, languages) => {
            if (err) {
                console.error('Error fetching subtitles:', err);
                return;
            }
            res.render('all_subtitles.ejs', { languages,sortBy,sortOrder });
        });
    });
    
    app.get('/subtitles/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'languages_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const subtitlesQuery = `
        SELECT languages.languages_id, languages.languages_names
        FROM game_subtitles
        JOIN languages ON game_subtitles.languages_id = languages.languages_id
        WHERE game_subtitles.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';
    
        db.query(subtitlesQuery, [gameId], (err, languages) => {
            if (err) {
                console.error('Error fetching subtitles:', err);
                return;
            }
    
            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }
    
                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('subtitles.ejs', { languages, game,sortBy,sortOrder, gameId});
            });
        });
    });

    app.get('/games_by_subtitles/:languageId', (req, res) => {
        const languageId = req.params.languageId;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'games_id';
        const sortOrder = req.query.sortOrder || 'asc';
        
        // Use placeholders for the searchValue and add % wildcard characters
        const query = `
            SELECT games.games_id, games.title, languages.languages_names
            FROM games
            JOIN game_subtitles ON games.games_id = game_subtitles.games_id
            JOIN languages ON game_subtitles.languages_id = languages.languages_id
            WHERE game_subtitles.languages_id = ? 
            AND games.title LIKE ?
            ORDER BY ${sortBy} ${sortOrder}
        `;
        
        // Add % wildcard characters around the searchQuery
        const searchValue = `%${searchQuery}%`;
        
        db.query(query, [languageId, searchValue], (err, gamesData) => {
            if (err) {
                console.error('Error fetching games by subtitle language:', err);
                return;
            }
            
            const languageName = gamesData.length > 0 ? gamesData[0].languages_names : 'Unknown Language';
            
            // Render the EJS template with the list of games with the specified subtitle language
            res.render('games_by_subtitles.ejs', { games: gamesData, languageName, sortOrder, sortBy, searchQuery, languageId });
        });
    });
    

    // ************************ all_reviews_of_media AND reviews_of_media/ID ******************
    app.get('/all_reviews_of_media', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'reviews_of_media_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const query = `
            SELECT reviews_of_media.*, games.title,  games.games_id
            FROM reviews_of_media
            JOIN game_reviews_of_media ON reviews_of_media.reviews_of_media_id = game_reviews_of_media.reviews_of_media_id
            JOIN games ON game_reviews_of_media.games_id = games.games_id
            WHERE games.title LIKE '%${searchQuery}%'
            ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, (err, mediaReviewData) => {
            if (err) {
                console.error('Error fetching media reviews:', err);
                return;
            }
    
            // Render the EJS template with the fetched media reviews and associated game titles
            res.render('all_reviews_of_media.ejs', { mediaReviews: mediaReviewData, searchQuery,sortBy,sortOrder });
        });
    });
    app.get('/reviews_of_media/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'game_reviews_of_media_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
    
        const reviewsOfMediaQuery = `
        SELECT reviews_of_media.reviews_of_media_id, reviews_of_media.review
        FROM game_reviews_of_media
        JOIN reviews_of_media ON game_reviews_of_media.reviews_of_media_id = reviews_of_media.reviews_of_media_id
        WHERE game_reviews_of_media.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        
        
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';
    
        db.query(reviewsOfMediaQuery, [gameId], (err, reviewsOfMedia) => {
            if (err) {
                console.error('Error fetching reviews of media:', err);
                return;
            }
    
            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }
    
                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('reviews_of_media.ejs', { reviewsOfMedia, game, sortBy, sortOrder,gameId });
            });
        });
    });

        // ************************ all_trailers AND trailers/ID ******************
    
    // Route to display all trailers
    app.get('/all_trailers', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'trailers_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    


        // TODO::look here
        const query = `
        SELECT trailers.*, games.title , games.games_id 
        FROM trailers
        JOIN game_trailers ON trailers.trailers_id = game_trailers.trailers_id
        JOIN games ON game_trailers.games_id = games.games_id
        WHERE games.title LIKE '%${searchQuery}%'
        ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, (err, trailerData) => {
            if (err) {
                console.error('Error fetching trailers:', err);
                return;
            }
    
            // Pass the trailer data and associated game titles to the EJS template
            res.render('all_trailers.ejs', { trailers: trailerData, searchQuery,sortBy, sortOrder});
        });
    });
    


    // Route to display trailers for a specific game
    app.get('/trailers/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'game_trailers_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        
        const trailersQuery = `
        SELECT trailers.trailers_id, trailers.trailers_URL
        FROM game_trailers
        JOIN trailers ON game_trailers.trailers_id = trailers.trailers_id
        WHERE game_trailers.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';

        db.query(trailersQuery, [gameId], (err, trailers) => {
            if (err) {
                console.error('Error fetching trailers:', err);
                return;
            }

            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }

                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('trailers.ejs', { trailers, game,sortBy,sortOrder,gameId});
            });
        });
    });

    // ************************ all_screenshots AND screenshots/ID ******************


    // Route to display all screenshots
    app.get('/all_screenshots', (req, res) => {
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'screenshots_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const query = `
        SELECT screenshots.*, games.title, games.games_id 
        FROM screenshots
        JOIN game_screenshots ON screenshots.screenshots_id = game_screenshots.screenshots_id
        JOIN games ON game_screenshots.games_id = games.games_id
        WHERE games.title LIKE '%${searchQuery}%'
        ORDER BY ${sortBy} ${sortOrder}
        `;
    
        db.query(query, (err, screenshotData) => {
            if (err) {
                console.error('Error fetching screenshots:', err);
                return;
            }
    
            // Pass the screenshot data and associated game titles to the EJS template
            res.render('all_screenshots.ejs', { screenshots: screenshotData, searchQuery,sortBy,sortOrder});
        });
    });
    
    

    // Route to display screenshots for a specific game
    app.get('/screenshots/:id', (req, res) => {
        const gameId = req.params.id;
        const sortBy = req.query.sortBy || 'screenshots_id'; // Get the sorting column from the URL query parameter
        const sortOrder = req.query.sortOrder || 'asc'; // Get the sorting order from the URL query parameter    
        
        const screenshotsQuery = `
        SELECT screenshots.screenshots_id, screenshots.screenshots_URL
        FROM game_screenshots
        JOIN screenshots ON game_screenshots.screenshots_id = screenshots.screenshots_id
        WHERE game_screenshots.games_id = ?
        ORDER BY ${sortBy} ${sortOrder}
        `;
        const gameTitleQuery = 'SELECT title FROM games WHERE games_id = ?';

        db.query(screenshotsQuery, [gameId], (err, screenshots) => {
            if (err) {
                console.error('Error fetching screenshots:', err);
                return;
            }

            db.query(gameTitleQuery, [gameId], (err, gameTitle) => {
                if (err) {
                    console.error('Error fetching game title:', err);
                    return;
                }

                const game = gameTitle[0] ? gameTitle[0].title : 'Unknown Game';
                res.render('screenshots.ejs', { screenshots, game ,sortBy,sortOrder, gameId});
                //console.log(gameTitleQuery)
            });
        });
    });

};

