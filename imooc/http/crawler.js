/**
 * Created by Administrator on 2017/2/24.
 */
var http = require('http');
var url = 'http://www.imooc.com/learn/348';
var cheerio = require('cheerio');

function filterChapters(html) {
    var $ = cheerio.load(html);
    var chapters = $('.chapter');

    var courseData = [];
    chapters.each(function (item) {/*遍历全部chapters，拿出每一个单独的chapter*/
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').first().text();
        var videos = chapter.find('.video').children('li');/*ul列表*/
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        };
        videos.each(function (item) {/*遍历全部videos即ul列表，拿出每一个单独的video即li*/
            var video = $(this).find('a');
            var videoTitle = video.text();
            var id = video.attr('href').split('video/')[1];/*split分割成2段后，拿第二段的内容*/
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        });
        courseData.push(chapterData);
    });
    return courseData;
}
function printCourseInfo (courseData){
    courseData.forEach(function (item) {
        var chapterTitle = item.chapterTitle;
        console.log(chapterTitle + '\n');
        item.videos.forEach(function (video) {
            console.log('【' + video.id + '】' + video.title +'\n');
        })
    })
}
http.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data
    });
    res.on('end', function () {
        var courseData = filterChapters(html);
        printCourseInfo(courseData)
    });
}).on('error', function () {
    console.log('出错')
});