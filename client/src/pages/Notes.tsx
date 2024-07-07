import { useEffect, useState } from "react";
import { NotesList } from "../components/NotesList";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/Provider";
import { toast } from "react-toastify";

interface Note {
    id: number | string;
    title: string;
    label: string;
    text: string;
    backgroundColor: string;
    textColor: string;
}
interface Props {}

export const Notes: React.FC<Props> = () => {
    const [notes, setNotes] = useState<Note[] >([]);
    const navigate = useNavigate();
    const { isLoggedIn, userId } = useAuth();
    if (!isLoggedIn) {
        navigate("/login")
    }

    const handleAddNote = async (note: Note) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(note),
            });
    
            if (response.ok) {
                toast.success("note added")
                handleFatchNotes();
            }
        } catch (err) {
            console.error("Error in adding the note:", err);
        }
        console.log("New note is:- ",note)
    };

    const handleFatchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/${userId}`, {
                method: "GET",
            });
    
            if (response.ok) {
                const allNotes = await response.json()
                setNotes(allNotes)
                console.log(allNotes);
            }
        } catch (err) {
            console.error("Error note fatching:", err);
        }
    }
    useEffect(()=>{
        handleFatchNotes()
    },[])

    const handleDelete = async (id: number | string ) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/${userId}/${id}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                toast("Note deleted")
                handleFatchNotes();
            }
        } catch (err) {
            console.error("Error note fatching:", err);
        }
    };
    
    const handleUpdate= async (id: number | string, note?: Note, bg?: string, textColor?: string)=>{
        try {
            if( id && note ){
                const response = await fetch(`http://localhost:5000/api/notes/${userId}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title:note?.title,
                        label:note?.label,
                        text:note?.text,
                    }),
                });
                if (response.ok) {
                    toast.success("Note updated")
                    handleFatchNotes();
                }
            }
            if(id && bg){
                const response = await fetch(`http://localhost:5000/api/notes/${userId}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        backgroundColor:bg,
                    }),
                });
                if (response.ok) {
                    handleFatchNotes();
                }
            }
            if(id && textColor){
                const response = await fetch(`http://localhost:5000/api/notes/${userId}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        textColor:textColor,
                    }),
                });
                if (response.ok) {
                    handleFatchNotes();
                }
            }
    
        } catch (err) {
            console.error("Error in Updating the note:", err);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notes</h1>
            <NotesList
                notes={ notes }
                onAddNote={ handleAddNote }
                onDelete={ handleDelete }
                onUpdate = {handleUpdate}
            />
        </div>
    );
};
