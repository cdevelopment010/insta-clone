

import styles from '../Styles/enlargedPost.module.css';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, getDoc, doc, addDoc, serverTimestamp, getCountFromServer, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Firebase from '../Firebase';
import Avatar from './Avatar';
import Comment from './Comment';

/* SVG ICONS */
import {ReactComponent as HeartSolid} from '../Icons/svg/heart-solid.svg';
import {ReactComponent as HeartSvg} from '../Icons/svg/heart-regular.svg';
import {ReactComponent as CommentSvg} from '../Icons/svg/instagram-comment-regular.svg';

export default function EnlargedPost({currentUser}) {
    const [images, setImages] = useState([]);
    const [visible, setVisible] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [post, setPost] = useState(null); 
    const { postid } = useParams();  


    const [user, setUser] = useState(null);
    const [postDetail, setPostDetail] = useState([]);
    const [likeCounter, setLikeCounter] = useState(0);
    const [commentCounter, setCommentCounter] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(true);
    const [previousComments, setPreviousComments] = useState(null);
    const [showPostDetail, setShowPostDetail] = useState(false)

    const postCollection = collection(Firebase.db, "posts"); 
    const userCollectionRef = collection(Firebase.db, 'users');
    const commentsRef = collection(Firebase.db, "posts", postid, "comments"); 
    const likesRef = collection(Firebase.db, "posts", postid, "likes"); 
    const inputRef = useRef(null);

    useEffect(() => {
        async function getData() {
            await getPostData();
            await getPostUser();    
        }
        getData(); 
    }, [postid])

    useEffect(() => {
        async function getData() {
            await getPostUser();      
            
            const likesCount = await getCountFromServer(likesRef); 
            setLikeCounter(likesCount.data().count);
            
            const commentsCount = await getCountFromServer(commentsRef); 
            setCommentCounter(commentsCount.data().count);

            const commentData = await getDocs(commentsRef); 
            const filteredComments = commentData.docs.map((doc) => ({...doc.data(), id: doc.id})).sort((a,b) => a.commentDate < b.commentDate ? -1 : 1)
            console.log(filteredComments);
            setPreviousComments(filteredComments);

            if(Firebase?.auth?.currentUser?.uid === null || Firebase?.auth?.currentUser?.uid === undefined) return;
            const userLiked = query(likesRef, where("userid", "==", Firebase?.auth?.currentUser?.uid)); 
            const likesSnapshot = await getDocs(userLiked); 
            setUserLiked(likesSnapshot.size > 0 ? true : false);
        }
        getData(); 

    }, [post]) 

    useEffect(() => {
        setImages(post?.imgUrls || []);
        setVisible(true);
        setPostDetail(post?.description.split('#'))
        setShowPostDetail(post?.description.split('#')[0].length > 100 ? false : true)
        
    }, [user])

    const getPostData = async (e) => {
        try {
            const postQuery = doc(postCollection, postid); 
            const postData = await getDoc(postQuery); 
            const postInfo = {...postData.data(), id: postData.id}; 
            setPost(postInfo);
            

        } catch(error) {
            console.error(error);
        }
    }

    const getPostUser = async () => {
        if (post == null) return; 
        try {
            const postUser = query(userCollectionRef, where("userid", "==", post?.userid)); 
            const querySnapshop = await getDocs(postUser); 
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id}
                setUser(data);
            })
        } catch(error) {
            console.error(error)
        }
    }

    const imageRight = () => {
        let newIndex = currentImageIndex; 
        newIndex = (newIndex+1) % images.length;
        setCurrentImageIndex(newIndex);
    }
    const imageLeft = () => {
        let newIndex = currentImageIndex; 
        newIndex = (newIndex-1+images.length) % images.length;
        setCurrentImageIndex(newIndex);
    }

    const updateLikes = async (e) => {
        if(Firebase?.auth?.currentUser?.uid === null || Firebase?.auth?.currentUser?.uid === undefined) return;

        const userLiked = query(likesRef, where("userid", "==", Firebase?.auth?.currentUser?.uid)); 
        const querySnapshop = await getDocs(userLiked);
        console.log(querySnapshop.size)
        if (querySnapshop.size > 0){
            //delete doc
            querySnapshop.forEach(async (docLikes) => {
                await deleteDoc(docLikes.ref);
                const likesCount = await getCountFromServer(likesRef); 
                setLikeCounter(likesCount.data().count);
                setUserLiked(false)
            })
        } else {
            await addDoc(likesRef, {
                userid: Firebase.auth.currentUser.uid,
                likedDate: serverTimestamp()
            })
            const likesCount = await getCountFromServer(likesRef); 
            setLikeCounter(likesCount.data().count);
            setUserLiked(true);
        }
    }

    function togglePostDetail() {
        setShowPostDetail(!showPostDetail);
    }

    function checkComment(e) {
        const postBtn = e.target.nextElementSibling;
        if (e.target.value.length) {
            postBtn.classList.add('opacity-100','cursor-pointer');
            postBtn.classList.remove('opacity-50');
        } else {
            postBtn.classList.remove('opacity-100','cursor-pointer');
            postBtn.classList.add('opacity-50');
        }
    }

    const toggleComments = () => {
        setShowComments(!showComments);
    }

    const focusOnComment = () => {
        inputRef.current.focus();
    }

    const addComment = async (e) => {
        if(Firebase?.auth?.currentUser?.uid === null || Firebase?.auth?.currentUser?.uid === undefined) return;
        try {
            await addDoc(commentsRef, {
                userid: currentUser.userid,
                username: currentUser.username,
                commentDate: serverTimestamp(),
                comment: comment,
            })
            await refreshComments();

            setComment("");
        } catch(error) {
            console.error(error);
        }
    }

    const refreshComments = async (e) => {
        const commentsCount = await getCountFromServer(commentsRef); 
        setCommentCounter(commentsCount.data().count);

        const commentData = await getDocs(commentsRef); 
        const filteredComments = commentData.docs.map((doc) => ({...doc.data(), id: doc.id})).sort((a,b) => a.commentDate < b.commentDate ? -1 : 1)
        setPreviousComments(filteredComments);
    }

   
    return (
        <div className={`${styles["enlarged-post-container"]}`}>
            {visible &&
                <div className={styles["enlarged-post-content"]}>
                    <div className={styles["image-section"]}>
                        {
                            images.length > 1 &&
                            <div className={styles["icons-container"]}>
                                <FontAwesomeIcon icon={faArrowLeft} className={`cursor-pointer ${styles["change-image"]}  ${styles["change-image-left"]}`} onClick={imageLeft}/>
                                <FontAwesomeIcon icon={faArrowRight} className={`cursor-pointer ${styles["change-image"]}  ${styles["change-image-right"]}`} onClick={imageRight}/>
                            </div>
                            
                        }
                        {
                            images.length > 0 &&
                            <img src={images ? images[currentImageIndex] : ""}  alt="post" className={styles["enlarged-post-img"]}/>
                        }     
                        {
                            images.length > 1 &&
                            <div className="counter-container">
                                {images.map((im, ind) => {
                                        return <div className={`image-counter cursor-pointer ${ind === currentImageIndex ? 'fill' : ''}`} key={`image-counter-${ind}`} onClick={() => setCurrentImageIndex(ind)}></div>
                                    })
                                }
                            </div>
                        }  
                    </div>
                    <div className={styles["enlarged-post-details"]}>
                        <div className="d-flex align-items-center ms-5 mt-5">
                            <Avatar size="xl" src={user?.profileImgUrl?.length > 0 ? user?.profileImgUrl[0] :''} className='me-1' userid={post?.userid}/>
                            <span className='fw-bold'>{user?.username}</span>
                        </div>
                        <div className="p-5 post-detail border-bottom">
                            {postDetail && postDetail[0]?.length > 100 && !showPostDetail
                                &&
                                <div>
                                    <span>{postDetail[0].substring(0,100)}...</span>
                                    <span>{postDetail.map((detail,ind)=>{
                                        if (ind === 0) {return}
                                        return <Link to={`/tags/${detail}`} key={ind}>#{detail}</Link>
                                    })}</span>
                                    <br></br>
                                    <span className='cursor-pointer text-secondary' onClick={togglePostDetail}>more</span>
                                </div>
                            }
                            {showPostDetail && postDetail
                                &&
                                <div>
                                    <span>{postDetail[0]}</span>
                                    <span>{postDetail.map((detail,ind)=>{
                                        if (ind === 0) {return}
                                        return <Link to={`/search/${detail}`} key={ind} className='me-1'>#{detail}</Link>
                                    })}</span>
                                    <br></br>
                                </div>
                            }
                        </div>                        
                    </div>

                    <div className={`${styles["comments-container"]} fs-sm pt-2`}>
                        <div>
                            <div className="icons d-flex align-items-center ps-5 h-100">
                                <svg height="25" width="25" className={`me-2 cursor-pointer svg-icon ${userLiked ? 'liked-post' : ''}`} onClick={updateLikes}>
                                    { userLiked &&
                                        <HeartSolid height="25" width="25" />
                                    }
                                    {
                                        !userLiked &&
                                        <HeartSvg height="25" width="25" />

                                    }
                                </svg>
                                <svg height="25" width="25" className='me-2 cursor-pointer svg-icon' onClick={focusOnComment}>
                                    <CommentSvg height="25" width="25" />
                                </svg>
                            </div>
                        </div>
                        { showComments &&
                            <div className={`${styles["comments"]} pb-2`}>
                                { previousComments&& previousComments.length > 0 &&
                                    previousComments.map((c, ind) =>{
                                        
                                        return (<div key={`comment-${c.id}`} className='p-2'>
                                            <Comment comment={c} currentUser={currentUser} postuserid={post.userid} postid={post.id} refreshComments={refreshComments}/>
                                        </div>)
                                    })
                                }
                            </div>

                        }
                        <div className={`border-bottom ${currentUser ? '' : 'd-none'}`}></div>
                        <div className={`d-flex align-items-center justify-content-between pt-2 ${currentUser ? '' : 'd-none'}`}>
                            <input className='text-secondary comment-input flex-1 me-1 border-0' ref={inputRef} placeholder='Add a comment...' onChange={(e) => {checkComment(e);setComment(e.target.value)}} value={comment}></input>
                            <span className='text-callout opacity-50 fw-bold me-2' id="post-btn" onClick={addComment}>Post</span>
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}