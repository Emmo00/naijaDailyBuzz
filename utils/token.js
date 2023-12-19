require('dotenv').config();
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

function generateWelcomeToken(subscriberId) {
  const payload = {
    subscriberId,
  };
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
  });
}

function generateUnsubscribeToken(subscriberId) {
  const payload = {
    subscriberId,
  };
  return jwt.sign(payload, secret, { algorithm: 'HS256' });
}

function decodeToken(token) {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    console.log('err', err);
    return null;
  }
}

export { generateWelcomeToken, generateUnsubscribeToken, decodeToken };
