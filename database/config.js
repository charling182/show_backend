module.exports = {
    "development": {
        "username": "charling",
        "password": "18240542192",
        "database": "egg_charling_dev",
        "host": "127.0.0.1",
        "port": "33066",
        "dialect": "mysql",
        "seederStorage": "sequelize",
        "seederStorageTableName": "seeder_tables"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "port": "3306",
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.MySqlUserName,
        "password": process.env.MySqlPassword,
        "database": process.env.MySqlDatabase,
        "host": process.env.MySqlHost,
        "port": process.env.MySqlPort,
        "dialect": "mysql",
        "seederStorage": "sequelize",
        "seederStorageTableName": "seeder_tables"
    }
}