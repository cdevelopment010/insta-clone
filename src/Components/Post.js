import Avatar from './Avatar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Firebase from '../Firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, serverTimestamp, getCountFromServer } from "firebase/firestore";

import '../Styles/post.css';
import { useEffect, useRef, useState  } from 'react';
import { Link } from 'react-router-dom';

import Comment from './Comment';

/* SVG ICONS */
import {ReactComponent as HeartSolid} from '../Icons/svg/heart-solid.svg';
import {ReactComponent as HeartSvg} from '../Icons/svg/heart-regular.svg';
import {ReactComponent as ShareSolid} from '../Icons/svg/instagram-share-solid.svg';
import {ReactComponent as ShareSvg} from '../Icons/svg/instagram-share-regular.svg';
import {ReactComponent as CommentSolid} from '../Icons/svg/instagram-comment-solid.svg';
import {ReactComponent as CommentSvg} from '../Icons/svg/instagram-comment-regular.svg';
import {ReactComponent as BookmarkSolid} from '../Icons/svg/bookmark-ribbon-solid.svg';
import {ReactComponent as BookmarkSvg} from '../Icons/svg/bookmark-ribbon-regular.svg';
import EnlargedPost from './EnglargedPost';

export default function Post({ post, currentUser }) {

    const [user, setUser] = useState(null);
    const [postDetail, setPostDetail] = useState(post.description.split('#'));
    const [images, setImages] = useState(post?.imgUrls || [])
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [likeCounter, setLikeCounter] = useState(0);
    const [commentCounter, setCommentCounter] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [previousComments, setPreviousComments] = useState(null);
    const [showPostMenu, setShowPostMenu] = useState(false);

    // let commentCounter = 28;
    let [showPostDetail, setShowPostDetail] = useState(postDetail[0].length > 100 ? false : true)
    const inputRef = useRef(null);
    const userCollectionRef = collection(Firebase.db, 'users');
    const likesRef = collection(Firebase.db, "posts", post.id, "likes"); 
    const commentsRef = collection(Firebase.db, "posts", post.id, "comments"); 

    useEffect(() => {
        const getData = async () => {
            const postUser = query(userCollectionRef, where("userid", "==", post.userid)); 
            const querySnapshop = await getDocs(postUser); 
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id}
                setUser(data);
            })

            const likesCount = await getCountFromServer(likesRef); 
            setLikeCounter(likesCount.data().count);
            
            const commentsCount = await getCountFromServer(commentsRef); 
            setCommentCounter(commentsCount.data().count);

            const commentData = await getDocs(commentsRef); 
            const filteredComments = commentData.docs.map((doc) => ({...doc.data(), id: doc.id})).sort((a,b) => a.commentDate < b.commentDate ? -1 : 1)
            setPreviousComments(filteredComments);


            if(Firebase?.auth?.currentUser?.uid === null || Firebase?.auth?.currentUser?.uid === undefined) return;
            const userLiked = query(likesRef, where("userid", "==", Firebase?.auth?.currentUser?.uid)); 
            const likesSnapshot = await getDocs(userLiked); 
            setUserLiked(likesSnapshot.size > 0 ? true : false);
            

        }
        getData();
    }, [])


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

    const imageRight = (e) => {
        let newIndex = currentImageIndex; 
        newIndex = (newIndex+1) % images.length;
        setCurrentImageIndex(newIndex);
    }
    const imageLeft = (e) => {
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

    const toggleComments = () => {
        setShowComments(!showComments);
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

    const focusOnComment = () => {
        inputRef.current.focus();
    }


    return (
        <div className="post-container">
            <div className="post-header d-flex align-items-center justify-content-between p-2">
                <div className="d-flex align-items-center">
                    <Avatar size="md" src={user?.profileImgUrl?.length > 0 ? user?.profileImgUrl[0] :''} className='me-1' userid={post?.userid}/>
                    <span className='fw-bold'>{user?.username}</span>
                </div>
                <div className='me-2'>
                    <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer' 
                        tabIndex={0}
                        onBlur={(e) => {setTimeout(()=>setShowPostMenu(false),200)}}
                        onClick={() => setShowPostMenu(true)}/>
                    {
                        showPostMenu && 
                        <div className="post-menu">
                            <ul className='post-menu-options'>
                                <li><Link to={`/post/${post.id}`}>Go To Post</Link></li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
            <div className="post-content">
                <div className='image-container'>
                    {
                        images.length > 1 &&
                        <div className='icons-container'>
                            <FontAwesomeIcon icon={faArrowLeft} className='cursor-pointer change-image change-image-left' onClick={imageLeft}/>
                            <FontAwesomeIcon icon={faArrowRight} className='cursor-pointer change-image change-image-right' onClick={imageRight}/>
                        </div>
                        
                    }
                    {
                        images.length > 0 &&
                        <img src={images ? images[currentImageIndex] : ""}  alt="post"/>
                    }     
                    {
                        images.length > 1 &&
                        <div className="counter-container">
                            {images.map((im, ind) => {
                                    return <div className={`image-counter cursor-pointer ${ind === currentImageIndex ? 'fill' : ''}`} key={`image-counter-${ind}`} onClick={(e) => {setCurrentImageIndex(ind); }} ></div>
                                })
                            }
                        </div>
                    }               
                </div>
            </div>
            <div className="post-comments p-2">
                {/* Icons */}
                <div className={`icon-section d-flex align-items-center justify-content-between ${currentUser ? '' : 'd-none'}`}>
                    <div className="icons d-flex align-items-center ">
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
                        {/* <svg height="25" width="25" className='me-2 cursor-pointer svg-icon'>
                            <ShareSvg height="25" width="25" />
                        </svg> */}
                    </div>
                    {/* <div className="bookmark d-flex align-items-center">
                        <svg height="25" width="25" className="me-2 cursor-pointer svg-icon">
                            <BookmarkSvg height="25" width="25" />
                        </svg>
                    </div> */}
                </div>
                {/* Likes */}
                <div className="likes mt-3 mb-3">
                    {/* Icons should only show if you follow a person who has liked the post */}
                    {/* <div className="avatars d-flex">
                        <Avatar size="xs" src="" className='' />
                        <Avatar size="xs" src="" className='' />
                        <Avatar size="xs" src="" className='' />
                    </div> */}

                    <div className='like-counter fw-bold'>
                        {likeCounter} likes
                    </div>
                </div>
                {/* Post detail */}
                <div className="post-detail fs-sm">
                    <span className="fw-bold">{user?.username}</span>
                    {postDetail[0].length > 100 && !showPostDetail
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
                    {showPostDetail
                        &&
                        <div>
                            <span>{postDetail[0]}</span>
                            <span>{postDetail.map((detail,ind)=>{
                                if (ind === 0) {return}
                                return <Link to={`/tags/${detail}`} key={ind} className='me-1'>#{detail}</Link>
                            })}</span>
                            <br></br>
                            {/* <span className='cursor-pointer text-secondary' onClick={togglePostDetail}>hide</span> */}
                        </div>
                    }
                </div>
                {/* Comment section */}
                <div className="comments-container fs-sm pt-2">
                    <span className='text-secondary cursor-pointer' onClick={toggleComments}>{ showComments ? 'Hide comments' : `View all ${commentCounter} comments`} </span>
                    { showComments &&
                        <div className="comments pb-2">
                            {
                                previousComments.map((c, ind) =>{
                                    
                                    return (<div key={`comment-${c.id}`} className='p-2'>
                                        <Comment comment={c} currentUser={currentUser} postuserid={post.userid} postid={post.id} refreshComments={refreshComments}/>
                                        {/* <div className='hr' /> */}
                                    </div>)
                                })
                            }
                        </div>

                    }
                    <div className={`hr ${currentUser ? '' : 'd-none'}`}></div>
                    <div className={`d-flex align-items-center justify-content-between pt-2 ${currentUser ? '' : 'd-none'}`}>
                        <input className='text-secondary comment-input flex-1 me-1 border-0' ref={inputRef} placeholder='Add a comment...' onChange={(e) => {checkComment(e);setComment(e.target.value)}} value={comment}></input>
                        <span className='text-callout opacity-50 fw-bold' id="post-btn" onClick={addComment}>Post</span>
                    </div>
                </div>
            </div>
        </div>
    )
}