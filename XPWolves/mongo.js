const mongoose = require("mongoose");

module.exports = async () => {
    const mongoUri = process.env.CONN_STR;

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return mongoose;
};