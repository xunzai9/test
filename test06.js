const comicSource = {
  name: "鸟鸟韩漫",
  key: "nnhanman7",
  version: "1.0.21",
  minAppVersion: "1.0.0",
  url: "https://nnhanman7.com",

  getHeaders: function() {
    return {
      "Referer": "https://nnhanman7.com/",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Cache-Control": "max-age=0",
      "Upgrade-Insecure-Requests": "1",
    };
  },

  explore: [{
    title: "最新更新",
    type: "multiPartPage",
    load: function() {
      console.log("开始请求首页");
      // 修复：Network.get返回的是响应对象，需从data中取HTML
      return Network.get("https://nnhanman7.com", comicSource.getHeaders())
        .then(function(response) {
          // 关键：获取响应文本（response.data）
          const html = response.data || "";
          console.log("首页响应长度：" + html.length + "（前200字符：" + html.substring(0, 200) + "）");
          
          var comics = [];
          // 匹配网站的漫画列表正则
          var regex = /<li>[\s\S]*?<a class="ImgA" href="([^"]+)"[^>]*title="([^"]+)"[\s\S]*?<img src="([^"]+)"/g;
          var match;
          try {
            while ((match = regex.exec(html)) !== null) {
              const comicHref = match[1];
              const comicTitle = match[2];
              const comicCover = match[3];
              if (comicHref && comicHref.startsWith("/comic/")) {
                comics.push({ id: comicHref, title: comicTitle, cover: comicCover });
                console.log("解析到漫画：" + comicTitle);
              }
            }
          } catch (e) {
            console.error("解析错误：" + e.message);
          }
          
          console.log("有效漫画数量：" + comics.length);
          return [{ title: "首页推荐", comics: comics }];
        })
        .catch(function(err) {
          console.error("请求失败：" + err.message);
          return [{ title: "首页推荐", comics: [] }];
        });
    }
  }]
};

// 测试执行
comicSource.explore[0].load().then(res => console.log("最终结果：" + JSON.stringify(res)));
