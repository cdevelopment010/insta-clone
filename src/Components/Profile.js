import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export default function Profile() {

    const [user, setUser] = useState(null); 
    const userCollectionRef = collection(Firebase.db, 'users'); 
    const [username, setUsername] = useState(""); 
    const [fullName, setFullName] = useState(""); 

    
    useEffect(() => {
        const getData = async () => {
            const usersData = await getDocs(userCollectionRef); 
            const userData = usersData.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(x => x.userid == Firebase.auth.currentUser.uid);
            if (userData.length > 0 ) {
                setUser(userData[0]);
            }
        }
        getData();
    },[])

    useEffect(() => {
        setFullName(user?.fullName);
        setUsername(user?.username);
    }, [user])

    const updateDetails = async () => {
        console.log("Update details");
        console.log("doc.id", user.id);
    }

    return(
        <div>
            Profile Page for...{user?.username}

            <div>
                
                <input type="text" placeholder="fullname.." value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input type="text" placeholder="username.." value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="file" />
                <button type="button" onClick={updateDetails}>Update details</button>
            </div>
        </div>
    )
}