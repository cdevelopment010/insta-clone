import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

import Firebase from '../Firebase';
import { getDocs, deleteDoc, collection, doc } from 'firebase/firestore';

export default function Comment({comment, currentUser, postuserid, postid, refreshComments}) {
    const [showCommentOptions, setShowCommentOptions] = useState(false);
    const commentsRef = collection(Firebase.db, "posts", postid, "comments"); 

    let vDate = new Date(comment.commentDate.seconds * 1000 + comment.commentDate.nanoseconds / 1000000);
    let now = new Date(); 
    let minutes = Math.floor((now - vDate)/ (1000*60)); 
    let hours = Math.floor((now - vDate)/ (1000*60*60)); 
    let days = Math.floor((now - vDate)/ (1000*60*60*24)); 
    let timeString = ""; 
    if (days > 0) {
        timeString += days + ' days ago';
    } else if (hours >0) {
        timeString += hours + ' hours ago';
    } else {
        timeString += minutes + ' minutes ago';
    }

    const deleteComment = async (e) => {
        console.log("deleteComment:", comment.id, commentsRef);
        let docRef = doc(commentsRef, comment.id);
        console.log(docRef);
        try {
            await deleteDoc(docRef);
            await refreshComments();

        } catch(error){
            console.error(error);
        }
    } 

    

    return(
        <div className="comment-container">
            
            <div className='d-flex justify-content-start align-items-center'>
                <span className='fw-bold me-3'>{comment?.username ?  comment?.username : '' }</span>
                <span>{comment.comment}</span>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='text-uppercase text-secondary fs-xs align-self-bottom'>{timeString}</div>
                {(comment.userid == currentUser?.userid || postuserid == currentUser?.userid)
                    &&
                    <div className='align-self-top comment-options'>
                        <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer ' onClick={(e) => setShowCommentOptions(!showCommentOptions)}/>
                        <div className={`${showCommentOptions ? '' : 'd-none'} comment-options-list`}>
                            <ul>
                                <li>Edit comment</li>
                                <li className='text-danger' onClick={deleteComment}>Delete comment</li>
                            </ul>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}