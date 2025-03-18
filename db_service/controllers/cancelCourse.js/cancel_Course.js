const pool = require('../../config/database');

const cancel_Course = (data, res) => {
  console.log('iam at cancel_course : ', data);
    const { clientPhone, driverPhone } = data; // Receive client and driver phone numbers from the request
    const query = `
    UPDATE courses
    SET state = 'cancelled',
        time_of_end_course = NOW() + INTERVAL '1 hour'
    WHERE client_id = $1
      AND driver_id = $2
      AND state = 'pending'
      AND time_of_starting_course = (
        SELECT MAX(time_of_starting_course)
        FROM courses
        WHERE client_id = $1
          AND driver_id = $2
          AND state = 'pending'
      )
    RETURNING id`;

  const values = [clientPhone, driverPhone]; // Pass clientPhone and driverPhone as query parameters

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating course in the database:', err.message);
      return res.status(500).json({ error: 'Database error', message: err.message });
    } else if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No pending course found for the provided client and driver' });
    } else {
      console.log('Course canceled with ID:', result.rows[0].id);
      return res.status(200).json({ message: 'Course canceled', courseId: result.rows[0].id });
    }
  });
}

module.exports = {
    cancel_Course
}