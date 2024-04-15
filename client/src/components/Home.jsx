import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/notes`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const fetchedNotes = await response.json();
      setNotes(fetchedNotes);
    } catch (err) {
      console.log(err);
    }
  }

  async function addNote() {
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newNote)
      });

      const createdNote = await response.json();

      setNotes(prevNotes => [...prevNotes, createdNote]);
      setNewNote({ title: "", content: "" });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteNote(id) {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE"
      });

      setNotes(prevNotes => prevNotes.filter(noteItem => noteItem.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewNote(prevNote => ({ ...prevNote, [name]: value }));
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    await addNote();
  }

  return (
    <div>
      <Header />
      <div className="createArea">
        <form onSubmit={handleFormSubmit} className="areaForm">
          <input
            name="title"
            onChange={handleInputChange}
            value={newNote.title}
            placeholder="Title"
          />
          <textarea
            name="content"
            onChange={handleInputChange}
            value={newNote.content}
            placeholder="Take a note..."
            rows="3"
          />
          <button type="submit">Keep</button>
        </form>
      </div>
      <div>
        {notes.map((noteItem) => (
          <div className="note" key={noteItem.id}>
            <h1>{noteItem.title}</h1>
            <p>{noteItem.content}</p>
            <button onClick={() => deleteNote(noteItem.id)}>DELETE</button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Home;