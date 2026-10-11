import { useState } from 'react';
import './Post.css';

function Post() {
  const [postType, setPostType] = useState('Question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [articleText, setArticleText] = useState('');
  const [tags, setTags] = useState('');

  function handlePost(event) {
    event.preventDefault();

    if (title.trim() === '') {
      alert('Please enter a title.');
    }
    else if (tags.trim() === '') {
      alert('Please enter at least one tag.');
    }
    else if (tags.split(',').filter(tag => tag.trim() !== '').length > 3) {
      alert('You can enter a maximum of 3 tags.');
    }
    else if (postType === 'Question' && description.trim() === '') {
      alert('Please describe your problem.');
    }
    else if (postType === 'Article' && abstractText.trim() === '') {
      alert('Please enter an abstract.');
    }
    else if (postType === 'Article' && articleText.trim() === '') {
      alert('Please enter the article text.');
    }
    else {
      alert('Your post has been submitted successfully!');

      setTitle('');
      setDescription('');
      setAbstractText('');
      setArticleText('');
      setTags('');
    }
  }

  return (
    <div className="post-page">
      <form className="post-form" onSubmit={handlePost}>

        <h1>New Post</h1>

        <div className="post-type">
          <strong>Select Post Type:</strong>

          <label>
            <input
              type="radio"
              name="postType"
              checked={postType === 'Question'}
              onChange={() => setPostType('Question')}
            />
            Question
          </label>

          <label>
            <input
              type="radio"
              name="postType"
              checked={postType === 'Article'}
              onChange={() => setPostType('Article')}
            />
            Article
          </label>
        </div>

        <h3>What do you want to ask or share?</h3>

        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            placeholder={
              postType === 'Question'
                ? 'Start your question with how, what, why, etc.'
                : 'Enter a descriptive title'
            }
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        {postType === 'Question' ? (
          <div className="form-group">
            <label>Describe your problem</label>

            <textarea
              placeholder="Explain your problem here..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Abstract</label>

              <textarea
                placeholder="Write a short summary of your article..."
                value={abstractText}
                onChange={(event) => setAbstractText(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Article Text</label>

              <textarea
                className="article-content"
                placeholder="Write your article here..."
                value={articleText}
                onChange={(event) => setArticleText(event.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Tags</label>

          <input
            type="text"
            placeholder="Enter up to 3 tags, separated by commas"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <button type="submit" className="post-button">
          Post
        </button>

      </form>
    </div>
  );
}

export default Post;