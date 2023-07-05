
import { useState, useEffect } from "react"
import Post from "./Post";
import { db } from "../Firebase";
import { getDocs, collection, getCountFromServer } from "firebase/firestore";

import '../Styles/home.css';
import CreatePost from "./CreatePost";

export default function Home({showAddModal, showCreate, currentUser}) {

    const [user, setUser] = useState(currentUser);
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [timeoutPosts, setTimeoutPosts ] = useState(); 
    const postsCollectionRef = collection(db, 'posts');

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
        const getData = async () => {
            //possible use for interval and getting the data again. 
        }
        getData();
    }, [postCount])

    const getPostData = async () => {
        try {
            const posts = await getDocs(postsCollectionRef); 
            //Think this is OK for showing all the posts on the home page. 
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


    return (
        <div className="desktop-container">
            {/* <Menu showCreate={showCreate}/> */}
            <div className="content">
                {posts.map(p => {
                    return <Post post={p} key={p.id} currentUser={currentUser} removePost={removePost}/>
                    })
                }
            </div>
            {showAddModal && 
                <CreatePost showCreate={showCreate} currentUser={currentUser}/>
            }
        </div>
    )
}