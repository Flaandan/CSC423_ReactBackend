import React, {useEffect, useState} from "react";
import { useLocalState } from "../hooks/useLocalStorage";
import { JWT_KEY } from "../hooks/useLocalStorage";
import { decodeJWT } from "../utils/decodeJWT";


const ViewCourses = () => {
    const [jwt, setJwt] = useLocalState("", JWT_KEY);
   const [username, setUsername] = useState("")
    
   
   useEffect(() => {
        if (jwt) {
            //Get username from JWT
            const decodedJWT = decodeJWT(jwt).sub;
            setUsername(decodedJWT);

            
            }
      }, [jwt]);

  return (
    <div>
      <h2>My Courses</h2>
      {/*GET /api/v1/users/:username/courses*/}
      
      {username}
      
    </div>
  );
};

export default ViewCourses;