
const bcrypt = require('bcryptjs'); // 用于密码加密和验证
const {User, Profile} = require('./Schema');

const isLoggedIn = require('./middleware/isLoggedIn'); // 引入中间件



const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        req.session.username = user.username; // 登录成功，存储 session 信息
        res.cookie('sid', req.sessionID, { httpOnly: true, secure:true, sameSite: 'None' }); // 设置 httpOnly cookie
        console.log('Response Headers:', res.getHeaders());

        console.log('cookie user:', req.session.username);

        res.status(200).send({ username: user.username, result: 'success' });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
};


const logout = [isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        res.clearCookie('sid'); // 确保清除浏览器中的 cookie
        res.status(200).send('OK');
    });
}];


const register = async (req, res) => {
    try {
        const { username, email, dob, phone, zipcode, password } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = new User({
            username,
            created: new Date(),
            id: await User.countDocuments() + 1,
            password: hashedPassword,

        });
        // 保存用户
        await newUser.save();
        const newProfile = new Profile({
            username,
            email,
            dob,
            phone,
            zipcode,
        });
        //console.error('Received dob:', dob); // 打印接收到的 dob


        try {
            await newProfile.save();
            //console.log('Profile saved successfully');
        } catch (err) {
            console.error('Error saving profile:', err);
        }

        res.status(201).send({ result: 'success', username: username });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { password: newPassword } = req.body;
        if (!req.session || !req.session.username) {
            return res.status(401).send({ error: 'User not logged in' });
        }
        const { username } = req.session; // 假设用户已登录并存储在 session 中


        // 加密新密码
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 更新用户密码
        const user = await User.findOneAndUpdate(
            { username },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ username, result: 'success' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};


// 注册新用户
const registerGoogleUser = async (req, res) => {
    //const { username, dob } = req.body;
    const { email, username, dob, picture } = req.body;

    try {
        // 验证用户名重复
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        // 验证年龄限制
        const birthDate = new Date(dob);
        const today = new Date(); // 当前日期

        // 计算用户是否已满 18 岁
        const ageCheck = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );

        if (birthDate > ageCheck) {

            return res.status(400).send({ error: 'You must be at least 18 years old to register.' });
        }

        // 创建用户
        const newUser = new User({
            id: await User.countDocuments() + 1,
            created: new Date(),
            username,
            googleId: email,
        });
        await newUser.save();

        // 创建对应 Profile
        const newProfile = new Profile({
            username,
            email,
            avatar: picture,
            dob,

        });
        await newProfile.save();

        // 登录成功后设置 cookie
        req.session.username = newUser.username;
        res.cookie('sid', req.sessionID, { httpOnly: true, secure:true , sameSite: 'None' });
        console.log('Response Headers:', res.getHeaders());

        console.log('cookie user:', req.session.username);
        return res.status(200).send({ username: newUser.username, result: 'registered' });
    } catch (err) {
        console.error('Error registering Google user:', err);
        return res.status(500).send({ error: 'Internal server error' });
    }
};

// 定义路由



module.exports = (app) => {
    app.post('/login', login);
    app.put('/logout', logout);
    app.post('/register', register);
    app.post('/google/register',  registerGoogleUser);
    app.put('/password', changePassword);
};
