require("dotenv").config();
const connectDB = require('./../db/connect');

const bcrypt = require("bcrypt");
const { User } = require('./../models/User');

const UserSeeder = async () => {
    const arguments = process.argv.slice(2);
    const defaultPassword = await bcrypt.hash('password', 12);

    const users = [
        {
            username: 'admin',
            password: defaultPassword,
            role: 'admin'
        },
        {
            username: 'user',
            password: defaultPassword,
            role: 'admin'
        },
    ]

    try {
        console.log('Users ..... SEEDING');

        if(arguments.includes('fresh')) {
            await User.deleteMany();
        }

        await User.create(users);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    console.log('Users ..... DONE');

};

module.exports = { UserSeeder }
