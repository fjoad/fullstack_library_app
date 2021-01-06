const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// All authors route
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

//New author route 
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name                                 //req.body holds parameters passed through POST
    })
    try {
        const newAuthor = await author.save()
        //res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})

module.exports = router 