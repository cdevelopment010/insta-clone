import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { collection,  updateDoc, doc, query, where, getCountFromServer,getDocs } from "firebase/firestore";
import {getDownloadURL, uploadBytes, ref} from "firebase/storage"
import Avatar from "./Avatar";
import PostsGrid from "./PostsGrid";


import '../Styles/profile.css';

export default function Profile({currentUser}) {

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
        setUser(currentUser);
    },[currentUser])
    
    useEffect(() => {
        if (user ===null) {
            return;
        }
        setFullName(user?.fullName);
        setUsername(user?.username);
        async function getData() {
            await getPostCount();
            await getPosts(); 
        } 
        getData();
    }, [user])

    const updateDetails = async () => {
        
        const downloadUrls = [];
        const fileRef = ref(Firebase.storage, `users/${Firebase.auth.currentUser.uid}_${image[0]?.name}`); 
        console.log(fileRef);
        await uploadBytes(fileRef, image[0]); 
        const downloadUrl = await getDownloadURL(fileRef); 
        downloadUrls.push(downloadUrl); 

        await updateDoc(doc(userCollectionRef,user.id), {
            fullName: fullName || user.fullName, 
            username: username || user.username,
            profileImgUrl: downloadUrls || user?.profileImgUrl.length > 0 ? user?.profileImgUrl[0] : ''
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
            const postCountQuery = query(postsRef, where("userid", "==", currentUser?.userid));
            const postCounts = await getCountFromServer(postCountQuery); 
            setPostCount(postCounts.data().count);
        } catch(error) {
            console.error(error);
        }
    }

    const getPosts = async(e) => {
        if (user == null) return;
        try {
            const postsQuery = query(postsRef, where("userid", "==", currentUser?.userid));
            const postsData = await getDocs(postsQuery); 
            const postsDataFilter = postsData.docs.map((d) => ({...d.data(), id: d.id})).sort((a,b) => a.updated < b.updated ? 1 : -1)
            setPosts(postsDataFilter);
        } catch(error) {
            console.error(error);
        }
    }

    // const compressImage = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = function (event) {
    //           const img = new Image();
    //           img.onload = function () {
    //             const canvas = document.createElement("canvas");
    //             const ctx = canvas.getContext("2d");
        
    //             const maxWidth = 800; // Maximum width for compressed image
    //             const maxHeight = 800; // Maximum height for compressed image
        
    //             let width = img.width;
    //             let height = img.height;
        
    //             // Calculate new dimensions to maintain aspect ratio
    //             if (width > height) {
    //               if (width > maxWidth) {
    //                 height *= maxWidth / width;
    //                 width = maxWidth;
    //               }
    //             } else {
    //               if (height > maxHeight) {
    //                 width *= maxHeight / height;
    //                 height = maxHeight;
    //               }
    //             }
        
    //             // Set canvas dimensions
    //             canvas.width = width;
    //             canvas.height = height;
        
    //             // Draw image on canvas
    //             ctx.drawImage(img, 0, 0, width, height);
        
    //             // Convert canvas to a compressed data URL
    //             const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality as desired
        
    //             // Resolve with the compressed data URL
    //             resolve(compressedDataUrl);
    //           };
    //           img.src = event.target.result;
    //         };
    //         reader.readAsDataURL(file);
    //       });
    // }

    // const fileChangeUpload = (event) => {
    //     const file = event.target.files[0];

    //     if (file) {
    //         compressImage(file)
    //         .then((compressedDataUrl) => {
    //             // Use the compressedDataUrl for further processing or uploading
    //             console.log(compressedDataUrl);
    //         })
    //         .catch((error) => {
    //             console.error("Error compressing image:", error);
    //         });
    //     }
    // }

    return(
        <div className="profile-container">

            <div className="profile-header d-flex align-items-center justify-content-center mt-4">
                <Avatar size="xl" src={user?.profileImgUrl.length > 0 ? user.profileImgUrl[0] : ''} className="me-5"/>
                <div className="ms-5">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <span className="me-5">{user?.username}</span>
                        <button onClick={toggleEditProfile} className="cursor-pointer">Edit profile</button>
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
                                {/* <Avatar  src={tempImage ? tempImage : ""} /> */}
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