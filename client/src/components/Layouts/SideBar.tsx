import { FC } from "react"
import { NavLink } from "react-router-dom";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";


interface Props { }

export const SideBar: FC<Props> = () => {
    return(<>
        <div className=" w-1/5 h-full pt-2 hidden lg:block">
            <NavLink to="/" >
                <div className=" flex items-center w-full hover:border border hover:bg-gray-200 rounded-r-full py-3 my-4 px-6 text-2xl">
                    <RiLightbulbFlashLine className=" mr-10"/>
                    Notes
                </div>
            </NavLink>
            <NavLink to="/editLabels" >
                <div className=" flex items-center w-full hover:border border hover:bg-gray-200 rounded-r-full py-3 my-4 px-6 text-2xl">
                    <HiOutlinePencilSquare className=" mr-10"/>
                    Labels
                </div>
            </NavLink>
            <NavLink to="#" >
                <div className=" flex items-center w-full hover:border border hover:bg-gray-200 rounded-r-full py-3 my-4 px-6 text-2xl">
                    <CiSettings className=" mr-10"/>
                    Setting
                </div>
            </NavLink>
            
        </div>
    </>
    )
}