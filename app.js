const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

// MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : '302cem'
})

// Get all products
app.get('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id' + connection.threadId)

        connection.query('SELECT * from productinfo', (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('The data from productinfo table are: \n', rows)

        })
    })
});

// Get a product by ID
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('SELECT * from productinfo WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('The data from productinfo table are: \n', rows)

        })
    })
});

// Delete product
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('DELETE from productinfo WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(`Product/ Products with the ID ${req.params.id} has/ have been deleted.`)
            } else {
                console.log(err)
            }

            console.log('The data from productinfo table are: \n', rows)

        })
    })
});

// Add a product
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        const params = req.body

        connection.query('INSERT INTO productinfo SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(`Product/ Products with the ID ${params.id} has/ have been added.`)
            } else {
                console.log(err)
            }

            console.log('The data from productinfo table are: \n', rows)

        })

    })
});

app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, productid, name, source, quantity } = req.body

        connection.query('UPDATE productinfo SET productid = ?, name = ?, source = ?, quantity = ? WHERE id = ?', [productid, name, source, quantity, id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Product/ Products with ID ${id} has/ have been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

// Listen on environment 5000
app.listen(port, () => console.log(`Listen on port ${port}`))