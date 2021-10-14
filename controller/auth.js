'use strict'

const response = require('./response')

const users = [
    {
        id: 1,
        name: 'User 1',
        pass: 123
    },
    {
        id: 2,
        name: 'User 2',
        pass: 123
    },
    {
        id: 3,
        name: 'User 3',
        pass: 123
    },
    {
        id: 4,
        name: 'User 4',
        pass: 123
    },
    {
        id: 5,
        name: 'User 5',
        pass: 123
    },
]

exports.auth = (req, res) => {
    const data = JSON.parse(req.params.data)
    !users.some(x => x.name === data.login) && data.login
        ? response.status200({ isAuth: false, errorMessage: 'We are not familiar!', userName: '' }, res)
        : (users.some(x => x.name === data.login) && users.filter(x => x.name === data.login)[0].pass === +data.pass)
            ? response.status200({ isAuth: true, errorMessage: '', userName: users.filter(x => x.name === data.login)[0].name }, res)
            : response.status200({ isAuth: false, errorMessage: "Maybe 'Swordfish'?", userName: '' }, res)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')

}