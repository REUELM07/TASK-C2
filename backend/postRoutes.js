import express from 'express';
import { db } from './firebaseAdmin.js';
import { verifyToken } from './authMiddleware.js';

const router = express.Router();

// save a new post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { postType, title, description, abstractText, articleText, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please enter a title.' });
    }

    const post = {
      postType,
      title: title.trim(),
      description: description || '',
      abstractText: abstractText || '',
      articleText: articleText || '',
      tags: Array.isArray(tags) ? tags : [],
      authorId: req.user.userId,
      createdAt: new Date().toISOString()
    };

    const postRef = await db.collection('posts').add(post);

    return res.status(201).json({
      message: 'Your post has been submitted successfully!',
      postId: postRef.id
    });
  } catch (error) {
    console.error('Post creation error:', error.message);

    return res.status(500).json({
      message: 'Unable to save your post. Please try again.'
    });
  }
});

export default router;