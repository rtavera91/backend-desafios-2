import passport from "passport";
import { usersManager } from "./dao/db/managers/usersManager.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";

//LOCAL
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    passport.use(
      "signup",
      new LocalStrategy(
        {
          usernameField: "email",
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          try {
            const userDB = await usersManager.findByEmail(email);
            if (userDB) {
              return done(null, false);
            }
            const hashedPassword = await hashData(password);
            const createdUser = await usersManager.createOne({
              ...req.body,
              password: hashedPassword,
            });
            done(null, createdUser);
          } catch (error) {
            done(error);
          }
        }
      )
    )
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const userDB = await usersManager.findByEmail(email);
        if (!userDB) {
          return done(null, false);
        }
        const isValid = await compareData(password, userDB.password);
        if (!isValid) {
          return done(null, false);
        }
        done(null, userDB);
      } catch (error) {
        done(error);
      }
    }
  )
);

// GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: "Iv1.ebcfa6e7611d70bd",
      clientSecret: "0a8c624c0c38f973dbfc389544632d14da5c808d",
      callbackURL: "http://localhost:8080/api/users/github",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("profile", profile);
      done(null, false);
      try {
        const userDB = await usersManager.findByEmail(profile._json.email);
        //login
        if (userDB) {
          if (userDB.from_github) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }

        //signup
        const newUser = {
          first_name: profile._json.name.split(" ")[0],
          last_name: profile._json.name.split(" ")[1] || "",
          email: profile._json.email || profile.emails[0].value,
          password: "12345678",
          from_github: true,
        };
        const createdUser = await usersManager.createOne(newUser);
        if (createdUser) {
          return done(null, createdUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
// serializeUser
passport.serializeUser(function (user, done) {
  console.log("test");
  done(null, user._id);
});

// deserializeUser
passport.deserializeUser(async function (id, done) {
  try {
    const userDB = await usersManager.findById(id);
    done(null, userDB);
  } catch (error) {
    done(error);
  }
});
