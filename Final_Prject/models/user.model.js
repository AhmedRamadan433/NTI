const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name must be at most 50 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username must be at most 50 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: ["Admin", "Member"],
      default: "Member",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    userImage: {
      type: String,
    },
    userBio: {
      type: String,
      trim: true,
      maxlength: [500, "User bio must be at most 500 characters long"],
    },
    userSkills: [
      {
        type: String,
        trim: true,
        maxlength: [
          50,
          "User skill must be at most 50 characters long You are not Neymar!",
        ],
      },
    ],
    userSocialLinks: {
      type: Map,
      of: String,
    },
    userProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    userTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    userComments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    userNotifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    userMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    userSettings: {
      type: Map,
      of: String,
    },
    userActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[\+]?[0-9]{10,15}$/, "Please fill a valid phone number"],
    },
    isVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);
////////////
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
////////////
const User = mongoose.model("User", userSchema);
module.exports = User;
