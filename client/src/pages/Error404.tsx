import { FC } from "react"

interface Props { }

export const Error404: FC<Props> = () => {
    return(<>
        <div className=" flex flex-col items-center justify-center">
            <span>404</span>
            <div>Page Not Found</div>
        </div>
    </>
    )
}