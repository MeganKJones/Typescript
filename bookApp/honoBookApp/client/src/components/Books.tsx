
import React, { useState, useEffect } from 'react';
import { Book } from '../../../types/book.ts';
import AddNewBook from './AddBooks.tsx'
import BookPage from './BookPage.tsx'

export default function Books() {

    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showAddBook, setShowAddBook] = useState<boolean>(false)
    const [currentBook, setCurrentBook] = useState<Book>()
    const [showCurrentBook, setShowCurrentBook] = useState<boolean>(false)
    const [showEditBook, setShowEditBook] = useState<boolean>(false)

    useEffect(() => {
      fetchBooks()
    }, [])

// Get all books 
  const fetchBooks = () => {
    setLoading(true)
    fetch('http://localhost:3000/books')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      return response.json()
    })
    .then((data) => {
      setBooks(data)
      setCurrentBook(data[1])
      setLoading(false)
    })
    .catch((error) => {
      console.error(error)
      setLoading(false)
    })
  }

  // Add new book
  function addBook(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const form = event.target as HTMLFormElement

    const title = (form.elements.namedItem("title") as HTMLInputElement).value
    const author = (form.elements.namedItem("author") as HTMLInputElement).value

    if (!title || !author) {
      alert("Please fill in both fields.")
      return
    }

   fetch('http://localhost:3000/add-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        author,
      }),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to add new book')
          }
          return response.json()
        })
        .then((data) => {
          console.log("New book added:", data)
          alert(`Book added: ${data.title} by ${data.author}`)
          form.reset() 

          // refresh books
          fetchBooks()
        })
        .catch((error) => {
          console.error(error)
        })
}


function addBookClicked(){
  setShowAddBook(!showAddBook)
}

// display one book
function displayBookPage(event) {
  const bookData = JSON.parse(event.currentTarget.dataset.book)
  setCurrentBook(bookData)
  setShowCurrentBook(!showCurrentBook)
}


// Delete books
function deleteBook(event) {
  const id = event.target.dataset.index
  const bookTitle = event.target.dataset.title

  fetch(`http://localhost:3000/delete-book/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete book')
        }
        return response.json()
      })
      .then((data) => {
        console.log(`Book deleted: ${bookTitle}`)
        alert(`Book deleted: ${bookTitle}`)

        // refresh books
        fetchBooks()
      })
      .catch((error) => {
        console.error(error)
      })
}

function displayEditBook() {
  setShowEditBook(!showEditBook)
  console.log(showEditBook)
}

function editBook(event) {
  event?.preventDefault()

  const form = event.target as HTMLFormElement

  const id = (form.elements.namedItem("updateTitle") as HTMLInputElement).dataset.id?.toString()
  const title = (form.elements.namedItem("updateTitle") as HTMLInputElement).value
  const author = (form.elements.namedItem("updateAuthor") as HTMLInputElement).value

  if (!title || !author) {
    alert("Please fill in both fields.")
    return
  }
  console.log(id, title, author)
 fetch(`http://localhost:3000/update-book/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      author,
    }),
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to edit book')
        }
        return response.json()
      })
      .then((data) => {
        console.log("Book edited:", title, author)
        alert(`Book edited: ${title} by ${author}`)
        form.reset() 

        // refresh books
        fetchBooks()
      })
      .catch((error) => {
        console.error(error)
      })
}

function borrowBook(event) {
  event?.preventDefault()
  const id = JSON.parse(event.currentTarget.dataset.id)
  console.log(`owner-${id}`)
  const form = document.getElementById("borrowBookForm") as HTMLFormElement
  const ownerInput = document.getElementById(`owner-${id}`) as HTMLInputElement
  const owner = ownerInput?.value


  if (!owner) {
    alert("Please fill in your name.")
    return
  }

 fetch(`http://localhost:3000/borrow-book/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      owner,
    }),
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to edit book')
        }
        return response.json()
      })
      .then((data) => {
        console.log("Book borrowed by: ", owner)
        alert(`Book borrowed by: ${owner}. Please return it in a week.`)
        form.reset() 

        // refresh books
        fetchBooks()
      })
      .catch((error) => {
        console.error(error)
      })

}

function returnBook(event) {
  const title = event.currentTarget.dataset.title
  console.log(title)
  fetch(`http://localhost:3000/return-book`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to return book')
        }
        return response.json()
      })
      .then((data) => {
        console.log("Book returned: ", title)
        alert(`Book returned: ${title}. Please come to the library again.`)


        // refresh books
        fetchBooks()
      })
      .catch((error) => {
        console.error(error)
      })
}

return (
  <div>
    {loading && <p>Loading books...</p>}
    {!loading && (
      <>
        <h1>Megs Library Books</h1>
        <table>
          <thead>
            <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Delete</th>
            <th>Borrow</th>
            <th>Return</th>
            </tr>
          </thead>
          <tbody>
          {books.map((book) => (
            <tr key={book.id}>
            <td data-book={JSON.stringify(book)} className="bookTitle" onClick={displayBookPage}><strong>{book.title}</strong></td>
            <td>{book.author}</td>

            {/* delete book */}
            <td><i className="fa-solid fa-trash" data-index={book.id} data-title={book.title} onClick={deleteBook}></i></td>
            
            {/* borrow book */}
            {book.owner === "library" &&
            <td>
            <form id="borrowBookForm" className="flex-row">
              <input type="text" id={`owner-${book.id}`} name="owner" placeholder="What is your name?" className="owner"></input>
              <i className="fa-solid fa-arrow-down fa-xl margin" onClick={borrowBook} data-id={book.id} title="Borrow book"></i>
            </form>
            </td>
            }
            {book.owner !== "library" && <td></td>}

            {/* return book */}
            {book.owner !== "library" &&
            <td><i className="fa-solid fa-arrow-up fa-xl margin" onClick={returnBook} data-title={book.title} title="Return book"></i></td>
            }
            </tr>
          ))}
          </tbody>
        </table>
      </>
    )}

    <div>
    <i className="fa-solid fa-plus add-book fa-xl margin" onClick={addBookClicked} title="Add new book"></i>
    </div>

    {/* add new book */}
    { showAddBook && (
      <AddNewBook addBook={addBook} ></AddNewBook>
    )}

    {/* show one book / edit book */}
    {showCurrentBook && currentBook && <BookPage showEditBook={showEditBook} displayEditBook={displayEditBook} book={currentBook} editBook={editBook}></BookPage>}
  </div>
)
} 
