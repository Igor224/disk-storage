import dotenv from 'dotenv';
dotenv.config({path: '../.env'});
export default {
    storageServices: {
        DIR: process.env.FILE_DIRECTORY,
        DB: 'files_storage',
        USER: 'Igor',
        PASS: process.env.DB_PASSWORD,
        options:{
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
              }
        }
    },
    userService: {
        DB: 'user_service',
        USER: 'Igor',
        PASS: process.env.DB_PASSWORD,
        options:{
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
              }
        }
    }
}