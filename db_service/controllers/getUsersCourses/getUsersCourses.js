const pool = require('../../config/database');

const get_Users_Courses = async (req, res) => {
    try {
        const { phone_number } = req.user;
        const { phone_num } = req.body; // Get phone_number from request body
        console.log(phone_num);
        console.log("getusercourses");
    
        if ( req.user.user_type === "admin" && phone_num){
          console.log("he is an admin");
    
          const result = await pool.query('SELECT * FROM courses WHERE driver_id = $1 OR client_id = $1 ORDER BY time_of_starting_course ASC', [phone_num]);
    
          const courses = result.rows.map(course => ({
            ...course,
            time_of_starting_course: course.time_of_starting_course
              ? adjustToUTCPlusOne(course.time_of_starting_course)
              : null,
            time_of_end_course: course.time_of_end_course
              ? adjustToUTCPlusOne(course.time_of_end_course)
              : null,
          }));
      
          if (!res.headersSent) {
            res.json({ courses });
          }
        }
        console.log("courses getting to driver");
        const result = await pool.query('SELECT * FROM courses WHERE driver_id = $1 OR client_id = $1 ORDER BY time_of_starting_course ASC', [phone_number]);
    
        const courses = result.rows.map(course => ({
          ...course,
          time_of_starting_course: course.time_of_starting_course
            ? adjustToUTCPlusOne(course.time_of_starting_course)
            : null,
          time_of_end_course: course.time_of_end_course
            ? adjustToUTCPlusOne(course.time_of_end_course)
            : null,
        }));
    
        console.log(courses);
    
        if (!res.headersSent) {
          res.json({ courses });
        }
      } catch (err) {
        if (!res.headersSent) res.status(500).json({ error: err.message });
      }
}

// Function to adjust the date to UTC+1
const adjustToUTCPlusOne = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date.toISOString();
};

module.exports = {
    get_Users_Courses
}