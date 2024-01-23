const db = require('./index');

// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return db
    .query(`
    SELECT users.*
    FROM users 
    WHERE email = $1
    `, [email.toLowerCase()])
    .then(res =>  {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return db
    .query(`
    SELECT users.*
    FROM users 
    WHERE id = $1
    `, [id])
    .then(res =>  {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return db
    .query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) 
    RETURNING *;
    `, [user.name, user.email, user.password])
    .then(res =>  {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return db
    .query(`SELECT reservations.id, properties.*, reservations.start_date, reservations.end_date, AVG(rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`, [guest_id, limit])
    .then(res =>  {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  //Setup an array to hold any parameters that may be available for the query
  const queryParams = [];
  
  //Start the query with all information that comes before the WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  //Check if a city has been passed in as an option
  if (options.city) {
    //Add the city to the params array and create a WHERE clause for the city
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city ILIKE $${queryParams.length} `;
  }
  //Check if an owner_id has been passed in as an option
  if (options.owner_id) {
    //Check if the params array is empty. If empty start with WHERE, if not - add AND to the query
    queryParams.length === 0 ?  queryString += `WHERE ` : queryString += `AND `;
    // Add the owner_id to the params array
    queryParams.push(options.owner_id);
    queryString += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    //Check if the params array is empty. If empty start with WHERE, if not - add AND to the query
    queryParams.length === 0 ?  queryString += `WHERE ` : queryString += `AND `;
    // Add the minimum_price_per_night to the params array
    queryParams.push(options.minimum_price_per_night);
    queryString += `cost_per_night/100 > $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    //Check if the params array is empty. If empty start with WHERE, if not - add AND to the query
    queryParams.length === 0 ?  queryString += `WHERE ` : queryString += `AND `;
    // Add the maximum_price_per_night to the params array
    queryParams.push(options.maximum_price_per_night);
    queryString += `cost_per_night/100 < $${queryParams.length} `;
  }
  //Query that comes after the WHERE clause
  queryString += `
  GROUP BY properties.id`;
    
  if (options.minimum_rating) {
    // Add the minimum_rating to the params array and create a HAVING clause
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // Add limit to the params array
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  //Run the query
  return db.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return db
    .query(`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
    `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property. number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code])
    .then(res =>  {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
