import PacmanLoader from "react-spinners/PacmanLoader";
import React from "react";

const LoadingPacman =(props)=>{

    return <React.Fragment>
        <div className={`flex justify-center items-center ${props.height} w-screen bg-secondary ${props.children}`}>
            <PacmanLoader
                color="#fff200"
                cssOverride={{}}
                loading
                margin={2}
                size={props.size}
                speedMultiplier={1}
            />
        </div>
    </React.Fragment>

}
export default LoadingPacman;