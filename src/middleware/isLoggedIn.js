// middleware/isLoggedIn.js

const isLoggedIn = (req, res, next) => {

    //console.log('have username:',req.session);
    console.log('Session content:', req.session);
    if (!req.session || !req.session.username) {
        return res.status(401).send({ error: 'Unauthorized: User not logged in' });
    }
    //console.log(`User ${req.session.username} is logged in`); // 调试信息
    next(); // 如果用户已登录，继续处理请求
};

module.exports = isLoggedIn;
