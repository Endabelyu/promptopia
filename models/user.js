import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email Already Exists!'],
    required: [true, 'Email is Required!'],
  },

  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      'Username invalid, it should contain 8-20 alphanumeric letters and be unique!',
    ],
  },
  image: {
    type: String,
  },
});

// The "models" object is provided by the Monggose library and stores all the registered models.

// if a model named "User" Already exist in the "models" object, it assigns that existing model to the "User" variable.

// This prevents redefining the model and ensures that existing model is reused.

//  if a model named "User" does not exist in the "models" object, the "model" function from Mongoose is called to create a new model

// the newly created model is then assigned to the "User Variable"

// const User = model('User', UserSchema);
// export default User;

const User = models.User || model('User', UserSchema);

export default User;