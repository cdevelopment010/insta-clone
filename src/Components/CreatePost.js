import { useEffect, useState } from "react"

import Firebase from "../Firebase"
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import '../Styles/createPost.css'

export default function CreatePost({showCreate}) {

    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const postsCollectionRef = collection(Firebase.db, 'posts');

    useEffect(() => {
        console.log("Image", image);
        console.log("UseEffect in CreatePost. Not sure this is actually needed.")
    }, [image])

    const addPost = async() => {
        //must have an image
        if (image.length == 0) return;
        const imageFiles = [...image]; 
        try {
            const newPost = await addDoc(postsCollectionRef, {
                description: description,
                created: serverTimestamp(),
                updated: serverTimestamp(), 
                userid: Firebase.auth.currentUser.uid,
                imgUrls: []
            })

            const downloadUrls = [];
            for (const imageFile of imageFiles) {
                const fileRef = ref(Firebase.storage, `images/${imageFile.name}_${Firebase.auth.currentUser.uid}_${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}`); 
                await uploadBytes(fileRef, imageFile); 
                const downloadUrl = await getDownloadURL(fileRef); 
                downloadUrls.push(downloadUrl); 
            }
            await updateDoc(doc(postsCollectionRef, newPost.id), {imgUrls: downloadUrls})
            alert("Post created.")
            setDescription("");
            setImage(null);
            showCreate(); 
        } catch(error) {
            console.error(error)
        }
    }

    return(
        <div className="create-post-container">
            <div className="backdrop" onClick={showCreate}></div>
            <div className="create-post-form">
                <input type="file" accept="image/jpeg, image/png" multiple className="m-0 file-input" onChange={(e) => {setImage(e.target.files)}}/>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="align-self-stretch description"></textarea>
                <button onClick={addPost} className="btn">Create post!</button>
            </div>
        </div>
    )
}