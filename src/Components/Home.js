
import { useState, useEffect } from "react"
import Post from "./Post";
import { db } from "../Firebase";
import { getDocs, collection, getCountFromServer } from "firebase/firestore";

import '../Styles/home.css';
import CreatePost from "./CreatePost";

export default function Home({showAddModal, showCreate, currentUser, toast}) {

    const [user, setUser] = useState(currentUser);
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [timeoutPosts, setTimeoutPosts ] = useState(); 
    const postsCollectionRef = collection(db, 'posts');
    const [showNewPostBtn, setShowNewPostBtn] = useState(false);

    useEffect(() => {
        const getPosts = async () => {
            await getPostData();
            if (posts.length > 0){
                await checkPostCount();
            }
        }
        getPosts();
    }, [])

    useEffect(() => {
    },[currentUser])

    useEffect(() => {
        let intervalTime = 5000;
        let interval;
            interval = setInterval(async () => {
                const count = await getCountFromServer(postsCollectionRef); 
                let newCount = count.data().count;
                let currentCount = posts.length;
                
                if (newCount <= currentCount) {
                    clearInterval(interval)
                    interval = setInterval(async () => {
                        intervalTime *= 2;
                        console.log("interval with ", intervalTime);
                        const count = await getCountFromServer(postsCollectionRef); 
                        newCount = count.data().count;
                        currentCount = posts.length;

                        if (newCount > currentCount) {
                            setShowNewPostBtn(true);
                            intervalTime = 5000;
                        } 

                    }, intervalTime)
                }

                if (newCount > currentCount) {
                    setShowNewPostBtn(true);
                    intervalTime = 5000;
                } 
            },intervalTime)
        return () => clearInterval(interval)
    }, [posts, postsCollectionRef])

    const getPostData = async () => {
        try {
            const posts = await getDocs(postsCollectionRef); 
            const filteredPosts = posts.docs.map((doc) => ({...doc.data(), id: doc.id, ref:doc.ref})).sort((a,b) => a.updated < b.updated ? 1 : -1)
            setPosts(filteredPosts);
        } catch(error) {
            console.error(error);
        }
    }

    const checkPostCount = async () => {
        try {
            const count = await getCountFromServer(postsCollectionRef); 
            if (count !== postCount){
                setPostCount(count)
            };
        } catch(error) {
            console.error(error);
        }
    }

    const removePost = (p) => {
        let newPostList = posts.filter(x => x.id !== p.id); 
        setPosts(newPostList);
    }

    const getUpdatedPosts = async() => {
        await getPostData();
        await checkPostCount();
        setShowNewPostBtn(false);

    }

    return (
        <div className="desktop-container">
            {
                showNewPostBtn &&
                <button onClick={getUpdatedPosts} className="btn">Show new posts!</button>
            }
            <div className="content">
                {posts.map(p => {
                    return <Post post={p} key={p.id} currentUser={currentUser} removePost={removePost} toast={toast}/>
                    })
                }
            </div>
            {showAddModal && 
                <CreatePost showCreate={showCreate} currentUser={currentUser} toast={toast}/>
            }
        </div>
    )
}