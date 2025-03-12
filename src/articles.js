const { Article, Profile} = require('./Schema'); // 导入 Article 模型
const isLoggedIn = require('./middleware/isLoggedIn'); // 引入中间件


// 获取文章或用户的所有文章
const getArticles = [isLoggedIn, async (req, res) => {
    const { id } = req.params; // 可选参数：文章 ID 或用户名
    try {
        if (id) {
            // 判断是否为数字
            if (!isNaN(id)) {
                // 如果是数字，按文章 ID 查询
                const article = await Article.findOne({ id: parseInt(id) });
                if (!article) return res.status(404).send({ error: 'Article not found' });
                res.status(200).send({ articles: [article] });
            } else {
                // 如果是字符串，按用户名查询文章
                const articles = await Article.find({ author: id });
                if (articles.length === 0) {
                    return res.status(201).send({ error: 'No articles' });
                }
                res.status(200).send({ articles });
            }
        } else {
            // 查询当前登录用户的文章
            const articles = await Article.find({ author: req.session.username });
            if (articles.length === 0) {
                return res.status(201).send({ error: 'No articles' });
            }
            res.status(200).send({ articles });
        }
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];


// 更新文章或添加评论
const updateArticle = [isLoggedIn, async (req, res) => {
    const { id } = req.params; // 文章 ID
    const { text, commentId } = req.body; // 更新内容或评论 ID
    try {
        const article = await Article.findOne({ id: parseInt(id) });

        if (!article) return res.status(404).send({ error: 'Article not found' });

        if (commentId === undefined) {
            // 更新文章内容，需要验证作者身份
            if (article.author !== req.session.username) {
                return res.status(403).send({ error: 'Forbidden: Not the article owner' });
            }
            article.text = text;
        } else if (commentId === -1) {
            // 添加新评论
            const newComment = {
                id: article.comments.length + 1,
                author: req.session.username, // 当前登录用户
                text: text,
            };
            article.comments.push(newComment);
        } else {
            // 更新指定评论，需要验证评论作者身份
            const comment = article.comments.find((c) => c.id === commentId);
            if (!comment) return res.status(404).send({ error: 'Comment not found' });

            if (comment.author !== req.session.username) {
                return res.status(403).send({ error: 'Forbidden: Not the comment owner' });
            }

            comment.text = text;
        }

        await article.save();
        res.status(200).send({ articles: [article] });
    } catch (err) {
        console.error('Error updating article:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
// 配置 Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// 配置 Multer 中间件


// 添加新文章
const addArticle = [isLoggedIn,  async (req, res) => {
    const {  title, text, image } = req.body; // 文章内容

    try {

        // 创建新文章
        const newArticle = new Article({
            id: await Article.countDocuments() + 1, // 自动生成唯一 ID
            author: req.session.username, // 当前登录用户
            title,
            text,
            image: image  || '',
            created: new Date(), // 设置创建时间为当前时间
            comments: [],
        });

        // 保存到数据库
        await newArticle.save();

        res.status(201).send({ articles: [newArticle] });
    } catch (err) {
        console.error('Error adding new article:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

// 导出路由
module.exports = (app) => {
    app.get('/articles/:id?', getArticles); // 获取文章
    app.put('/articles/:id', updateArticle); // 更新文章或添加评论
    app.post('/article', addArticle); // 添加新文章
    app.put('/uploadImage', upload.single('image'),isLoggedIn, async (req, res) => {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        try {
            // 上传图片到 Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer); // 将文件缓冲区发送到 Cloudinary
            });
            res.status(200).send({ image: result.secure_url });
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).send({ error: 'Failed to upload image.' });
        }
    });


};
