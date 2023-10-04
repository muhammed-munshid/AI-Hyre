const passport = require('passport');
const userModel = require('../model/userModel');
const recruiterModel = require('../model/recruiterModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

  passport.use('jwt', new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
	try {
	  if (jwtPayload.role === 'user') {
		const user = await userModel.findById(jwtPayload.id).exec();
		console.log(user);
		if (user) {
		  return done(null, user);
		} else {
		  return done(null, false);
		}
	  } else if (jwtPayload.role === 'recruiter') {
		const recruiter = await recruiterModel.findById(jwtPayload.id).exec();
		if (recruiter) {
		  return done(null, recruiter);
		} else {
		  return done(null, false);
		}
	  } else {
		return done(null, false);
	  }
	} catch (error) {
	  return done(error, false);
	}
  }));
  
