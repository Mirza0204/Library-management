// hashPassword.js
import bcrypt from "bcryptjs";

const plain = "Aqsa321";          // change to the password you want
const saltRounds = 10;

(async () => {
  try {
    const hash = await bcrypt.hash(plain, saltRounds);
    console.log("HASH:", hash);
  } catch (err) {
    console.error(err);
  }
})();
