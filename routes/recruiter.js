const express = require('express');
const recruiterController = require('../controller/recruiter-controller');
const passport = require('passport')
const router = express.Router();

router.get('/dashboard',passport.authenticate('jwt', { session: false }), recruiterController.dashboard)
router.get('/candidates', passport.authenticate('jwt', { session: false }), recruiterController.candidates)
router.get('/candidate-info/:id', passport.authenticate('jwt', { session: false }), recruiterController.candidateById)
router.get('/jobs', passport.authenticate('jwt', { session: false }), recruiterController.jobs)
router.get('/job-by-id/:id', passport.authenticate('jwt', { session: false }), recruiterController.jobById)
router.get('/profile', passport.authenticate('jwt', { session: false }), recruiterController.viewProfile)

router.post('/sign-up', recruiterController.signUp)
router.post('/add-job', passport.authenticate('jwt', { session: false }), recruiterController.addJob)

router.put('/add-profile', passport.authenticate('jwt', { session: false }), recruiterController.addProfile)
router.put('/edit-job/:id', recruiterController.editJob)

router.delete('/delete-job/:id',recruiterController.deleteJob)

module.exports = router