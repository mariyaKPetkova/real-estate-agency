module.exports = {
    PORT: process.env.PORT || 3000,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/REA',
    TOKEN_SECRET:'123456789',
    COOKIE_NAME:'SESSION_DATA',
    
}