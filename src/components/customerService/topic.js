
import {useState, useRef} from 'react';
const Topic = ({setTopicId,setCurrentChat})=>{
    const [options, setOptions] = useState([
        {"1": "Teknik Destek"},
        {"2": "Fatura Sorunu"},
        {"3": "Ürün İade"},
        {"4": "Diğer"}
    ]);
    const [text, setText] = useState('');
    const inputRef = useRef(null);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const enteredText = event.target.value;
            // Burada veriyi işleyebilirsiniz
            setText(enteredText);
            inputRef.current.value = '';
        }
    };


    return  <div className="max-h-[calc(100vh-6.8rem)] overflow-y-auto mt-4 pr-1">

            <div className="flex items-center m-2">
                <input
                    className="  border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text" placeholder="Type your message..."
                    ref={inputRef} onKeyDown={handleKeyDown}
                />
                <i className="fas fa-paper-plane"></i>
            </div>

            <div className="flex flex-col items-center justify-content  ">

                {options.map((option) => {
                    const optionKey = Object.keys(option)[0];
                    const optionValue = option[optionKey];

                    return <div key={optionKey} className="w-full text-lg bg-white hover:bg-tertiary mt-1 py-3 cursor-pointer"
                    onClick={()=>setCurrentChat(null)}>
                        <div className="flex ml-10" onClick={()=>{setTopicId(optionKey)}}>
                            <span className="mr-3 font-bold">#</span>
                            <span>{optionValue}</span>
                        </div>
                    </div>;
                })}
            </div>
        </div>


}
export default Topic;