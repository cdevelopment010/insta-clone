import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {getDownloadURL, uploadBytes, ref} from "firebase/storage"

export default function Profile() {

    const [user, setUser] = useState(null); 
    const userCollectionRef = collection(Firebase.db, 'users'); 
    const [username, setUsername] = useState(""); 
    const [fullName, setFullName] = useState(""); 
    const [image,setImage] = useState([]);

    
    useEffect(() => {
        const getData = async () => {
            const usersData = await getDocs(userCollectionRef); 
            const userData = usersData.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(x => x.userid === Firebase.auth?.currentUser?.uid);
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
        
        const downloadUrls = [];
        const fileRef = ref(Firebase.storage, `users/${Firebase.auth.currentUser.uid}_${image[0]?.name}`); 
        await uploadBytes(fileRef, image[0]); 
        const downloadUrl = await getDownloadURL(fileRef); 
        downloadUrls.push(downloadUrl); 

        await updateDoc(doc(userCollectionRef,user.id), {
            fullName: fullName, 
            username: username,
            profileImgUrl: downloadUrls
        })
    }

    return(
        <div>
            Profile Page for...{user?.username}

            <div>
                
                <input type="text" placeholder="fullname.." value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input type="text" placeholder="username.." value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="file" onChange={(e) => {setImage(e.target.files)}}/>
                <button type="button" onClick={updateDetails}>Update details</button>
            </div>
        </div>
    )
}