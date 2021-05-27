const properties = require('./json/properties.json');
const users = require('./json/users.json');

// to connect postgres with javascript files 
// we installed a package called pg (node-postgres) by running npm install pg

// step 0 - require 
const { Pool } = require('pg');

// to add a pass to a user... ( example )
// ALTER USER development with PASSWORD 'development';
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});
// to see if we actually connected to the server
// we are going to run an optional command called connect()

pool.connect().then(() => {
  console.log('connected');
}).catch(e => {
  console.log('--------------- ERROR -----------');
  console.log(e);
})
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      //console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      // console.log(err.message);
      return err.message;
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const sqlQuery = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`
  let params = [user.name, user.email, user.password];
  return pool
  .query(sqlQuery,params)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err.message;

  })

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const sqlQuery = `SELECT reservations.*, properties.* FROM reservations
  JOIN properties ON property_id = properties.id
  WHERE guest_id = $1 LIMIT $2;`

  const params = [guest_id,limit];
  return pool
    .query(sqlQuery, params)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      return err.message;
    });
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  console.log("options", options);
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  //if options include maximum_price_per_night and minimum_price_per_night
  if(options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryParams.push(options.maximum_price_per_night);
    queryString += `And cost_per_night/100 >= $${queryParams.length-1} AND cost_per_night/100 <= $${queryParams.length}`;
  }


  //if options include minimum_rating
  if(options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND rating >= $${queryParams.length}`;
  }
  
  //if options.owner_id exists
  if(options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id =$${queryParams.length}`;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const sqlQuery = `INSERT INTO properties 
  (title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`
  let params = [property.title, property.description, property.owner_id, property.cover_photo_url, property.thumbnail_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.province, property.city, property.country, property.street, property.post_code];
  return pool
  .query(sqlQuery,params)
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    return err.message;

  })
}
exports.addProperty = addProperty;
