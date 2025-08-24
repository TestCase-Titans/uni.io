import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import db from "./db.js";

export default function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (err, results) => {
        if (err) return done(err);
        if (results.length === 0) {
          return done(null, false, { message: "No user with that email" });
        }

        const user = results[0];
        // match passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    // console.log("Serializing user:", user);

    if (!user || !user.id) {
      return done(new Error("User or user ID is missing for serialization"));
    }

    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const query =
      "SELECT id, email, name, isBanned, isSysAdmin, clubAdminStatus FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return done(err);
      const user = results[0];
      if (!user) return done(null, false);

      if (user.isSysAdmin) user.role = "sysAdmin";
      else if (user.clubAdminStatus === "accepted") user.role = "clubAdmin";
      else user.role = "student";

      done(null, user);
    });
  });
}
