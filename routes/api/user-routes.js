const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users

router.get('/', (req, res) => {
    // access our User model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});
// Get /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Mitchel', email: 'mitchmneide@gmail.com' password: }
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// Post login 
router.post('/login', (req, res) => {
    // expects email password
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user with that email address!' });
                return;
            }
            const validPassword = dbUserData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }
            res.json({ user: dbUserData, message: 'You are now logged in!' });
            // Verify user
        });
});
// PUT /api/users/i 
router.put('/:id', (req, res) => {
    // // expects {username: 'Mitchel', email: 'mitchmneide@gmail.com' password: }

    // if req.body has exact key/value pairs to match the model , you can just use req.body instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: ' NO user found with this id ' });
            return;
        }
        res.json(dbUserData);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// Delete /api/users/1 
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router; 