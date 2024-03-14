const User = require('../models/User')
const Book = require('../models/Book')

async function createBook(req, res) {
    const { title, author, publicationYear, genre, userId } = req.body
    var missingFields = []
    if (!title) missingFields.push('title')
    if (!author) missingFields.push('author')
    if (!publicationYear) missingFields.push('publicationYear')
    if (!genre) missingFields.push('genre')
    if (!userId) missingFields.push('userId')
    if (missingFields.length > 0) {
        return res.status(422).json({ msg: `The following fields are required: ${missingFields.join(', ')}` })
    }
    if (typeof publicationYear !== 'number') {
        return res.status(422).json({ msg: 'Publication year must be a number' })
    }
    try {
        const user = await User.findById(userId).select('name')
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        const book = new Book({
            title: title,
            author: author,
            publicationYear: publicationYear,
            genre: genre,
            user: user
        })
        await book.save()
        res.status(201).json({ msg: 'Book created successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function getBooks(req, res) {
    try{
        const books = await Book.find({deletedAt: null}).populate('user', 'name')
        res.status(200).json(books)
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function getBook(req, res) {
    const bookId = req.params.id
    try{
        const book = await Book.findById(bookId).populate('user', 'name')
        if(!book){
            return res.status(404).json({msg: 'Book not found'})
        }
        res.status(200).json(book)
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function updateBook(req, res) {
    const bookId = req.params.id
    const { title, author, publicationYear, genre, userId } = req.body
    var missingFields = []
    if (!title) missingFields.push('title')
    if (!author) missingFields.push('author')
    if (!publicationYear) missingFields.push('publicationYear')
    if (!genre) missingFields.push('genre')
    if (!userId) missingFields.push('userId')
    if (missingFields.length > 0) {
        return res.status(422).json({ msg: `The following fields are required: ${missingFields.join(', ')}` })
    }
    if (typeof publicationYear !== 'number') {
        return res.status(422).json({ msg: 'Publication year must be a number' })
    }
    try{
        const user = await User.findById(userId).select('name')
        const book = await Book.findById(bookId)
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        if(!book){
            return res.status(404).json({msg: 'Book not found'})
        }
        book.title = title
        book.author = author
        book.publicationYear = publicationYear
        book.genre = genre
        book.user = user
        await book.save()
        res.status(200).json({msg: 'Book updated successfully'})
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

async function deleteBook(req, res) {
    const bookId = req.params.id
    try{
        const book = await Book.findById(bookId, { deletedAt: new Date() }, { new: true })
        if(!book){
            return res.status(404).json({msg: 'Book not found'})
        }
        res.status(200).json({msg: 'Book marked as deleted successfully'})
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

module.exports = {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook
}