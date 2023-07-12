import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

import Firebase from '../Firebase';
import { getDocs, deleteDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function Comment({comment, currentUser, postuserid, postid, refreshComments, toast}) {
    const [showCommentOptions, setShowCommentOptions] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [commentEditing, setCommentEditing] = useState(comment.comment);
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
            toast.updateMessage("Comment has been deleted.");
            toast.updateType("danger");
            toast.updateTimeout(2000);
            toast.updateVisible();

        } catch(error){
            console.error(error);
        }
    } 

    const startEdit = (e)=> {
        e.preventDefault();
        setEditComment(true); 
        setShowCommentOptions(false);

    }

    const cancelEdit = (e) => {
        setCommentEditing(comment.comment);
        setEditComment(false);
    }

    const saveCommentEdit = async (e) => {
        try {
            await updateDoc(doc(commentsRef, comment.id),{
                commentDate: serverTimestamp(),
                comment: commentEditing
            }); 
            setEditComment(false);
            await refreshComments();
            toast.updateMessage("Comment has been updated.")
            toast.updateType("success");
            toast.updateTimeout(2000);
            toast.updateVisible();

        } catch(error) {
            console.error(error);
        }
    }
    

    return(
        <div className="comment-container">
            {
                !editComment &&
                <div className='d-flex justify-content-start align-items-center'>
                    <span className='comment'>
                        <span className='fw-bold me-3'>{comment?.username ?  comment?.username : '' }</span>
                        {comment.comment}
                    </span>
                </div>
            }
            {
                editComment &&
                <div className='edit-comment'>
                    <textarea type="text" value={commentEditing} onChange={(e) => setCommentEditing(e.target.value)}></textarea>
                    <div className="btn-group">
                        <button onClick={saveCommentEdit} className='me-1'>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                    </div>
                </div>
            }
            <div className='d-flex justify-content-between align-items-center'>
                <div className='text-uppercase text-secondary fs-xs align-self-bottom'>{timeString}</div>
                {(comment.userid == currentUser?.userid || postuserid == currentUser?.userid)
                    &&
                    <div className='align-self-top comment-options'>
                        <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer ' 
                                        tabIndex={0}
                                        onBlur={(e) => {setTimeout(()=>setShowCommentOptions(false),200)}} 
                                        onClick={(e) => {setShowCommentOptions(!showCommentOptions);e.target.focus()}}/>
                        <div className={`${showCommentOptions ? '' : 'd-none'} comment-options-list`}>
                            <ul>
                                <li onClick={startEdit}>Edit comment</li>
                                <li className='text-danger' onClick={deleteComment}>Delete comment</li>
                            </ul>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}