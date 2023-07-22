import { useEffect, useState } from "react"
import Firebase from "../Firebase"
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

import '../Styles/createPost.css'

export default function CreatePost({showCreate, currentUser, toast}) {
    
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageOpt, setImageOpt] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const postsCollectionRef = collection(Firebase.db, 'posts');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
    },[currentUser])

    useEffect(() => {
    }, [image])


    const addPost = async() => {
        //must have an image
        if (image.length === 0) return;
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
            setDescription("");
            setImage(null);
            toast.updateMessage("Success! Post has been created");
            toast.updateType("success");
            toast.updateTimeout(2000);
            toast.updateVisible();
            showCreate(); 
            // setTimeout(() => {
            //   navigate(0)
            // }, 2000);
        } catch(error) {
            console.error(error);
            toast.updateMessage("Oh no! Something went wrong! Post wasn't created. Please try again.");
            toast.updateType("danger");
            toast.updateTimeout(2000);
            toast.updateVisible();
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
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob((blob) => {
                resolve(blob);
              }, 'image/jpeg', 0.8); 
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


    const imageRight = (e) => {
        let newIndex = currentImageIndex; 
        newIndex = (newIndex+1) % image.length;
        setCurrentImageIndex(newIndex);
    }
    const imageLeft = (e) => {
        let newIndex = currentImageIndex; 
        newIndex = (newIndex-1+image?.length) % image?.length;
        setCurrentImageIndex(newIndex);
    }

    return(
        <div className="create-post-container">
            <div className="backdrop" onClick={showCreate}></div>
            <div className="create-post-form">
                <input type="file" accept="image/jpeg, image/png" multiple className="m-0 file-input" onChange={(e) => {setImage(e.target.files)}}/>
                {image?.length > 0 &&
                <div className="img-container">
                  <div className='icons-container'>
                      <FontAwesomeIcon icon={faArrowLeft} className='cursor-pointer change-image change-image-left' onClick={imageLeft}/>
                      <FontAwesomeIcon icon={faArrowRight} className='cursor-pointer change-image change-image-right' onClick={imageRight}/>
                  </div>
                  <img src={URL.createObjectURL(image[currentImageIndex])} alt="uploaded image" />
                  </div>
                }
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="align-self-stretch description"></textarea>
                <button onClick={addPost} className="btn">Create post!</button>
            </div>
        </div>
    )
}