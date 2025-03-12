const { Profile, Article} = require('./Schema'); // 导入 Article 模型
const isLoggedIn = require('./middleware/isLoggedIn'); // 引入中间件


const getFollower = [isLoggedIn, async (req, res) => {
    let username = req.params.user; // 从 URL 参数中获取用户名
    if (!username) {
        username = req.session.username; // 当前登录用户;
    }
    try {
        const profile = await Profile.findOne({ username });

        if (!profile) {
            return res.status(404).send({ error: `User ${username} not found` });
        }
        if (!profile.following) {
            return res.status(201).send({ error: `Followers not found` });
        }
        res.status(200).send({
            username,
            following: profile.following,
        });
    } catch (err) {
        console.error('Error fetching following:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const putFollower = [isLoggedIn, async (req, res) => {
    const currentUser = req.session.username;
    const userToFollow = req.params.user;

    try {
        const currentProfile = await Profile.findOne({ username: currentUser });
        const targetProfile = await Profile.findOne({ username: userToFollow });

        if (!currentProfile) {
            return res.status(404).send({ error: `Current user ${currentUser} not found` });
        }

        if (!targetProfile) {
            return res.status(201).send({ error: `User not found` });
        }

        // 检查是否已经关注
        const isAlreadyFollowing = currentProfile.following.some(
            (f) => f === userToFollow

        );

        if (isAlreadyFollowing) {
            return res.status(201).send({ error: `User already followed` });
        }
        else{
            currentProfile.following.push(userToFollow);
            await currentProfile.save();
        }

        res.status(200).send({ following: currentProfile.following });

    } catch (err) {
        console.error('Error adding follower:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const deleteFollower = [isLoggedIn, async (req, res) => {
    const currentUser = req.session.username;
    const userToUnfollow = req.params.user;

    try {
        const currentProfile = await Profile.findOne({ username: currentUser });

        if (!currentProfile) {
            return res.status(404).send({ error: `Current user ${currentUser} not found` });
        }

        // 移除关注的用户
        currentProfile.following = currentProfile.following.filter(
            (f) => f !== userToUnfollow
        );

        await currentProfile.save();

        res.status(200).send({
            username: currentUser,
            following: currentProfile.following,
        });
    } catch (err) {
        console.error('Error removing follower:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}];

const followingRoutes = (app) => {
    //app.put('/password', (req, res) => res.send({ result: 'stub' }));

    //app.put('/articles/:id', (req, res) => res.send({ result: 'stub' }));
    app.get('/following/:user?', getFollower);
    app.put('/following/:user', putFollower);
    app.delete('/following/:user', deleteFollower);
};

module.exports = followingRoutes;
