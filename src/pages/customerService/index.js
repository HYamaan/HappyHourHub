import {useState, useRef} from 'react';

const CustomerService = () => {
    const [text, setText] = useState('');
    const inputRef = useRef(null);
    const [options, setOptions] = useState([
        {"1": "Teknik Destek"},
        {"2": "Fatura Sorunu"},
        {"3": "Ürün İade"},
        {"4": "Diğer"}
    ]);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const enteredText = event.target.value;
            // Burada veriyi işleyebilirsiniz
            setText(enteredText);
            inputRef.current.value = '';
        }
    };
    return <>
        <div className="flex flex-row h-[calc(100vh_-_24px)]">
            <div className="basis-2/12 bg-secondary">
                <div className="flex items-center m-2">
                    <input
                        className="  border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text" placeholder="Type your message..."
                        ref={inputRef} onKeyDown={handleKeyDown}
                    />
                    <i className="fas fa-paper-plane"></i>
                </div>

                <div className="flex flex-col items-center justify-content  ">

                    {options.map((option, index) => {
                        const optionKey = Object.keys(option)[0];
                        const optionValue = option[optionKey];

                        return <div key={optionKey} className="w-full text-lg bg-white hover:bg-tertiary mt-1 py-3 cursor-pointer">
                            <div className="flex ml-10">
                                <span className="mr-3 font-bold">#</span>
                                <span>{optionValue}</span>
                            </div>
                        </div>;
                    })}
                </div>

            </div>
            <div className="basis-3/12 bg-yellow-300">
                <div className="flex items-center m-2">
                    <input
                        className="  border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text" placeholder="Kullancı ismini veya mail ara"
                        ref={inputRef} onKeyDown={handleKeyDown}
                    />
                    <i className="fas fa-paper-plane"></i>
                </div>
                <div className="flex flex-col items-center justify-content  ">
                    <div  className="flex justify-between items-center w-full text-lg bg-white hover:bg-tertiary mt-1 py-4 cursor-pointer">
                        <div className="flex flex-col ml-10">
                            <span className="mr-3 font-bold">Hakan</span>
                            <span className="text-xs">hakan@gmail.com</span>
                        </div>
                        <div className="mr-7 max-w-[11rem]">
                            { "asfasfasfdsafsafsafsafsa...dsdfasfasdffsafs".slice(0,22)+"..."}
                        </div>
                    </div>
                    <div  className="flex justify-between items-center w-full text-lg bg-white hover:bg-tertiary mt-1 py-4 cursor-pointer">
                        <div className="flex flex-col ml-10">
                            <span className="mr-3 font-bold">Hakan</span>
                            <span className="text-xs">hakan@gmail.com</span>
                        </div>
                        <div className="mr-7 max-w-[11rem]">
                            { "asfasfasfdsafsafsafsafsa...dsdfasfasdffsafs".slice(0,22)+"..."}
                        </div>
                    </div>
                </div>
            </div>
            <div className="basis-7/12 bg-red-800"></div>
        </div>
    </>

}
export default CustomerService
