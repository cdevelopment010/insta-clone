
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import Firebase from "../Firebase";
import PostsGrid from "./PostsGrid";
import styles from '../Styles/search.module.css';

export default function Search() {

    const [searchString, setSearchString] = useState("");
    const [timer, setTimer] = useState(null);
    const [posts, setPosts] = useState([]);
    const { searchstring } = useParams();
    const navigate = useNavigate(); 
    const postsCollectionRef = collection(Firebase.db, "posts");

    useEffect(() => {
        console.log("Searching...", searchstring);
        async function getData() {
            setSearchString(searchstring);
            await getPosts();
        }
        getData(); 
        return () => {
            clearTimeout(timer);
          };
    },[searchstring])


    const getPosts = async () => {
        try {
            let str = searchString == "" ? searchstring : searchString;
            const posts = await getDocs(query(postsCollectionRef, where("searchString", "array-contains", (str?.toLowerCase() ? str?.toLowerCase() : "" ))) );
            const postResults = posts.docs.map((d) => ({...d.data(), id: d.id}));
            console.log(postResults);
            setPosts(postResults);
        } catch(error) {
            console.error(error);
        }
    }


    const updateSearch = (e) => {
        const newSearchString = e.target.value;
        setSearchString(newSearchString);
        clearTimeout(timer);


        const newTimer = setTimeout(() =>{
                navigate(`/search/${newSearchString}`);
            }, 500)
        setTimer(newTimer);
    }

    return (
        <div className={styles['search-container']}>
            <div className={`${styles['search-header']} d-flex flex-column`}>
                <input value={searchString} onChange={updateSearch} placeholder="Search..."/>
            </div>
            <PostsGrid posts={posts} />
        </div>
    )
}