
import {format} from 'timeago.js';
const Messages =({message,own,className})=>{


    return <>
        <div className={`flex flex-col ${own ?"items-end" : "items-start"} mx-2`}>
            <div className="max-w-[80%]">
                <p className={`p-[10px] rounded-[20px] bg-primary text-tertiary inline-block 
                ${own ? "bg-tertiary !text-secondary border-[1px] border-primary" : "border-[1px] border-tertiary"}`}>
                    {message?.text}
                </p>
            </div>
            <div className={`text-xs my-2 ${className}`}>{format(message?.createdAt)}</div>
        </div>
    </>
}
export default Messages;