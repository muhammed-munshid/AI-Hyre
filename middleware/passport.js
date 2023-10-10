const passport = require('passport');
const candidateModel = require('../model/candidateModel');
const recruiterModel = require('../model/recruiterModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const jwtOptions = {
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 	secretOrKey: process.env.JWT_SECRET,
// };


passport.use('jwt', new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET,
		passReqToCallback: true, // Pass the req object to the callback
	},
	async (req, jwtPayload, done) => {
		try {
			if (jwtPayload.role === 'user') {
				const user = await candidateModel.findById(jwtPayload.id).exec();
				if (user) {
					// Attach jwtPayload to the req object
					req.jwtPayload = jwtPayload;
					req.token = req.headers.authorization.split(' ')[1]; // Extract and store the token
					return done(null, user); // Correct usage of done
				} else {
					return done(null, false); // Correct usage of done
				}
			} else if (jwtPayload.role === 'recruiter') {
				const recruiter = await recruiterModel.findById(jwtPayload.id).exec();
				if (recruiter) {
					// Attach jwtPayload to the req object
					req.jwtPayload = jwtPayload;
					req.token = req.headers.authorization.split(' ')[1]; // Extract and store the token
					return done(null, recruiter); // Correct usage of done
				} else {
					return done(null, false); // Correct usage of done
				}
			} else {
				return done(null, false); // Correct usage of done
			}
		} catch (error) {
			return done(error, false); // Correct usage of done
		}
	}
));


// passport.use(new GoogleStrategy({
// 	clientID: process.env.GOOGLE_CLIENT_ID,
// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 	callbackURL: 'http://localhost:3000/auth/google/callback', // Change to your callback URL
// }, (accessToken, refreshToken, profile, done) => {
// 	// Here, you can save user data or perform other actions
// 	return done(null, profile);
// }));

