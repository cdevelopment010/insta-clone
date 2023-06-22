import Avatar from './Avatar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {getDownloadURL, ref, listAll} from 'firebase/storage'
import Firebase, { db } from '../Firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, serverTimestamp, getCountFromServer } from "firebase/firestore";

import '../Styles/post.css';
import { useEffect, useState  } from 'react';
import { Link } from 'react-router-dom';

/* SVG ICONS */
import {ReactComponent as HomeSolid} from '../Icons/svg/home-solid.svg';
import {ReactComponent as HomeSvg} from '../Icons/svg/home-regular.svg';
import {ReactComponent as HeartSolid} from '../Icons/svg/heart-solid.svg';
import {ReactComponent as HeartSvg} from '../Icons/svg/heart-regular.svg';
import {ReactComponent as SearchSolid} from '../Icons/svg/search-solid.svg';
import {ReactComponent as SearchSvg} from '../Icons/svg/search-regular.svg';
import {ReactComponent as CompassSolid} from '../Icons/svg/compass-north-solid.svg';
import {ReactComponent as CompassSvg} from '../Icons/svg/compass-north-regular.svg';
import {ReactComponent as ReelsSolid} from '../Icons/svg/instagram-reels-solid.svg';
import {ReactComponent as ReelsSvg} from '../Icons/svg/instagram-reels-regular.svg';
import {ReactComponent as ShareSolid} from '../Icons/svg/instagram-share-solid.svg';
import {ReactComponent as ShareSvg} from '../Icons/svg/instagram-share-regular.svg';
import {ReactComponent as AddSolid} from '../Icons/svg/add-button-solid.svg';
import {ReactComponent as AddSvg} from '../Icons/svg/add-button-regular.svg';
import {ReactComponent as CommentSolid} from '../Icons/svg/instagram-comment-solid.svg';
import {ReactComponent as CommentSvg} from '../Icons/svg/instagram-comment-regular.svg';
import {ReactComponent as BookmarkSolid} from '../Icons/svg/bookmark-ribbon-solid.svg';
import {ReactComponent as BookmarkSvg} from '../Icons/svg/bookmark-ribbon-regular.svg';
import { counter } from '@fortawesome/fontawesome-svg-core';


export default function Post({ post }) {

    const [user, setUser] = useState(null);
    const [postDetail, setPostDetail] = useState(post.description.split('#'));
    const [images, setImages] = useState(post?.imgUrls || [])
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [likeCounter, setLikeCounter] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    // const [description, setDescription] = useState(post.description);


    //these variables will be set using data from the backend.
    // let userName ="craig.m.davison";

    let commentCounter = 28;
    // let postDetail= "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in augue sit amet arcu finibus ultrices. Vestibulum porta, est et euismod euismod, urna nulla rutrum nisi, non placerat leo enim nec neque. Sed sit amet tincidunt erat, eget placerat quam. Donec venenatis consectetur ultricies. Cras justo risus, suscipit eu tempus nec, accumsan eu urna. Curabitur sed risus dapibus, tristique quam id, ullamcorper felis. Proin erat metus, commodo a massa eget, feugiat porta neque. Cras bibendum augue in est aliquet convallis. Cras sed ante urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras dapibus dolor turpis, vitae vehicula tortor placerat sed. Proin vitae sem tellus. Ut consequat lorem a orci suscipit faucibus. Proin condimentum velit id leo posuere facilisis. Aliquam at mauris turpis."
    let [showPostDetail, setShowPostDetail] = useState(postDetail[0].length > 100 ? false : true)

    const userCollectionRef = collection(Firebase.db, 'users');
    const likesRef = collection(Firebase.db, "posts", post.id, "likes"); 

    useEffect(() => {
        console.log("Check..")
    },[userLiked])

    useEffect(() => {
        const getData = async () => {
            const postUser = query(userCollectionRef, where("userid", "==", post.userid)); 
            const querySnapshop = await getDocs(postUser); 
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id}
                setUser(data);
            })

            const likesCount = await getCountFromServer(likesRef); 
            console.log();
            setLikeCounter(likesCount.data().count);

            const userLiked = query(likesRef, where("userid", "==", Firebase?.auth?.currentUser?.uid)); 
            const likesSnapshot = await getDocs(userLiked); 
            setUserLiked(likesSnapshot.size > 0 ? true : false);
            

        }
        getData();
        console.log("UseEffect in Post: Gets userData (this happens in multiple places and should be re-written). This fires per post which isn't good. ")
    }, [])


    function togglePostDetail() {
        setShowPostDetail(!showPostDetail);
    }

    function checkComment(e) {
        if (e.target.value.length) {
            document.getElementById('post-btn').classList.add('opacity-100','cursor-pointer');
            document.getElementById('post-btn').classList.remove('opacity-50');
        } else {
            document.getElementById('post-btn').classList.remove('opacity-100','cursor-pointer');
            document.getElementById('post-btn').classList.add('opacity-50');
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
        console.log("clicked likes", Firebase.auth.currentUser.uid);
        const userLiked = query(likesRef, where("userid", "==", Firebase?.auth?.currentUser?.uid)); 
        const querySnapshop = await getDocs(userLiked);
        console.log(querySnapshop.size)
        if (querySnapshop.size > 0){
            //delete doc
            
            console.log("remove like");
            querySnapshop.forEach(async (docLikes) => {
                // const data = {...doc.data(), id: doc.id};
                await deleteDoc(docLikes.ref);
                const likesCount = await getCountFromServer(likesRef); 
                setLikeCounter(likesCount.data().count);
                setUserLiked(false)
            })
        } else {
            //add doc
            // const data = {...doc.data(), id: doc.id};
            console.log("add like");
            await addDoc(likesRef, {
                userid: Firebase.auth.currentUser.uid,
                likedDate: serverTimestamp()
            })
            const likesCount = await getCountFromServer(likesRef); 
            setLikeCounter(likesCount.data().count);
            setUserLiked(true);
        }


    }

    return (
        <div className="post-container">
            <div className="post-header d-flex align-items-center justify-content-between p-2">
                <div className="d-flex align-items-center">
                    <Avatar size="md" src={user?.profileImgUrl[0]} className='me-1'/>
                    <span className='fw-bold'>{user?.username}</span>
                </div>
                <div className='me-2'>
                    <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer'/>
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
                                    return <div className={`image-counter cursor-pointer ${ind === currentImageIndex ? 'fill' : ''}`} key={`image-counter-${ind}`} onClick={() => setCurrentImageIndex(ind)}></div>
                                })
                            }
                        </div>
                    }               
                </div>
            </div>
            <div className="post-comments p-2">
                {/* Icons */}
                <div className='icon-section d-flex align-items-center justify-content-between '>
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
                        <svg height="25" width="25" className='me-2 cursor-pointer svg-icon'>
                            <CommentSvg height="25" width="25" />
                        </svg>
                        <svg height="25" width="25" className='me-2 cursor-pointer svg-icon'>
                            <ShareSvg height="25" width="25" />
                        </svg>
                    </div>
                    <div className="bookmark d-flex align-items-center">
                        <svg height="25" width="25" className="me-2 cursor-pointer svg-icon">
                            <BookmarkSvg height="25" width="25" />
                        </svg>
                    </div>
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
                                if (ind == 0) {return}
                                console.log(detail)
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
                                if (ind == 0) {return}
                                return <Link to={`/tags/${detail}`} key={ind} className='me-1'>#{detail}</Link>
                            })}</span>
                            <br></br>
                            {/* <span className='cursor-pointer text-secondary' onClick={togglePostDetail}>hide</span> */}
                        </div>
                    }
                </div>
                {/* Comment section */}
                <div className="comments-container fs-sm pt-2">
                    <span className='text-secondary cursor-pointer'>View all {commentCounter} comments</span>
                    <div className="comments pb-2">
                        {/* Loop through comments */}
                    </div>
                    <div className='hr'></div>
                    <div className='d-flex align-items-center justify-content-between pt-2'>
                        <input className='text-secondary comment-input flex-1 me-1 border-0' placeholder='Add a comment...' onChange={checkComment}></input>
                        <span className='text-callout opacity-50 fw-bold' id="post-btn">Post</span>
                    </div>
                </div>
            </div>
        </div>
    )
}