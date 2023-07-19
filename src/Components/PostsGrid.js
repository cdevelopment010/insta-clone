

import '../Styles/postsGrid.css';
import { Link } from 'react-router-dom';

export default function PostsGrid({posts}) {
    return (
        <div className="posts-grid-container">
            {posts.map((post, ind) => {
                return (
                    <Link to={`/post/${post.id}`} className="post-item m-0 p-0"  key={`post-item-${ind}`}>
                        <div>
                            <img src={post?.imgUrls?.length > 0 ? post?.imgUrls[0] : ""} alt={`post-${ind}`}/>
                            <div className='d-none post-description'>
                                {post.description}
                            </div>
                        </div>
                    </Link>
                )
            })

            }
        </div>
    )
}