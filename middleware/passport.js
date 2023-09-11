const passport = require('passport');
const userModel = require('../model/userModel');
const recruiterModel = require('../model/recruiterModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const jwtOptionsUser = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET_USER,
  };
  
  const jwtOptionsRecruiter = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET_RECRUITER,
  };

  passport.use('user-jwt', new JwtStrategy(jwtOptionsUser, async (jwtPayload, done) => {
	try {
	  const user = await userModel.findById(jwtPayload.id).exec();
	  console.log('user: ',user);
	  if (user) {
		return done(null, user);
	  } else {
		return done(null, false);
	  }
	} catch (error) {
	  return done(error, false);
	}
  }));

  passport.use('recruiter-jwt', new JwtStrategy(jwtOptionsRecruiter, async (jwtPayload, done) => {
	try {
	  const recruiter = await recruiterModel.findById(jwtPayload.id).exec();
	  if (recruiter) {
		return done(null, recruiter);
	  } else {
		return done(null, false);
	  }
	} catch (error) {
	  return done(error, false);
	}
  }));
  