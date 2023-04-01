const { Thought, User } = require('../models');

const thoughtController = {
  
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ createdAt: -1 })
      .then(thoughtData => res.json(thoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

 
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json({ message: 'Thought created!' });
      })
      .catch(err => res.json(err));
  },

  
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true
    })
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json({ message: 'Thought updated!' });
      })
      .catch(err => res.status(400).json(err));
  },

 
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: deletedThought.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json({ message: 'Thought deleted!' });
      })
      .catch(err => res.status(400).json(err));
  },

  
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(thought