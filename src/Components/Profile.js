import { useEffect, useState } from "react";
import Firebase from "../Firebase";
import { getAuth, deleteUser, GoogleAuthProvider, reauthenticateWithCredential, signInWithPopup } from "firebase/auth";
import { collection,  updateDoc, doc, query, where, getCountFromServer,getDocs, deleteDoc } from "firebase/firestore";
import {getDownloadURL, uploadBytes, ref, deleteObject} from "firebase/storage"
import Avatar from "./Avatar";
import PostsGrid from "./PostsGrid";
import { useNavigate, useParams } from "react-router-dom";

import '../Styles/profile.css';

export default function Profile({currentUser, toast, confirmObj}) {

    const { userid } = useParams();
    const [user, setUser] = useState(currentUser); 
    const userCollectionRef = collection(Firebase.db, 'users'); 
    const [username, setUsername] = useState(currentUser?.username); 
    const [fullName, setFullName] = useState(currentUser?.fullName); 
    const [image,setImage] = useState(currentUser?.profileImgUrl);
    const [editProfile, setEditProfile] = useState(false);
    const [postCount, setPostCount] = useState(0);
    const [posts, setPosts] = useState([]);

    const postsRef = collection(Firebase.db, "posts");

    const navigate = useNavigate(); 

    useEffect(() => {
        // console.log(toast)
        // console.log(confirmObj)
        setUser(currentUser);
        console.log(user, currentUser);
    },[currentUser])

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
        
        try {
            const downloadUrls = [];
            if (image[0]?.lastModified){
                let imageBlob = await optimizeImage(image[0]); 
                imageBlob.name = image[0]?.name;
                const fileRef = ref(Firebase.storage, `users/${Firebase.auth.currentUser.uid}_${imageBlob.name}`); 
                await uploadBytes(fileRef, imageBlob); 
                const downloadUrl = await getDownloadURL(fileRef); 
                downloadUrls.push(downloadUrl); 
            }
            console.log(user.id)

            await updateDoc(doc(userCollectionRef,user.id), {
                fullName: fullName || user.fullName, 
                username: username || user.username,
                profileImgUrl: downloadUrls.length > 0 ?  downloadUrls : user?.profileImgUrl ? user?.profileImgUrl : ['']
            })
            setEditProfile(!editProfile);
            toast.updateMessage("Success! Profile has been updated.");
            toast.updateType("success");
            toast.updateTimeout(2000);
            toast.updateVisible();
            setTimeout(() => {
                navigate(0);
            },2000)
        } catch(error){
            console.error(error);
            toast.updateMessage("Oh no! Something went wrong! Profile hasn't been updated. Please try again.");
            toast.updateType("danger");
            toast.updateTimeout(2000);
            toast.updateVisible();
        }
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


    
    const deleteAccount = () => {
        confirmObj.updateConfirmObj({
            message: 'Are you sure you want to delete your account? It will delete all your posts.',
            pCallback: async () => {
                try {   
                    const deleteUserAccount = getAuth().currentUser;
                    console.log(deleteUserAccount);
                    const postsQuery = query(postsRef, where("userid", "==", deleteUserAccount.uid));
                    const postsData = await getDocs(postsQuery); 

                    postsData.forEach(async p => {
                        const likesRef = collection(Firebase.db, "posts", p.id, "likes"); 
                        const commentsRef = collection(Firebase.db, "posts", p.id, "comments"); 
                        
                        const likesData = await getDocs(likesRef); 
                        const commentsData = await getDocs(commentsRef); 

                        likesData.forEach(async l => await deleteDoc(l.ref))
                        commentsData.forEach(async c => await deleteDoc(c.ref))

                        if(p.data().imgUrls.length > 0){
                            p.data().imgUrls.forEach(async (im) => {
                                const storageRef = ref(Firebase.storage, im);
                                await deleteObject(storageRef);
                            })
                        }

                        await deleteDoc(p.ref);
                        
                    })

                    let userQuery = query(userCollectionRef, where("userid", "==", deleteUserAccount.uid)); 
                    let userSnapshot = await getDocs(userQuery); 
                    userSnapshot.forEach(async u => deleteDoc(u.ref))

                    if (deleteUserAccount.providerData.some((provider) => provider.providerId === 'google.com')){
                        const googleAuthProvider = new GoogleAuthProvider();
                        await signInWithPopup(Firebase.auth, Firebase.provider)

                        // await reauthenticateWithCredential(currentUser, googleAuthProvider)
                        // console.log(googleAuthProvider);

                    }

                    await deleteUser(deleteUserAccount); 
                    console.log("account deleted");
                    navigate("/");

                } catch(error) {
                    console.error(error);
                }
            }
        })
        confirmObj.updateVisible(true);
    }

    return(
        <div className="profile-container">

            <div className="profile-header d-flex align-items-center justify-content-center mt-4">
                <Avatar size="xl" src={user?.profileImgUrl?.length > 0 ? user.profileImgUrl[0] : ''} className="me-5" userid=""/>
                <div className="ms-5">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <span className="me-5">{user?.username}</span>
                        {
                            currentUser?.userid === user?.userid &&
                            <button onClick={toggleEditProfile} className="cursor-pointer">Edit profile</button>
                        }
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <span className="me-5"><span className="fw-bold">{postCount}</span> post</span>
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
                                } 
                            </label>
                        </div>
                        <div className="d-flex mx-auto-sm">
                            <button type="button" onClick={updateDetails} className="me-3 cursor-pointer">Update details</button>
                            <button type="button" onClick={toggleEditProfile} className="bg-danger cursor-pointer">Cancel</button>
                        </div>
                        <div className="d-flex mx-auto-sm mt-3">
                            <button type="button" onClick={deleteAccount} className="bg-danger cursor-pointer">Delete Account</button>
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