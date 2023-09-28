const { UserSeeder } = require('./UserSeeder');
const connectDB = require('./../db/connect');

async function run() {
    try {
        await connectDB(process.env.MONGO_URI);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    const seeders = await Promise.allSettled([UserSeeder()]);

    console.log('Seeding Complete!');
    process.exit(0);
}

run();