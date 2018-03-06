var Mock = require('mockjs');
var ajax = require('../src/index');
var expect = require('chai').expect;

Mock.mock('http://mock.com/user/1', 'get', {
    name: 'tom',
    age: 23
});


Mock.mock('http://mock.com/user/2?search=age', 'get', {age: 23});

Mock.mock('http://mock.com/user', 'post', {
    age: 24
});

Mock.mock('http://mock.com/user/param', 'post', function (req) {
    describe('post传参测试', function () {
        it('age 应为 26', function (done) {
            expect(req.body.age).to.be.equal(26);
            done();
        });
    });
});

Mock.mock('http://mock.com/user', 'put', {
    age: 25
});

Mock.mock('http://mock.com/user/param', 'put', function (req) {
    describe('put传参测试', function () {
        it('age 应为 27', function (done) {
            expect(req.body.age).to.be.equal(27);
            done();
        });
    });
});

Mock.mock('http://mock.com/user', 'delete', {
    age: 28
});

describe('发送请求测试', function () {
    it('get请求 age 应为 23', function (done) {
        ajax({
            method: 'get',
            url: 'http://mock.com/user/1',
            onSuccess: function (data) {
                expect(data.age).to.be.equal(23);
                done();
            }
        });
    });

    it('post请求 age 应为 24', function (done) {
        ajax({
            method: 'post',
            url: 'http://mock.com/user',
            onSuccess: function (data) {
                expect(data.age).to.be.equal(24);
                done();
            }
        });
    });

    it('put请求 age 应为 25', function (done) {
        ajax({
            method: 'put',
            url: 'http://mock.com/user',
            onSuccess: function (data) {
                expect(data.age).to.be.equal(25);
                done();
            }
        });
    });

    it('delete请求 age 应为 28', function (done) {
        ajax({
            method: 'delete',
            url: 'http://mock.com/user',
            onSuccess: function (data) {
                expect(data.age).to.be.equal(28);
                done();
            }
        });
    });

});

ajax({
    method: 'get',
    url: 'http://mock.com/user/2',
    data: {search: 'age'}
});


ajax({
    method: 'post',
    url: 'http://mock.com/user/param',
    data: {name: 'cindy', age: 26}
});

ajax({
    method: 'put',
    url: 'http://mock.com/user/param',
    data: {name: 'cindy', age: 27}
});
