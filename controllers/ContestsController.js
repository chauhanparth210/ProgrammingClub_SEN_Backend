const Contest = require('../models/Contest')

const getContests = async (req, res) => {
    try {
        const contests = await Contest.find()
        return res.status(200).json({contests})
    } catch (error) {
        res.status(500).json({err: 'Server err'})
    }
}

const getContest = async (req, res) => {
    const id = req.params.id
    try {
        const contest = await Contest.findById(id)
        return res.status(200).json({contest})
    } catch (error) {
        res.status(500).json({err: 'Server err'})
    }
}

const addContest = async (req, res) => {
    try {
        const contest = await Contest.create(req.body)
        return res.status(201).json({contest})
    } catch (error) {
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message)
            return res.status(400).json({err: messages})
        } else {
            res.status(500).json({err: 'Server err'})
        }
    }
}

const updateContest = async (req, res) => {
    try {
        const cid = req.params.id
        const contest = await Contest.findByIdAndUpdate(cid, req.body, { new: true })
        return res.status(201).json({contest})
    } catch (error) {
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message)
            return res.status(400).json({err: messages})
        } else {
            res.status(500).json({err: 'Server err'})
        }
    }
}

module.exports = {getContests, addContest, updateContest, getContest}