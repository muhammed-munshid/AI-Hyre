const recruiterModel = require('../model/recruiterModel');

module.exports = {

    jobs: async (req, res) => {
        try {
            function transformJobDocument(doc) {
                doc = doc.toObject();
                if (doc.required_skill_set && Array.isArray(doc.required_skill_set)) {
                  doc.required_skill_set = doc.required_skill_set.map(skill => {
                    if (skill._id) {
                      delete skill._id;
                    }
                    return skill;
                  });
                }
                return doc;
              }
              const jobs = await jobModel.find();
              const cleanedJobs = jobs.map(transformJobDocument);
              res.status(200).send(cleanedJobs);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Something Error' })
        }
    },

}