import Avatar from './Avatar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';


import '../Styles/post.css';
import { useEffect, useState  } from 'react';

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


export default function Post({ postID }) {

    //these variables will be set using data from the backend.
    let userName ="craig.m.davison";
    let likeCounter = 9000;
    let commentCounter = 28;
    let postDetail= "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in augue sit amet arcu finibus ultrices. Vestibulum porta, est et euismod euismod, urna nulla rutrum nisi, non placerat leo enim nec neque. Sed sit amet tincidunt erat, eget placerat quam. Donec venenatis consectetur ultricies. Cras justo risus, suscipit eu tempus nec, accumsan eu urna. Curabitur sed risus dapibus, tristique quam id, ullamcorper felis. Proin erat metus, commodo a massa eget, feugiat porta neque. Cras bibendum augue in est aliquet convallis. Cras sed ante urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras dapibus dolor turpis, vitae vehicula tortor placerat sed. Proin vitae sem tellus. Ut consequat lorem a orci suscipit faucibus. Proin condimentum velit id leo posuere facilisis. Aliquam at mauris turpis."
    let [showPostDetail, setShowPostDetail] = useState(postDetail.length > 100 ? false : true)

    useEffect(() => {
        // console.log("post detail length: ", postDetail.length)
        // console.log("showPostDetail:", showPostDetail)
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

    return (
        <div className="post-container">
            <div className="post-header d-flex align-items-center justify-content-between p-2">
                <div className="d-flex align-items-center">
                    <Avatar size="md" src="" className='me-1'/>
                    <span className='fw-bold'>{userName}</span>
                </div>
                <div className='me-2'>
                    <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer'/>
                </div>
            </div>
            <div className="post-content"></div>
            <div className="post-comments p-2">
                {/* Icons */}
                <div className='icon-section d-flex align-items-center justify-content-between '>
                    <div className="icons d-flex align-items-center ">
                        <svg height="25" width="25" className='me-2 cursor-pointer svg-icon'>
                            <HeartSvg height="25" width="25" />
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
                    <span className="fw-bold">{userName}</span>
                    {postDetail.length > 100 && !showPostDetail
                        &&
                        <div>
                            <span>{postDetail.substring(0,100)}...</span>
                            <br></br>
                            <span className='cursor-pointer text-secondary' onClick={togglePostDetail}>more</span>
                        </div>
                    }
                    {showPostDetail
                        &&
                        <div>
                            <span>{postDetail}</span>
                            <br></br>
                            <span className='cursor-pointer text-secondary' onClick={togglePostDetail}>hide</span>
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