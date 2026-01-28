class NnHanman7Source extends ComicSource {
    // 基础信息
    name = "鸟鸟韩漫"
    key = "nnhanman7"
    version = "1.0.21"
    minAppVersion = "1.0.0"
    url = "https://nnhanman7.com"

    // 获取请求头
    getHeaders() {
        return {
            "Referer": "https://nnhanman7.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };
    }

    // 探索页配置
    explore = [
        {
            title: "最新更新",
            type: "multiPartPage",
            load: async (page) => {
                return Network.get("https://nnhanman7.com", this.getHeaders())
                    .then((res) => {
                        const comics = [];
                        const regex = /<li>[\s\S]*?href="([^"]+)"[^>]*title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
                        let match;
                        while ((match = regex.exec(res)) !== null) {
                            if (match[1].indexOf('/comic/') !== -1) {
                                comics.push({
                                    id: match[1],
                                    title: match[2],
                                    cover: match[3]
                                });
                            }
                        }
                        return [{ title: "首页推荐", comics: comics }];
                    });
            }
        }
    ];

    // 漫画详情 & 章节加载配置
    comic = {
        // 加载漫画信息（章节列表）
        loadInfo: async (id) => {
            return Network.get("https://nnhanman7.com" + id, this.getHeaders())
                .then((res) => {
                    const chapters = [];
                    const reg = /href="([^"]+)"[^>]*>([\s\S]*?第[\s\S]*?话[\s\S]*?)<\/a>/g;
                    let m;
                    while ((m = reg.exec(res)) !== null) {
                        chapters.push({
                            id: m[1],
                            title: m[2].replace(/<[^>]+>/g, "").trim()
                        });
                    }
                    return { title: "漫画详情", chapters: chapters };
                });
        },

        // 加载章节图片
        loadEp: async (comicId, epId) => {
            return Network.get("https://nnhanman7.com" + epId, this.getHeaders())
                .then((res) => {
                    const images = [];
                    let m;
                    const reg = /img[^>]+src="([^"]+)"/g;
                    while ((m = reg.exec(res)) !== null) {
                        if (m[1].indexOf('jmpic') !== -1) {
                            images.push(m[1]);
                        }
                    }
                    return { images: images };
                });
        }
    };

    // 标签建议选中事件（无实现）
    onTagSuggestionSelected(keyword) {
        return null;
    }
}

// 注册漫画源
registerComicSource(NnHanman7Source);
