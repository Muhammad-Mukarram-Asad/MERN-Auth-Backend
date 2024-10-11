import { mongoose } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timeStamps: true }
);

// Encrypting the password before saving it to database:
// Mongoose: Provides middleware (hooks) such as pre and post hooks, allowing you to execute code before or
//  after certain actions, like saving or updating documents. This is useful for things like hashing 
//  passwords before saving or logging changes.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashedPassword;
});

// matching the plaintext password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password); 
  // return true or false
}

const User = mongoose.model("User", userSchema);

export default User;

// Some other powerful features of mongoose:

/*
5. Object Mapping & Virtuals
Mongoose: Provides virtual fields and object mapping, allowing you to create calculated fields or virtual fields that don’t get persisted in the database but are computed on-the-fly.
Example:
js
Copy code
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
MongoDB Native Driver: No such concept exists. You would need to manually calculate these fields in your application.
6. Population (References & Joins)
Mongoose: Provides a feature called population, which allows for easy referencing and fetching of related documents (similar to SQL joins). This is very handy when you have relationships between different collections.
Example:
js
Copy code
User.findOne({ _id: userId }).populate('posts').exec((err, user) => {
  console.log(user.posts);
});
MongoDB Native Driver: No such concept exists. You would need to manually populate these fields in your application.
*/