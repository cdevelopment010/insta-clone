import { useEffect, useState } from "react"

import Firebase from "../Firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import '../Styles/createPost.css'

export default function CreatePost({showCreate}) {

    const [description, setDescription] = useState("");
    const postsCollectionRef = collection(Firebase.db, 'posts');

    // useEffect(() => {
    //     console.log("re-render create post");
    // }, [description])

    const addPost = async() => {
        try {
            await addDoc(postsCollectionRef, {
                description: description,
                created: serverTimestamp(),
                updated: serverTimestamp(), 
                userid: Firebase.auth.currentUser.uid
            })
            alert("Post created.")
            setDescription("");
            showCreate(); 
        } catch(error) {
            console.error(error)
        }
    }

    return(
        <div className="create-post-container">
            <div className="backdrop" onClick={showCreate}></div>
            <div className="create-post-form">
                {/* <input type="text" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} /> */}
                <input type="file" className="m-0 file-input"/>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="align-self-stretch description"></textarea>
                <button onClick={addPost} className="btn">Create post!</button>
            </div>
        </div>
    )
}