
export default function BookPage({book, showEditBook, displayEditBook, editBook}) {
    return (
        <>
        <div>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Owner: {book.owner}</p>
        </div>
        <div>
        <i className="fa-solid fa-pen-to-square fa-xl thirty-margin" onClick={displayEditBook}></i>
        </div>
        {showEditBook &&
        <div>
            <form name="updateBookForm" onSubmit={editBook}>
                <input data-id={book.id} type="text" className="input-margin" name="updateTitle" placeholder="Updated Title"></input>
                <input type="text" className="input-margin" name="updateAuthor" placeholder="Updated Author"></input>
                <button className="editBook" type="submit"><i className="fa-solid fa-pen-to-square fa-xl"></i></button>
            </form>
        </div>
        }
        </>
    )
}