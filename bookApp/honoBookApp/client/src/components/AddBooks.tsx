export default function AddNewBook({addBook}) {
    return (
    <form name="addNewBook" onSubmit={addBook}>
    <input name="title" className="input-margin" placeholder="Book Title"></input>
    <input name="author" className="input-margin" placeholder="Author"></input>
    <button className="addBook" type="submit"><i className="fa-solid fa-plus"></i></button>
    </form>
    )
}

