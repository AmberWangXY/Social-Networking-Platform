const request = require('supertest');
const app = require('../../index'); // 替换为你的 Express 主文件路径
const mongoose = require('mongoose');
const { Article, User } = require('../../src/Schema');



describe('API Tests', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect('mongodb+srv://amberwang:wangxinyu521@cluster0.38uac.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
    });

    const testUser = {

        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
        dob: '2000-01-01',
        phone: '1234567890',
        zipcode: '12345',
    };

    let sessionCookie;
    let articleId;



    afterAll(async () => {
        if (mongoose.connection.readyState === 1) {
            //await mongoose.connection.db.dropDatabase();
        }
        await Article.deleteMany({ author: testUser.username });
        await User.deleteOne({ username: testUser.username });
        //await mongoose.disconnect();
        await mongoose.connection.close();
    });


    it('POST /register - should register a user', async () => {
        const res = await request(app).post('/register').send(testUser);
        //console.log('Register response:', res.body); // 打印响应内容
        expect(res.status).toBe(201);
        expect(res.body.result).toBe('success');


    });

    it('POST /login - should log in a user', async () => {
        const res = await request(app).post('/login').send({
            username: testUser.username,
            password: testUser.password,
        });

        expect(res.status).toBe(200);
        sessionCookie = res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : null;
        //console.log('login session:',res.headers['set-cookie']);


        expect(sessionCookie).toBeDefined();
        //expect(sessionCookie).toContain('sid='); // 验证 Cookie 包含 sid
    });

    it('POST /article - should add a new article', async () => {
        const res = await request(app)
            .post('/article')
            .set('Cookie', sessionCookie)
            .send({ text: 'My first article' });
        expect(res.status).toBe(201);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles[0].text).toBe('My first article');
        articleId = res.body.articles[0].id; // 保存文章 ID
    });

    it('GET /articles/:id? - should get all articles for logged-in user', async () => {
        const res = await request(app)
            .get('/articles')
            .set('Cookie', sessionCookie);
        expect(res.status).toBe(200);
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles[0].author).toBe(testUser.username);
    });

    it('GET /articles/:id? - should get a specific article by ID', async () => {
        const res = await request(app)
            .get(`/articles/${articleId}`)
            .set('Cookie', sessionCookie);
        expect(res.status).toBe(200);
        expect(res.body.articles[0].id).toBe(articleId);
        expect(res.body.articles[0].author).toBe(testUser.username);
    });



    it('GET /headline/:user? - should get headline for a user', async () => {
        const res = await request(app)
            .get(`/headline/${testUser.username}`)
            .set('Cookie', sessionCookie);
        expect(res.status).toBe(200);
        expect(res.body.username).toBe(testUser.username);
    });

    it('PUT /headline - should update the headline for the logged-in user', async () => {
        const res = await request(app)
            .put('/headline')
            .set('Cookie', sessionCookie)
            .send({ headline: 'Updated headline' });
        expect(res.status).toBe(200);
        expect(res.body.headline).toBe('Updated headline');
    });
    it('PUT /logout - should log out the user', async () => {
        const res = await request(app)
            .put('/logout')
            .set('Cookie', sessionCookie); // 传递 Cookie

        expect(res.status).toBe(200);
    });
});
