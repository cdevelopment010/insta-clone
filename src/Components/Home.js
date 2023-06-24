
import { useState, useEffect } from "react"
import Post from "./Post";
import { db } from "../Firebase";
import { getDocs, collection } from "firebase/firestore";

import '../Styles/home.css';
import CreatePost from "./CreatePost";

export default function Home({showAddModal, showCreate, currentUser}) {

    const [posts, setPosts] = useState([]);
    const postsCollectionRef = collection(db, 'posts');

    useEffect(() => {
        const getPosts = async () => {
            try {
                const posts = await getDocs(postsCollectionRef); 
                //Think this is OK for showing all the posts on the home page. 
                const filteredPosts = posts.docs.map((doc) => ({...doc.data(), id: doc.id})).sort((a,b) => a.updated < b.updated ? 1 : -1)
                setPosts(filteredPosts);
            } catch(error) {
                console.error(error);
            }
        }
        getPosts();
    }, [])

    return (
        <div className="desktop-container">
            {/* <Menu showCreate={showCreate}/> */}
            <div className="content">
                {posts.map(p => {
                    return <Post post={p} key={p.id} currentUser={currentUser}/>
                    })
                }
            </div>
            {showAddModal && 
                <CreatePost showCreate={showCreate} />
            }
        </div>
    )
}