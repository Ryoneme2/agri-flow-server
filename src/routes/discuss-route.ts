import express from 'express'
import * as controller from '@controller/discuss'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { upload } from '@config/uploadFileConfig';
const route = express.Router()

// add post, get suggest, get by id, edit, delete

route.get('/post', auth, controller.post.getRecentPost);
// route.get('/individual/:postId', auth, controller.post.getById);
route.get('/post/recent', auth, controller.post.getRecentPost);
route.post('/post', auth, upload.single('file'), controller.post.newPost);
route.put('/post/:postId', auth, controller.post.editPost);
route.delete('/post/:postId', auth, controller.post.deletePost);

// route.put('/like/:postId', auth, controller.like.updateLike);

route.post('/comments/add', auth, controller.comment.newComment);
route.get('/comments/:postId', auth, controller.comment.getCommentByPost);

export default route
