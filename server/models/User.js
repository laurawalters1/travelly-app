const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        "Must be a valid email address",
      ],
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      // match? maybe add a regex here to ensure password strength?
    },
    // not 100% sure these are correct
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    // profile picture using s3?
    profilePicture: {
      type: String,
    },
    // might be easier to have just badges instead of seperating country and activities? so easier to reference below
    savedBadges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],

    // not sure with bucket lists

    countriesVisited: [
      {
        type: Schema.Types.ObjectId,
        ref: "Country",
      },
    ],
    earnedBadges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// function to return following count -- following to be declared in typeDefs?
userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

// function to return follower count -- followers to be declared in typeDefs?
userSchema.virtual("followerCount").get(function () {
  return this.followers.length;
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;