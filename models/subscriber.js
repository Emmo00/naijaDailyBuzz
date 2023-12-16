import { Schema, model } from 'mongoose';

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Subscriber = model('Subscriber', subscriberSchema);

export default Subscriber;
