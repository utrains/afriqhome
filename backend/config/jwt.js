const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-here';
const JWT_EXPIRES_IN = '30d';

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN
}; 