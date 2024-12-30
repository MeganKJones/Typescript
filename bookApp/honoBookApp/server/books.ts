import { type Context, Hono } from "hono";
import { Book } from "../types/book.ts";
import  { pool } from '../db.ts'

const bookRoutes = new Hono();


// get all books
bookRoutes.get('/books', async (c) => {
    try {
        const result = await pool.query("SELECT * FROM books");
        return c.json(result.rows);
    } catch (error) {
        console.error(error);
        return c.text("Failed to fetch books", 500);
    }
})

// get one book
bookRoutes.get("/book/:id", async (c) => {
    const bookId = c.req.param("id")
    try {
        const result = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);

        if (result.rows.length === 0) {
        return c.text("Book not found", 404);
        }

        return c.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return c.text("Failed to fetch book", 500);
    }
})

// add a book
bookRoutes.post("/add-book", async (c) => {
    const body = await c.req.json()
    const owner = body.owner ?? "library"

    try {
        const result = await pool.query("INSERT INTO books (title, author, owner) VALUES ($1, $2, $3) RETURNING *",
            [body.title, body.author, owner]
        );

        return c.json(result.rows[0], 201)
    } catch (error) {
        console.log(error)
        return c.text("Failed to add book", 500)
    }
})

// delete a book
bookRoutes.delete("/delete-book/:id", async (c) => {
    const bookId = c.req.param("id")

    try {
        const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [bookId])

        if (result.rows.length === 0) {
            return c.text("Book not found", 404)
        }

        return c.json({message: "Book deleted."})
    } catch (error) {
        console.log(error)
        return c.text("Failed to delete book", 500)
    }
})

// update a book
bookRoutes.put("/update-book/:id", async (c) => {
    const bookId = c.req.param("id")
    const body = await c.req.json()

    try {
        const result = await pool.query("UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *",
            [body.title, body.author, bookId])

        if (result.rows.length === 0) {
            return c.text("Book not found", 404)
        }

        return c.json({message: "Book updated."})
    } catch (error) {
        console.error(error)
        return c.text("Failed to update book", 500)
    }
})

// borrow from the library
bookRoutes.put("/borrow-book/:id", async (c) => {
    const bookId = c.req.param("id")
    const body = await c.req.json()
    try {
        const result = await pool.query(
        "UPDATE books SET owner = $1 WHERE id = $2 RETURNING *",
        [body.owner, bookId]
        );

        if (result.rows.length === 0) {
        return c.text("Book not found", 404);
        }

        return c.json({ message: `${body.owner} has borrowed ${result.rows[0].title}. Please return it within 5 days.` });
    } catch (error) {
        console.error(error);
        return c.text("Failed to borrow book", 500);
    }
}) 

// return book
bookRoutes.put("/return-book",async (c) => {
const body = await c.req.json()

try {
    const result = await pool.query("UPDATE books SET owner = 'library' WHERE LOWER(title) = LOWER($1) RETURNING *", 
        [body.title]
    )

    if (result.rows.length === 0) {
        return c.text("Book not found.", 404)
    }

    return c.json({message: `Thank you for returning ${result.rows[0].title}, ${result.rows[0].owner}. Visit again soon.`})
}
catch (error) {
    console.error(error)
    return c.text("Failed to return book", 500)
}
})

export default bookRoutes;