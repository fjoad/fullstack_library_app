const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//all
router.get('/', async (req, res) => {
    let searchOptions = {} 
    if(req.query.name != null && req.query.name !== '') {       //req.query holds parameters passed through GET
        searchOptions.name = new RegExp(req.query.name, 'i')    //'i' flag tells regex to make query case insensitive 
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query                            //so the search bar is repopulated with users search params (in case of search)
        })
    } catch {
        res.redirect('/')
    }
    
})

//new form 
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//create action
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name                                 //req.body holds parameters passed through POST
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})

//show
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

//edit form
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})

//update action
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (err) {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error updating author: ' + err
            })
        }
    }
})

//delete
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (err) {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router 