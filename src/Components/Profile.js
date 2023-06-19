import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc, doc, where, query } from "firebase/firestore";
import {getDownloadURL, uploadBytes, ref} from "firebase/storage"

export default function Profile() {

    const [user, setUser] = useState(null); 
    const userCollectionRef = collection(Firebase.db, 'users'); 
    const [username, setUsername] = useState(""); 
    const [fullName, setFullName] = useState(""); 
    const [image,setImage] = useState([]);
    
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(Firebase.auth, (user) => {
            if (user) {
              getData(); 
            } else {
                
            }
        });

        const getData = async () => {
            let authUid = Firebase?.auth?.currentUser?.uid || null;
            const userData = query(userCollectionRef, where("userid", "==", authUid));
            const querySnapshop = await getDocs(userData);
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id};
                setUser(data);  
            })
        
        }
      
        return () => unsubscribe(); 
    },[userCollectionRef])

    useEffect(() => {
        setFullName(user?.fullName);
        setUsername(user?.username);
        console.log("UseEffect in Profile: This sets states of username and fullname. Should only fire once after user is set.")
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
                <input type="file" accept="image/jpeg, image/png" onChange={(e) => {setImage(e.target.files)}}/>
                <button type="button" onClick={updateDetails}>Update details</button>
            </div>
        </div>
    )
}