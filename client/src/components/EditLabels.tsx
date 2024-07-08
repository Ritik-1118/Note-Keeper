import { FC, useEffect, useState } from "react"
import { NotesByLabel } from "./NotesByLabel"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Provider";


interface Props { }
type ByLabel = {
    labelName:string,
    notes:[]
}

export const EditLabels: FC<Props> = () => {
    const [allNotesByLabel, setAllNotesByLabel] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn, userId } = useAuth();
    if (!isLoggedIn) {
        navigate("/login")
    }


    const handleFatchNotes = async () => {
        try {
            const response = await fetch(`https://note-keeper-7bu3.onrender.com/api/notes/getAllNotesByLabel/${userId}`, {
                method: "GET",
                headers:{
                    "Content-Type":"application/json",
                },
            });
    
            if (response.ok) {
                const allNotes = await response.json()
                setAllNotesByLabel(allNotes)
                console.log(allNotes);
            }
        } catch (err) {
            console.error("Error note fatching:", err);
        }
    }
    useEffect(()=>{
        handleFatchNotes()
    },[userId]);

    const handleDelete = async (id: number | string ) => {
        try {
            const response = await fetch(`https://note-keeper-7bu3.onrender.com/api/notes/${userId}/${id}`, {
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
    return(<>
        <div className=" w-full pt-10 pl-4">
            <div className="text-3xl font-serif my-2">Notes by Labels</div>
            <div className="border w-full">
                {allNotesByLabel.map((notesByLabel: ByLabel)=>(
                    <div className="" key={undefined}>
                        <div className="flex items-center py-2">
                            <div className="border py-2 pl-2 w-40 bg-gray-500 text-xl ">{notesByLabel.labelName.toUpperCase()}</div>
                            <div className="w-0 h-0 ml-[-2px] border-t-[20px] border-t-transparent border-b-[25px] border-b-transparent border-l-[40px] border-l-gray-500"></div>
                        </div>
                        <div>
                            <NotesByLabel 
                                notes = {notesByLabel.notes}
                                onDelete = {handleDelete}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
    )
}