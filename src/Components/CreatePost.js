import { useEffect, useState } from "react"

import Firebase from "../Firebase"
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import '../Styles/createPost.css'

export default function CreatePost({showCreate, currentUser}) {
    
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageOpt, setImageOpt] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const postsCollectionRef = collection(Firebase.db, 'posts');

    useEffect(() => {
    },[currentUser])

    useEffect(() => {
        console.log(image);
    }, [image])


    const addPost = async() => {
        //must have an image
        if (image.length == 0) return;
        const imageFiles = [...image].sort((a,b) => a.lastModifiedDate < b.lastModifiedDate ? 1 : -1); 
        try {
            const newPost = await addDoc(postsCollectionRef, {
                description: description,
                created: serverTimestamp(),
                updated: serverTimestamp(), 
                userid: Firebase.auth.currentUser.uid,
                username: currentUser.username,
                searchString: (description + " "+ currentUser.username).toLowerCase().split(/\s|#/),
                imgUrls: []
            })

            const downloadUrls = [];
            for (const imageFile of imageFiles) {
                console.log("image size initial:", imageFile.size);
                const optImage = await optimizeImage(imageFile);
                optImage.name = imageFile.name;
                const fileRef = ref(Firebase.storage, `images/${optImage.name}_${Firebase.auth.currentUser.uid}_${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}`); 
                
                console.log("image size update:", optImage.size);
                await uploadBytes(fileRef, optImage); 
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

    function optimizeImage(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              // Calculate the desired width and height for the optimized image
              const maxWidth = 800;
              const maxHeight = 600;
              let width = img.width;
              let height = img.height;
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
              // Set the canvas dimensions to the desired size
              canvas.width = width;
              canvas.height = height;
              // Draw the image on the canvas
              ctx.drawImage(img, 0, 0, width, height);
              // Convert the canvas content back to a Blob
              canvas.toBlob((blob) => {
                resolve(blob);
              }, 'image/jpeg', 0.8); // Adjust the compression quality as needed
            };
            img.onerror = () => {
              reject(new Error('Failed to load the image.'));
            };
            img.src = event.target.result;
          };   
          reader.onerror = () => {
            reject(new Error('Failed to read the file.'));
          };
          reader.readAsDataURL(file);
        });
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