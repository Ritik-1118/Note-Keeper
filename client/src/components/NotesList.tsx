import React, { FC, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { IoIosColorPalette } from "react-icons/io";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { useAuth } from "../utils/Provider";

interface Note {
    _id?: number | string;
    title: string;
    label: string;
    text: string;
    backgroundColor: string;
    textColor: string;
}
// (note: Note) => Promise<void>
interface Props {
    notes: Note[];
    onAddNote: (note: Note) => Promise<void>
    onDelete: (_id: string | number) => void;
    onUpdate: ( _id?: number | string, note?: Note, bg?:string, textColor?:string) => void;
}

export const NotesList: FC<Props> = ({
    notes,
    onAddNote,
    onDelete,
    onUpdate,
}) => {
    const {userId, searchedTitle} = useAuth();
    // const {searchedNote, setSearchedNote} = useState(null);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [addNote, setAddNote] = useState(false);
    const [showBackgrounds,setShowBackgrounds] = useState<boolean>(false);
    const [showTextColors,setShowTextColors] = useState<boolean>(false);
    const [bgClickedId,setBgClickedId] = useState<string | number>();
    const [textColorClickedId,setTextColorClickedId] = useState<string | number>();
    const [newNote, setNewNote] = useState<Note>({
        _id: undefined,
        title: "",
        label: "",
        text: "",
        backgroundColor: "#fff",
        textColor: "#000",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewNote({
            ...newNote,
            [name]: value,
        });
    };

    const handleSearchedNote = async () =>{
        console.log(searchedTitle)
        try {
            const response = await fetch(`https://note-keeper-7bu3.onrender.com/api/notes/searchByTitle/${userId}/${searchedTitle}`, {
                method: "GET",
            });
    
            if (response.ok) {
                const notes = await response.json()
                // setSearchedNote(notes)
                console.log("searched note ::::===",notes);
            }
        } catch (err) {
            console.error("Error note fatching:", err);
        }
    }
    useEffect(()=>{
        handleSearchedNote();
    },[searchedTitle])

    const handleAddNote = () => {
        if (newNote.title && newNote.text) {
            onAddNote({ ...newNote, _id: Date.now() });
            setAddNote(false);
        }
    };
    const handleNoteClick = (note: Note) => {
        setSelectedNote(note);
    };
    const handleCloseModal = () => {
        setSelectedNote(null);
    };

    const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (selectedNote) {
            const { name, value } = e.target;
            setSelectedNote({
                ...selectedNote,
                [name]: value,
            });
        }
    };

    const handleSaveChanges = () => {
        if (selectedNote && selectedNote._id !== undefined) {
            onUpdate( selectedNote._id, selectedNote);
            setSelectedNote(null);
        }
    };


    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                    className="flex items-center justify-center w-full p-4 rounded shadow-md cursor-pointer" 
                    onClick={() => setAddNote(true)}
                >
                    <FaPlus className="text-xl mx-2"/>
                    <span className="text-xl">Add New</span>
                </div>
                { notes.map((note) => (
                    <div
                        key={ note._id }
                        className="flex flex-col justify-between p-4 rounded shadow-md cursor-pointer"
                        style={ { backgroundColor: note.backgroundColor, color: note.textColor } }
                        
                    >
                        <div className="" onClick={ () => handleNoteClick(note) }>
                            <h3 className="text-xl font-bold">{ note.title }</h3>
                            <p className="text-sm italic">{ note.label }</p>
                            <p className="mt-2">{ note.text }</p>
                        </div>
                        {showBackgrounds && note._id === bgClickedId && (
                            <div className="flex items-center justify-around">
                                <span className="text-2xl text-rose-700">Bg:</span>
                                <div className="border rounded-full w-8 h-8 bg-gray-800 cursor-pointer" onClick={()=>onUpdate(note._id as string | number, undefined,"black")}></div>
                                <div className="border rounded-full w-8 h-8 bg-white cursor-pointer"onClick={()=>onUpdate(note._id as string | number, undefined,"white")}></div>
                                <div className="border rounded-full w-8 h-8 bg-pink-500 cursor-pointer"onClick={()=>onUpdate(note._id as string | number, undefined,"pink")}></div>
                                <div className="border rounded-full w-8 h-8 bg-green-500 cursor-pointer"onClick={()=>onUpdate(note._id as string | number, undefined,"green")}></div>
                                <CgClose className="text-xl" onClick={()=>setShowBackgrounds(false)}/>
                            </div>
                        )}
                        {showTextColors && note._id === textColorClickedId && (
                            <div className="flex items-center justify-around">
                            <span className="text-xl text-green-900">Color:</span>
                            <div className="border rounded-full w-8 h-8 bg-gray-800 cursor-pointer" onClick={()=>onUpdate(note._id as string | number, undefined, undefined,"black")}></div>
                            <div className="border rounded-full w-8 h-8 bg-white cursor-pointer"onClick={()=>onUpdate(note._id as string | number, undefined, undefined,"white")}></div>
                            <div className="border rounded-full w-8 h-8 bg-pink-500 cursor-pointer"onClick={()=>onUpdate(note._id as string | number, undefined, undefined,"pink")}></div>
                            <div className="border rounded-full w-8 h-8 bg-green-500 cursor-pointer"onClick={()=>onUpdate(note._id as string | number, undefined, undefined,"green")}></div>
                            <CgClose className="text-xl" onClick={()=>setShowTextColors(false)}/>
                        </div>
                        )}
                        <div className="mt-4 flex justify-around text-xl">
                            <button
                                onClick={ () => onDelete(note._id as string | number) }
                                className="flex items-center space-x-1 text-red-500"
                            >
                                <FaTrashAlt />
                            </button>
                            <button
                                onClick={ () => {
                                    setShowBackgrounds(!showBackgrounds)
                                    setBgClickedId(note._id)
                                    onUpdate(note._id as string | number)
                                }}
                                className="flex items-center space-x-1 text-green-500"
                            >
                                <IoIosColorPalette />
                            </button>
                            <button
                                onClick={ () => {
                                    setShowTextColors(!showTextColors)
                                    setTextColorClickedId(note._id)
                                    onUpdate(note._id as string | number)
                                }}
                                className="flex items-center space-x-1 text-yellow-500"
                            >
                                <GoPencil />
                            </button>
                        </div>
                    </div>
                )) }
            </div>
            {addNote && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold mb-4">Add New Note</h2>
                            <span 
                                className="text-2xl mb-4 cursor-pointer" 
                                onClick={() =>setAddNote(false)}
                            ><MdOutlineCloseFullscreen /></span>
                        </div>
                        <input
                            type="text"
                            name="title"
                            value={ newNote.title }
                            onChange={ handleInputChange }
                            placeholder="Title"
                            className="block w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            name="label"
                            value={ newNote.label }
                            onChange={ handleInputChange }
                            placeholder="Label"
                            className="block w-full p-2 mb-2 border rounded"
                        />
                        <textarea
                            name="text"
                            value={ newNote.text }
                            onChange={ handleInputChange }
                            placeholder="Text"
                            className="block w-full p-2 mb-2 border rounded"
                        />
                        <button
                            onClick={ handleAddNote }
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Add Note
                        </button>
                    </div>
                </div>
            )}
            { selectedNote && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
                        <input
                            type="text"
                            name="title"
                            value={ selectedNote.title }
                            onChange={ handleModalInputChange }
                            placeholder="Title"
                            className="block w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            name="label"
                            value={ selectedNote.label }
                            onChange={ handleModalInputChange }
                            placeholder="Label"
                            className="block w-full p-2 mb-2 border rounded"
                        />
                        <textarea
                            name="text"
                            value={ selectedNote.text }
                            onChange={ handleModalInputChange }
                            placeholder="Text"
                            className="block w-full p-2 mb-2 border rounded"
                        />
                        <div className="flex items-center justify-end mt-4">
                            <button
                                onClick={ handleSaveChanges }
                                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={ handleCloseModal }
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
};

