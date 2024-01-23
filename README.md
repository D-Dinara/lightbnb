# LightBNB Project

A simple multi-page Airbnb clone that uses server-side JavaScript to display information from queries to web pages via SQL queries. LightBNB is built using Javascript, JQuery, SASS, Express, and PostgreSQL. Users can view properties, create and view listings, view their reservations, and search properties by price, location, or rating.

## Final Product

![The home page](/docs/lightbnb-homepage-user.png)
![The my listings page](/docs/lightbnb-my-listings.png)
![The my reservations page](/docs/lightbnb-my-reservations.png)
![The new listing page](/docs/lightbnb-new-listing.png)
![The search page](/docs/lightbnb-search.png)

## Functionality Developed

* Designed a relational database using database design best practices, including applying the normalization rules.
* Used SQL and PostgreSQL to create the database and tables and seed the tables.
* Established a connection to the database using pg.
* Created SQL queries to interact with the database in various situations, including user login validation, determining the average length of reservations, selecting property listings by city, determining the most visited cities, and showing a user all of their reservations if they are logged in.
* Set up front-end web boilerplate code by connecting the Express server to the lighthousebnb database.
* Implemented server-side JavaScript functions getUserWithEmail, getUserWithId, addUser, getAllReservations to use the database.
* Implemented the getAllProperties function to include filters provided through an options object passed into the function, providing dynamic property filtering capabilities to the application.
* Implemented the addProperty function to insert a new property into the properties table in the database.

## Getting Started

1. Ensure you have Node.js installed on your local machine.
2. Clone the repository onto your local device.
3. Install dependencies using the `npm install` command.
4. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
5. Go to <http://localhost:3000/> in your browser.

## Dependencies

* bcrypt - Used for encryption and hashing passwords.
* cookie-session - Manages user sessions.
* express - Web application framework.
* nodemon - Monitors for changes and automatically restarts the server.
* pg - PostgreSQL client for Node.js.