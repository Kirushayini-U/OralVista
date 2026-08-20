require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdministrator = async () => {
  try {
    const {
      MONGO_URI,
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    } = process.env;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing from the .env file.");
    }

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be added to the .env file."
      );
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error(
        "The administrator password must contain at least 8 characters."
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully.");

    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();

    let admin = await User.findOne({
      email: adminEmail,
    }).select("+password");

    if (admin) {
      admin.fullName = ADMIN_NAME.trim();
      admin.password = ADMIN_PASSWORD;
      admin.role = "admin";
      admin.isActive = true;

      await admin.save();

      console.log(`Admin account updated: ${adminEmail}`);
    } else {
      admin = await User.create({
        fullName: ADMIN_NAME.trim(),
        email: adminEmail,
        phone: "",
        password: ADMIN_PASSWORD,
        role: "admin",
        isActive: true,
      });

      console.log(`Admin account created: ${admin.email}`);
    }
  } catch (error) {
    console.error("Unable to create admin account:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdministrator();