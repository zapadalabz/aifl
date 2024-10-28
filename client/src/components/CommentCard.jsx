import '../styles/comments.css';

const CommentCard = ({ comment }) => {
    //comment = {Name: "", Length: 0, "Style-Guide": {"Edited Comment": "", "Changes Made": ""}, "Further Considerations": ""}}
    return (
        <div className="comment-card">
            <div className="comment-card-header">
                <h5>{comment.Name}</h5>
                <h6>{comment.Length}  Characters</h6>
            </div>
            <div className="comment-card-body">
                <p>{comment["Style-Guide"]["Edited Comment"]}</p>
            </div>
            <div className="comment-card-footer">
                <p>{comment["Style-Guide"]["Changes Made"]}</p>
                <p><strong>{comment["Further Considerations"]}</strong></p>
            </div>
        </div>
    );
};

export default CommentCard;