const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";


// =========================================================
// Encryption key
// =========================================================

if (!process.env.FIELD_ENCRYPTION_KEY) {
  throw new Error(
    "FIELD_ENCRYPTION_KEY is missing from environment variables."
  );
}

const KEY = Buffer.from(
  process.env.FIELD_ENCRYPTION_KEY,
  "hex"
);

if (KEY.length !== 32) {
  throw new Error(
    "FIELD_ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)."
  );
}


// =========================================================
// HMAC integrity key
// =========================================================

// Prefer a separate integrity key.
// If it is not yet configured, FIELD_ENCRYPTION_KEY is used
// temporarily so the existing project continues to work.
const INTEGRITY_KEY =
  process.env.RECORD_INTEGRITY_KEY ||
  process.env.FIELD_ENCRYPTION_KEY;


// =========================================================
// AES-256-GCM encryption
// =========================================================

function encrypt(text) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  let encrypted = cipher.update(
    String(text),
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    encryptedData: encrypted,
  };
}


// =========================================================
// AES-256-GCM decryption
// =========================================================

function decrypt(data) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(data.iv, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(data.authTag, "hex")
  );

  let decrypted = decipher.update(
    data.encryptedData,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}


// =========================================================
// Existing image SHA-256 fingerprint
// =========================================================

function hashImage(buffer) {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}


// =========================================================
// Stable serialization for prediction integrity
// =========================================================

function stableStringify(value) {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value.map(stableStringify).join(",") +
      "]"
    );
  }

  const keys = Object.keys(value).sort();

  return (
    "{" +
    keys
      .map(
        (key) =>
          JSON.stringify(key) +
          ":" +
          stableStringify(value[key])
      )
      .join(",") +
    "}"
  );
}


// =========================================================
// HMAC-SHA256 prediction record integrity hash
// =========================================================

function createRecordHmac(recordData) {
  const normalizedData =
    stableStringify(recordData);

  return crypto
    .createHmac(
      "sha256",
      INTEGRITY_KEY
    )
    .update(normalizedData, "utf8")
    .digest("hex");
}


// =========================================================
// Verify prediction record integrity
// =========================================================

function verifyRecordHmac(
  recordData,
  storedHmac
) {
  if (
    typeof storedHmac !== "string" ||
    !/^[a-f0-9]{64}$/i.test(storedHmac)
  ) {
    return false;
  }

  const calculatedHmac =
    createRecordHmac(recordData);

  const storedBuffer = Buffer.from(
    storedHmac,
    "hex"
  );

  const calculatedBuffer = Buffer.from(
    calculatedHmac,
    "hex"
  );

  if (
    storedBuffer.length !==
    calculatedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    storedBuffer,
    calculatedBuffer
  );
}


// =========================================================
// Exports
// =========================================================

module.exports = {
  encrypt,
  decrypt,
  hashImage,
  createRecordHmac,
  verifyRecordHmac,
};