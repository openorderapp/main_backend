const config = {
    client: 'postgresql',
    connection: {
        database: "openorder_db",
        user: "openorder_backend_user",
        password: "dummypassword",
        port: 5432,
        host: "127.0.0.1"
    }
}

module.exports = config;