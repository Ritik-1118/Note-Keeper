import { FC } from "react"

interface Props { }

export const Error404: FC<Props> = () => {
    return(<>
        <div className=" flex flex-col items-center justify-center w-full h-screen">
            <div className=" items-center text-6xl">
                <span className="text-7xl">404</span>
            </div>
            <div className=" text-3xl">Page Not Found</div>
        </div>
    </>
    )
}