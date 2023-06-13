import { useState } from "react"

import Firebase from "../Firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export default function CreatePost() {

    const [description, setDescription] = useState("");
    const postsCollectionRef = collection(Firebase.db, 'posts');

    const addPost = async() => {
        try {
            await addDoc(postsCollectionRef, {
                description: description,
                created: serverTimestamp(),
                updated: serverTimestamp(), 
                userid: Firebase.auth.currentUser.uid
            })
        } catch(error) {
            console.error(error)
        }
    }

    return(
        <div>
            Create post....
        </div>
    )
}