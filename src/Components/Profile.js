import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export default function Profile() {

    const [user, setUser] = useState(null); 
    const userCollectionRef = collection(Firebase.db, 'users'); 
    
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

    return(
        <div>
            Profile Page for...{user?.username}
        </div>
    )
}