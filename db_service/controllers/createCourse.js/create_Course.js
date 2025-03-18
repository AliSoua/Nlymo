const pool = require('../../config/database');

const create_Course = (data) => {
  console.log(data);
    const query = `
    INSERT INTO courses (
      driver_id, 
      client_id, 
      driver_rate, 
      client_rate, 
      price, 
      destination, 
      depart, 
      time_of_starting_course, 
      time_of_end_course,
      state,
      dlatitude,
      dlongitude,
      alatitude,
      alongitude,
      distanceofcourse
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id
  `;
  const now = new Date();
  now.setHours(now.getHours() + 1);

  const values = [
    data.driver_id,
    data.client_id,
    data.driver_rate || null,
    data.client_rate || null,
    data.price || null,
    data.destination,
    data.depart,
    now.toISOString(),
    now.toISOString(), // This should be corrected if it was intended to be different
    data.state,
    data.dlatitude,
    data.dlongitude,
    data.alatitude,
    data.alongitude,
    data.distanceofcourse,
  ];

  pool.query(query, values, (err, res) => {
    if (err) {
      console.error('Error inserting liveCourse into database:', err.message);
    } else {
      console.log('liveCourse inserted with ID:', res.rows[0].id);
    }
  });
}

module.exports = {
    create_Course
}