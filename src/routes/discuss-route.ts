import express from 'express'
import * as controller from '@controller/discuss'
import auth, { authSoft } from '@middleware/auth'
import * as redis from '@middleware/redis'
import { updateBlogView } from '@middleware/updateBlogView'
import { upload } from '@config/uploadFileConfig';
const route = express.Router()

// add post, get suggest, get by id, edit, delete

route.get('/', auth, controller.post.getRecentPost);
// route.get('/individual/:postId', auth, controller.post.getById);
route.get('/recent', auth, controller.post.getRecentPost);
route.post('/', auth, upload.single('file'), controller.post.newPost);
route.put('/:postId', auth, controller.post.editPost);
route.delete('/:postId', auth, controller.post.deletePost);

// route.put('/like/:postId', auth, controller.like.updateLike);

route.post('/comments/add', auth, controller.comment.newComment);
route.get('/comments/:postId', auth, controller.comment.getCommentByPost);

export default route
