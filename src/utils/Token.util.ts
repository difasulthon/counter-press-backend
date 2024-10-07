import { createJWT } from "oslo/jwt";
import { TimeSpan } from "oslo";

const getSecret = async () => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(process.env.TOKEN_SECRET);

  return uint8Array.buffer as ArrayBuffer;
};

export const createToken = async (userId: string) => {
  const secret = await getSecret();
  const payload = {};
  const options = {
    subject: userId,
    expiresIn: new TimeSpan(1, "m"),
    includeIssuedTimestamp: true,
  };

  try {
    const jwt = await createJWT("HS256", secret, payload, options);

    return jwt;
  } catch {
    return null;
  }
};
