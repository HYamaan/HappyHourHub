import {useState} from 'react';

const Topic = ({setTopicId, setCurrentChat}) => {
    const [options, setOptions] = useState([
        {"1": "Teknik Destek"},
        {"2": "Fatura Sorunu"},
        {"3": "Ürün İade"},
        {"4": "Diğer"}
    ]);
    const [text, setText] = useState('');
    const [selectTopic, setSelectTopic] = useState("");


    const filteredOptions = options.filter((option) => {
        const optionValue = Object.values(option)[0];
        return optionValue.toLowerCase().includes(text.toLowerCase());
    });
    const handleTopicClick = (key) => {
        setCurrentChat(null)
        setSelectTopic(key)
    }

    return <div className="max-h-[calc(100vh-6.8rem)] overflow-y-auto mt-4 pr-1">


        <div className="relative text-gray-600 focus-within:text-gray-400 mb-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
                       viewBox="0 0 24 24" className="w-6 h-6"><path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              </span>
            <input type="search" name="search"
                   className="py-2 w-full text-sm text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                   placeholder="Search..." autoComplete="off" onChange={(e)=>setText(e.target.value)}/>
        </div>
        <div className="flex flex-col items-center justify-content  ">

            {filteredOptions.map((option) => {
                const optionKey = Object.keys(option)[0];
                const optionValue = option[optionKey];

                return <div key={optionKey}
                            className={`w-full text-lg  mt-1 py-3 cursor-pointer ${selectTopic === optionKey ? "bg-stateGray hover:bg-cadetGray font-bold" : "bg-white hover:bg-tertiary"}`}
                            onClick={() => {
                                handleTopicClick(optionKey)
                            }}>
                    <div className="flex ml-10" onClick={() => {
                        setTopicId(optionKey)
                    }}>
                        <span className="mr-3 font-bold">#</span>
                        <span>{optionValue}</span>
                    </div>
                </div>;
            })}
        </div>
    </div>


}
export default Topic;