const { User,Profile,Article } = require('./Schema'); // 导入 Profile 模型
const isLoggedIn = require('./middleware/isLoggedIn'); // 引入登录验证中间件

// 获取用户的 headline
const getHeadline = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, headline: profile.headline });
    } catch (err) {
        console.error('Error fetching headline:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];



// 更新当前登录用户的 headline
const updateHeadline = [isLoggedIn, async (req, res) => {
    const username = req.session.username; // 当前登录用户
    const { headline } = req.body; // 获取请求中的新 headline
    if (!headline) {
        return res.status(400).send({ error: 'Headline is required' });
    }
    try {
        const profile = await Profile.findOneAndUpdate(
            { username },
            { headline },
            { new: true } // 返回更新后的文档
        );
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, headline: profile.headline });
    } catch (err) {
        console.error('Error updating headline:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const getEmail = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, email: profile.email });
    } catch (err) {
        console.error('Error fetching email:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const updateEmail = [isLoggedIn, async (req, res) => {
    const username = req.session.username; // 当前登录用户
    const { email } = req.body; // 获取请求中的新 headline
    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }
    try {
        const profile = await Profile.findOneAndUpdate(
            { username },
            { email },
            { new: true } // 返回更新后的文档
        );
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, email: profile.email });
    } catch (err) {
        console.error('Error updating email:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];
const getZipcode = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, zipcode: profile.zipcode });
    } catch (err) {
        console.error('Error fetching zipcode:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const updateZipcode = [isLoggedIn, async (req, res) => {
    const username = req.session.username; // 当前登录用户
    const { zipcode } = req.body; // 获取请求中的新 headline
    if (!zipcode) {
        return res.status(400).send({ error: 'Zipcode is required' });
    }
    try {
        const profile = await Profile.findOneAndUpdate(
            { username },
            { zipcode },
            { new: true } // 返回更新后的文档
        );
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, zipcode: profile.zipcode });
    } catch (err) {
        console.error('Error updating zipcode:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const getPhone = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, phone: profile.phone });
    } catch (err) {
        console.error('Error fetching phone:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const updatePhone = [isLoggedIn, async (req, res) => {
    const username = req.session.username; // 当前登录用户
    const { phone } = req.body; // 获取请求中的新 headline
    if (!phone) {
        return res.status(400).send({ error: 'Headline is required' });
    }
    try {
        const profile = await Profile.findOneAndUpdate(
            { username },
            { phone },
            { new: true } // 返回更新后的文档
        );
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, phone: profile.phone });
    } catch (err) {
        console.error('Error updating phone:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const getDob = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, dob: profile.dob });
    } catch (error) {
        console.error('Error fetching DOB:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const getAvatar = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ username: profile.username, avatar: profile.avatar });
    } catch (err) {
        console.error('Error fetching avatar:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const getgoogleAccount = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await User.findOne({ username });
        if (!profile) {
            return res.status(404).send({ error: 'User not found' });
        }
        if(profile.googleId){
            if(profile.password){
                //has pass, a wen user already link google
                res.status(200).send({ username: profile.username, googleAccount: profile.googleId, result:'site' });
            }else{
                //no pass, a Google user.
                res.status(200).send({ username: profile.username, googleAccount: profile.googleId, result:'google'});
            }

        }else{
            res.status(201).send({result:'No google account'});
        }

    } catch (err) {
        console.error('Error fetching google account:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];



const deleteGoogleAccount = [
    isLoggedIn,
    async (req, res) => {
        try {
            let username = req.params.user; // 从 URL 参数中获取用户名
            if (!username) {
                username = req.session.username; // 当前登录用户;
            } // Get username from session

            // Find the user in the database
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            if(!user.googleId){
                return res.status(404).send({ error: 'User has no linked google account!' });
            }
            // Set googleId to an empty string
            user.googleId = '';
            await user.save(); // Save the updated user record

            res.status(200).send({ result: 'Google account successfully unlinked' });
        } catch (error) {
            console.error('Error unlinking Google account:', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }
];

// Add the route to your Express app

const linkAccount = async (req, res) => {
    const { userN, Googleaccount, newusername } = req.body;

    try {
        // 1. 查找Google登录的账户
        const googleUser = await User.findOne({ username: userN, googleId: Googleaccount });
        if (!googleUser) {
            return res.status(404).send({ error: 'Google account not found' });
        }

        // 通过Google登录的账户找到其Profile和关注列表
        const googleProfile = await Profile.findOne({ username: userN });
        if (!googleProfile) {
            return res.status(404).send({ error: 'Google profile not found' });
        }
        const googleFollowing = googleProfile.following;

        // 2. 查找内部账户
        const internalUser = await User.findOne({ username: newusername });
        if (!internalUser) {
            return res.status(404).send({ error: 'Internal account not found' });
        }

        // 更新内部账户，添加Google账户信息
        internalUser.googleId = Googleaccount;
        await internalUser.save();

        // 获取内部账户的Profile
        const internalProfile = await Profile.findOne({ username: newusername });
        if (!internalProfile) {
            return res.status(404).send({ error: 'Internal profile not found' });
        }

        if(googleFollowing){
            const mergedFollowing = [...new Set([...googleFollowing, ...internalProfile.following])].filter(
                (follower) => follower !== Googleaccount && follower !== newusername
            );
            internalProfile.following = mergedFollowing;
            await internalProfile.save();
        }
        // 合并关注列表，去重后保存



        // 3. 更新所有文章和评论的作者为内部账户用户名
        await Article.updateMany({ author: userN }, { author: newusername });
        await Article.updateMany(
            { 'comments.author': userN },
            { $set: { 'comments.$[elem].author': newusername } },
            { arrayFilters: [{ 'elem.author': userN }] }
        );

        // 4. 删除Google登录的账户和Profile
        await User.deleteOne({ username: userN, googleId: Googleaccount });
        await Profile.deleteOne({ username: userN });
        console.log('internal username:',internalUser.username);
        // 返回内部账户的基本信息
        return res.status(200).send({
            username: newusername,
            dob: internalProfile.dob,
            zipcode: internalProfile.zipcode,
            phone: internalProfile.phone,
            email: internalProfile.email,
            avatar:internalProfile.avatar,
        });
    } catch (error) {
        console.error('Error linking accounts:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
};






const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// 导出路由
module.exports = (app) => {
    app.get('/headline/:user?', getHeadline); // 获取 headline
    app.put('/headline', updateHeadline);    // 更新 headline
    app.get('/email/:user?', getEmail);
    app.put('/email',updateEmail);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);
    app.put('/phone', updatePhone);
    app.get('/dob/:user?', getDob);
    app.get('/phone/:user?', getPhone);
    app.get('/avatar/:user?', getAvatar);
    app.get('/googleAccount/:user?', getgoogleAccount);
    app.delete('/googleAccount/delete', deleteGoogleAccount);
    app.post('/linkAccount',linkAccount);
    app.put('/avatar', upload.single('avatar'),isLoggedIn, async (req, res) => {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }
        const username = req.session.username; // 当前登录用户

        try {
            // 上传图片到 Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer); // 将文件缓冲区发送到 Cloudinary
            });

            const profile = await Profile.findOneAndUpdate(
                { username },
                { avatar: result.secure_url},
                { new: true } // 返回更新后的文档
            );
            if (!profile) {
                return res.status(404).send({ error: 'User not found' });
            }
            //res.status(200).send({ username: profile.username, phone: profile.phone });

            // 返回图片的 URL
            res.status(200).send({
                message: 'Avatar uploaded successfully',
                avatar: result.secure_url, // 上传后的头像 URL
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    });



};
