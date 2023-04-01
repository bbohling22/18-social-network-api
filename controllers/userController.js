const userController = {
    getAllUsers(req, res) {
      User.find({})
        .populate({
          path: 'thoughts friends',
          select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  
    getUserById({ params }, res) {
      User.findOne({ _id: params.id })
        .populate({
          path: 'thoughts friends',
          select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    createUser({ body }, res) {
      User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },
  
    updateUser({ params, body }, res) {
      User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
          }
          res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
  
    deleteUser({ params }, res) {
      User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
          }
          // Bonus: Remove associated thoughts
          return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        })
        .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
        .catch(err => res.status(400).json(err));
    },
  
    addFriend({ params }, res) {
      User.findOneAndUpdate({ _id: params.userId }, { $addToSet: { friends: params.friendId } }, { new: true })
        .then(dbUserData => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
          }
          res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
  
    removeFriend({ params }, res) {
      User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
        .then(dbUserData => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'No user found with this id!' });
          }
          res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
  };