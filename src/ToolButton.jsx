import {useRef, useState} from "react";

export default function ({ src , onClick}) {
    return (
        <div onClick={onClick} className="px-2 w-12 h-12 bg-white border-2 border-blue-500 rounded-full hover:shadow-xl flex justify-center items-center">
            <img src={src}/>
        </div>
    );
}

