const mongoose = require('mongoose')

const bookmarkSchema = mongoose.Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    }
})

const bookmarkCollection = mongoose.model('bookmarksdb',bookmarkSchema);

// Functions
const Bookmark = {
    // Post
    createBookmark: function (newBookmark) {
        return bookmarkCollection
                .create(newBookmark)
                .then(create_newBookmark => {
                    console.log("create")
                    console.log(create_newBookmark)
                    return create_newBookmark;
                })
                .catch(err => {
                    return err;
                });
    },

    // Get All
    getAllBookmarks: function() {
        return bookmarkCollection
                .find()
                .then(allBookmarks => {
                    return allBookmarks
                })
                .catch(err => {
                    return err
                })
    },

    // Get by Title
    getByTitleBookmark: function(title) {
        const filter = {title : title};
        return bookmarkCollection
                .find(filter)
                .then(bookmark => {
                    if(bookmark.length < 1)
                        return undefined
                    else
                        return bookmark
                })
                .catch(err => {
                    return err
                })
    },

    // DELETE by id
    deleteBookmark: function(bookmarkId) {
        let filter = {id : bookmarkId};
        return bookmarkCollection
                .deleteOne(filter)
                    .then(result =>{
                        if (result.n == 0)
                            return false
                        else
                            return true
                    })
                    .catch(err => {
                        return err
                    })
    },

    updateBookmark: function (newBookmark){
        const id = {id: newBookmark.id};
        nwBk = newBookmark
        console.log(nwBk)
        /*
        const nwBk = {};

        if(!newBookmark.title) {
            nwBk.title = newBookmark.title
        }
        if(!newBookmark.description) {
            nwBk.description = newBookmark.description
        }
        if(!newBookmark.url) {
            nwBk.url = newBookmark.url
        }
        if(!newBookmark.rating) {
            nwBk.rating = newBookmark.rating
        }
        */
        /*
       const nwBk = {
           newBookmark
       }*/
       //console.log(newBookmark)
        return bookmarkCollection
                .updateOne(id, nwBk)
                    .then(result => {
                        console.log(result)
                        return result
                    })
                    .catch(err => {
                        return err
                    })

    }

}

module.exports = {Bookmark}