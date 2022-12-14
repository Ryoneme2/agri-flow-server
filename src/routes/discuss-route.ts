import express from 'express'
import * as controller from '@controller/discuss'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { upload } from '@config/uploadFileConfig';
const route = express.Router()

// add post, get suggest, get by id, edit, delete

route.get('/post', authSoft, controller.post.getRecentPost);
route.get('/post/:postId', controller.post.getById);
route.get('/post/u/:username', authSoft, controller.post.getByUsername);
// route.get('/post/recent', controller.post.getRecentPost);
route.post('/post', auth, upload.single('file'), controller.post.newPost);
route.put('/post/:postId', auth, controller.post.editPost);
route.delete('/post/:postId', auth, controller.post.deletePost);

route.post('/comments/', auth, controller.comment.newComment);
route.get('/comments/:postId', controller.comment.getCommentByPost);

route.put('/like/:postId', auth, controller.like.updateLike)

export default route
