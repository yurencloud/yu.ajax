require.config({
    paths: {
        mock: '../node_modules/mockjs/dist/mock',
        jquery: '../node_modules/jquery/dist/jquery'
    }
});

require(['mock','jquery'], function (Mock) {
    // 使用 Mock
    Mock.mock('http://mock.com', {
        'name': '1',
        'age|1-100': 100,
        'color': '1'
    });
    // 输出结果
    $.get('http://mock.com', function (data) {
        console.log(data);
        console.table({
            "t sk":1
        });
    })
});
