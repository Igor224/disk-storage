import ck from 'ckey';

export default {
    storageServices: {
        SERVICE_PORT: 8001,
        diskStorOptions:{
            DIR: ck.FILE_DIRECTORY,
            whiteList: ['png', 'jpg', 'jpeg', 'gif'],
            limits:{
                fileSize: 50 * 1024 * 1024,
                files: 3
            }
        },
        USER_URL: 'http://localhost:8081',
        MySQL: {  
            DB: ck.DB_STORAGE_SERVICE,
            USER: ck.DB_OWNER,
            PASS: ck.DB_PASSWORD,
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
    },
    userService: {
        SERVICE_PORT: 8000,
        USER_URL: 'http://localhost:8080',
        MySQL: {    
            DB: ck.DB_USER_SERVICE,
            USER: ck.DB_OWNER,
            PASS: ck.DB_PASSWORD,
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
    },
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
}