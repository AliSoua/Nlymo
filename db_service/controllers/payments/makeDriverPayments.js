const pool = require('../../config/database'); // Assuming pool is exported from your database configuration

const makeDriverPayments = async (req, res) => {
    try {
        // Destructure the relevant fields from the request body
        const { phone_number, montant, date } = req.body;

        // Validate input
        if (!phone_number || !montant || !date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // SQL query to insert payment into the payments table
        const query = `
            INSERT INTO payments (phone_number, montant, date)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        // Execute the query
        const result = await pool.query(query, [phone_number, montant, date]);

        // Return the newly inserted payment data
        return res.status(201).json({ message: 'Payment recorded successfully', payment: result.rows[0] });
    } catch (error) {
        console.error('Error making driver payment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    makeDriverPayments
};
