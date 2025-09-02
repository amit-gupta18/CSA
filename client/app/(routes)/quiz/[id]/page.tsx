// get the dynamic route where the id is passed as the dynamic route . 
"use client"
import { useParams } from "next/navigation"

// interface props {
//     params : {
//         id: string;
//     };
// }

const page = () => {
    const params = useParams();
    console.log("params are : ", params);
    return (
        // get the dynamic data passed in the url
        <div>
            <div>Quiz page: {params.id}</div>
        </div>
    )
}

export default page