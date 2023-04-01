const router = require('express').Router();
const express = require('express');

router.get('/users', (req, res) => {
    const users = [/* retrieve all users from a database */];
    res.send(users);
  });

module.exports = router;