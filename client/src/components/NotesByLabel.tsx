import { FC, } from "react";
import {  FaTrashAlt } from "react-icons/fa";

interface Note {
    _id?: number | string;
    title: string;
    label: string;
    text: string;
    backgroundColor: string;
    textColor: string;
}

interface Props {
    notes: Note[];
    onDelete: (_id: string | number) => void;
}

export const NotesByLabel: FC<Props> = ({ notes, onDelete, }) => {
    return <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            { notes.map((note) => (
                <div
                    key={ note._id }
                    className="flex flex-col justify-between p-4 rounded shadow-md cursor-pointer relative"
                    style={ { backgroundColor: note.backgroundColor, color: note.textColor } }
                >
                    <div className="">
                        <h3 className="text-xl font-bold">{ note.title }</h3>
                        <p className="text-sm italic">{ note.label }</p>
                        <p className="mt-2">{ note.text }</p>
                    </div>
                    <div className="mt-4 flex justify-around text-xl absolute top-0 right-2">
                        <button
                            onClick={ () => onDelete(note._id as string | number) }
                            className="flex items-center space-x-1 "
                        >
                            <FaTrashAlt />
                        </button>
                        
                    </div>
                </div>
            )) }
        </div>
    </>
}