import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

function generateWelcomeToken(subscriberId) {
  const payload = {
    subscriberId,
  };
  return jwt.sign(
    payload,
    secret,
    { algorithm: 'HS256' },
    { expiresIn: `${60 * 20}` /* 20 minutes */ }
  );
}

function generateUnsubscribeToken(subscriberId) {
  const payload = {
    subscriberId,
  };
  return jwt.sign(
    payload,
    secret,
    { algorithm: 'HS256' },
    { expiresIn: '7 days' }
  );
}

function decodeToken(token) {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export {
  generateWelcomeToken,
  generateUnsubscribeToken,
  decodeToken,
};
