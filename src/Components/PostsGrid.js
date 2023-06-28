

import '../Styles/postsGrid.css';

export default function PostsGrid({posts}) {
    return (
        <div className="posts-grid-container">
            {posts.map((post, ind) => {
                return (
                    <div className="post-item" key={`post-item-${ind}`}>
                        <img src={post?.imgUrls?.length > 0 ? post?.imgUrls[0] : ""} alt={`post-${ind}`}/>
                        <div className='d-none post-description'>
                            {post.description}
                        </div>
                    </div>
                )
            })

            }
        </div>
    )
}