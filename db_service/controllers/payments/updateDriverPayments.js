const pool = require('../../config/database'); // Assuming pool is exported from your database configuration

const updateDriverPayments = (req, res) => {
    const { phone_number, montant } = req.body;

}

module.exports = {
    updateDriverPayments
}