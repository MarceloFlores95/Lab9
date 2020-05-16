const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addBookmarkFech( title, description,urlBook,rating ){
    let urlB = '/bookmarks';

    let data = {
        title : title,
        description: description,
        url: urlBook,
        rating: rating
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.resultsPost' );

    fetch( urlB, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            results.innerHTML += `
            <div> ${responseJSON.id} </div>
            <div> ${responseJSON.title} </div>
            <div> ${responseJSON.description} </div>
            <div> ${responseJSON.url} </div>
            <div> ${responseJSON.rating} </div>
                                `;
            fetchBookmark();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });       
}

function fetchBookmark(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.allBookmarks' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `
                <div> ${responseJSON[i].id} </div>
                <div> ${responseJSON[i].title} </div>
                <div> ${responseJSON[i].description} </div>
                <div> ${responseJSON[i].url} </div>
                <div> ${responseJSON[i].rating} </div>
                                    `;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function fetchBookmarkByTitle(title){

    let url = `/bookmark?title=${title}`;
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.resultsBytitle' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `
                <div> ${responseJSON[i].id} </div>
                <div> ${responseJSON[i].title} </div>
                <div> ${responseJSON[i].description} </div>
                <div> ${responseJSON[i].url} </div>
                <div> ${responseJSON[i].rating} </div>
                                    `;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function deleteBookmarkFech( id ) {
    let url = `/bookmark/${id}`;
    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.resultsByDelete' );
    
    console.log(results)
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                results.innerHTML = "";
                results.innerHTML = `Bookmark with id = ${id} was deleted!`;
                fetchBookmark();
            }
            throw new Error( response.statusText );
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        }); 
}

function updateBookmarkFetch(id, title, description,urlBook,rating ){
    let url = `/bookmark/${id}`;
    let data = {};

    if (id != "" || id) {
        data['id'] = id;
    }
    if (title != "" || title) {
        data['title'] = title;
    }
    if (description != "" || description) {
        data['description'] = description;
    }
    if (url != "" || url) {
        data['url'] = urlBook;
    }
    if (rating != "" || rating) {
        data['rating'] = rating;
    }

    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json',
            id : id
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.resultsPATCH' );

    fetch(url, settings )
        .then( response => {
            if(response.ok){
                return response.json()
            }
            throw new Error( response.statusText );
        })
        .then((responseJSON) => {
            let results = document.getElementsByClassName('resultsByPATCH');
            results.innerHTML = ``;
            results.innerHTML += `
                                    <div>Title: ${responseJSON.title}</div>
                                    <div>Description: ${responseJSON.description}</div>
                                    <div>Rating: ${responseJSON.rating}</div>
                                    <div>Url: ${responseJSON.url}</div>
                                    </div>`;
            fetchBookmark();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        }); 
}

function getBookmark() {
    let bookmarkForm = document.querySelector( '.get-one-bookmarks-form' );
    bookmarkForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById('get-bookmark-title').value;
        fetchBookmarkByTitle(title);
    })
}

function addSBookmark(){
    let bookmarkForm = document.querySelector( '.add-bookmark-form' );

    bookmarkForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bookmarkTitle' ).value;
        let description = document.getElementById( 'bookmarkDescription' ).value;
        let url = document.getElementById( 'bookmarkUrl' ).value;
        let rating = document.getElementById( 'bookmarkRating' ).value;

        addBookmarkFech( title, description, url, rating );
    })
}

function deleteBookmark() {
    let bookmarkForm = document.querySelector( '.delete-one-bookmarks-form' );

    bookmarkForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = document.getElementById( 'delete-bookmark-id' ).value;
    
        deleteBookmarkFech( id );
    })
}

function updateBookmark() {
    let bookmarkForm = document.querySelector( '.patch-bookmark-form' );

    bookmarkForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = document.getElementById( 'bookmarkIDUpdate' ).value;
        let title = document.getElementById( 'bookmarkTitleUpdate' ).value;
        let description = document.getElementById( 'bookmarkDescriptionUpdate' ).value;
        let url = document.getElementById( 'bookmarkUrlUpdate' ).value;
        let rating = document.getElementById( 'bookmarkRatingUpdate' ).value;

        updateBookmarkFetch(id, title, description, url, rating );
    })
}

function init(){
    fetchBookmark();
    addSBookmark();
    getBookmark();
    deleteBookmark();
    updateBookmark();
}

init();