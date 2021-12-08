//mongodb://localhost/nextgen-promo
const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost/nextgen-promo");

    } catch (e) {
        console.error(e);
    }
}
module.exports = {connect}
