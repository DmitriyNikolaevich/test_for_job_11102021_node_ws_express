'use strict'

exports.status200 = (values, res) => {
    res.json({
        status: 200,
        data: values
    })
    res.end()
}