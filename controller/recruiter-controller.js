
module.exports = {
    
    getAllEvents: async (req, res) => {
        try {
            const getEvents = await eventModel.find()
            res.status(200).send({ success: true, getEvents: getEvents })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: true })
        }
    },

    getEventById: async (req, res) => {
        try {
            const id = req.params.id
            const getEvents = await eventModel.findOne({ _id: id })
            res.status(200).send({ success: true, getEvents: getEvents })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: true })
        }
    },

}