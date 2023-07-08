import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { collection,  updateDoc, doc, query, where, getCountFromServer,getDocs } from "firebase/firestore";
import {getDownloadURL, uploadBytes, ref} from "firebase/storage"
import Avatar from "./Avatar";
import PostsGrid from "./PostsGrid";

import { useParams } from "react-router-dom";


import '../Styles/profile.css';

export default function Profile({currentUser}) {

    const { userid } = useParams();
    const [user, setUser] = useState(currentUser); 
    const userCollectionRef = collection(Firebase.db, 'users'); 
    const [username, setUsername] = useState(currentUser?.username); 
    const [fullName, setFullName] = useState(currentUser?.fullName); 
    const [image,setImage] = useState(currentUser?.profileImgUrl);
    // const [tempImage, setTempImage] = useState("");
    const [editProfile, setEditProfile] = useState(false);
    const [postCount, setPostCount] = useState(0);
    const [posts, setPosts] = useState([]);

    const postsRef = collection(Firebase.db, "posts");

    useEffect(() => {
        async function getData() {
            await getUserData(); 
        }
        if (userid) {
            //get user based off of userid
            getData(); 
        } else {
            setUser(currentUser);
        }
    },[currentUser, userid])
    
    useEffect(() => {
        if (user ===null) {
            return;
        }
        setFullName(user?.fullName);
        setUsername(user?.username);
        setImage(user?.profileImgUrl)
        async function getData() {
            await getPostCount();
            await getPosts(); 
        } 
        getData();
    }, [user])

    const getUserData = async () => {
        try {
            let userQuery = query(userCollectionRef, where("userid", "==", userid)); 
            let userSnapshot = await getDocs(userQuery); 
            let userData = userSnapshot.docs.map(x=> ({...x.data(), id: x.id}))[0];
            setUser(userData);
        } catch(error) {
            console.error(error)
        }
    }

    const updateDetails = async () => {
        
        const downloadUrls = [];

        if (image[0]?.lastModified){
            let imageBlob = await optimizeImage(image[0]); 
            imageBlob.name = image[0]?.name;
            const fileRef = ref(Firebase.storage, `users/${Firebase.auth.currentUser.uid}_${imageBlob.name}`); 
            await uploadBytes(fileRef, imageBlob); 
            const downloadUrl = await getDownloadURL(fileRef); 
            downloadUrls.push(downloadUrl); 
        }

        await updateDoc(doc(userCollectionRef,user.id), {
            fullName: fullName || user.fullName, 
            username: username || user.username,
            profileImgUrl: downloadUrls.length > 0 ?  downloadUrls : user?.profileImgUrl ? user?.profileImgUrl : ['']
        })
        setEditProfile(!editProfile);
    }

    const toggleEditProfile = () => {
        setEditProfile(!editProfile);
    }

    const getPostCount = async (e) => {
        if (user === null) {
            console.log("null userid...")
            return;
        }
        try {
            const postCountQuery = query(postsRef, where("userid", "==", user?.userid));
            const postCounts = await getCountFromServer(postCountQuery); 
            setPostCount(postCounts.data().count);
        } catch(error) {
            console.error(error);
        }
    }

    const getPosts = async(e) => {
        if (user == null) return;
        try {
            const postsQuery = query(postsRef, where("userid", "==", user?.userid));
            const postsData = await getDocs(postsQuery); 
            const postsDataFilter = postsData.docs.map((d) => ({...d.data(), id: d.id})).sort((a,b) => a.updated < b.updated ? 1 : -1)
            setPosts(postsDataFilter);
        } catch(error) {
            console.error(error);
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
        <div className="profile-container">

            <div className="profile-header d-flex align-items-center justify-content-center mt-4">
                <Avatar size="xl" src={user?.profileImgUrl?.length > 0 ? user.profileImgUrl[0] : ''} className="me-5" userid=""/>
                <div className="ms-5">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <span className="me-5">{user?.username}</span>
                        {
                            currentUser?.userid == user?.userid &&
                            <button onClick={toggleEditProfile} className="cursor-pointer">Edit profile</button>
                        }
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <span className="me-5"><span className="fw-bold">{postCount}</span> post</span>
                        {/* <span className="me-5"><span className="fw-bold">10</span> followers</span>
                        <span className="me-5"><span className="fw-bold">30</span> following</span> */}
                    </div>
                    <div>
                        <span>{user?.fullName}</span>
                    </div>

                </div>
            </div>


            <div className="profile-body">
                { editProfile &&
                    <div className="profile-edit d-flex align-items-start flex-column mt-5 mb-5 ">
                        <div className="d-flex align-items-stretch justify-content-start mt-5 flex-column-sm mx-auto-sm flex-wrap">
                            <label className="d-flex flex-column me-2 fs-sm flex-grow">
                                <span className="fw-bold">Name:</span>
                                <input type="text" placeholder="fullname.." value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </label>
                            <label className="d-flex flex-column me-2 fs-sm flex-grow">
                                <span className="fw-bold">Username:</span>
                                <input type="text" placeholder="username.." value={username} onChange={(e) => setUsername(e.target.value)} />
                            </label>
                            <label className="d-flex flex-column me-2 fs-sm flex-grow">
                                <span className="fw-bold">Profile Picture:</span>
                                <input type="file" accept="image/jpeg, image/png" onChange={(e) => {setImage(e.target.files)}}/>
                                {
                                    image && typeof(image[0]) != 'string' &&
                                    <Avatar src={URL.createObjectURL(image[0])} size="xl"/>
                                    // <img src={URL.createObjectURL(image[0])} alt="new profile" />
                                } 
                            </label>
                        </div>
                        <div className="d-flex mx-auto-sm">
                            <button type="button" onClick={updateDetails} className="me-3 cursor-pointer">Update details</button>
                            <button type="button" onClick={toggleEditProfile} className="bg-danger cursor-pointer">Cancel</button>
                        </div>
                    </div>
                }

                <div>
                    <PostsGrid posts={posts} />
                </div>
            </div>
        </div>
    )
}