(function (global) {
  "use strict";

  var MAX_RECOMMENDATIONS = 3;

  var routeTemplate = {
    scores: {
      warmupDistance: 90,
      runningExperience: 90,
      safety: 88,
      greenEnvironment: 90,
      cityExperience: 88
    },
    pros: [
      "路面平坦，适合稳定配速训练",
      "沿途有树荫，跑步体验舒适",
      "照明良好，早晚都有跑者经过"
    ],
    cons: [
      "周末上午人流较多",
      "部分路段补水点较少"
    ]
  };

  var cityCatalog = {
    "上海": {
      center: [121.473701, 31.230416],
      routes: [
        {
          rank: 1,
name: "世纪公园（3公里轻松环线）",
          distanceFromHotel: "0.5 公里",
          lng: 121.497835,
          lat: 31.236342,
          overallScore: 94,
          scores: { warmupDistance: 96, runningExperience: 93, safety: 91, greenEnvironment: 88, cityExperience: 96 },
          pros: ["路面平坦，适合稳定配速", "浦江两岸视野开阔，城市感强", "夜间照明完善，傍晚跑步很舒适"],
          cons: ["周末游客较多", "部分路段无遮阳"],
          whyRecommended: "距离市中心酒店最近的高品质滨江路线，热身短、出发即跑，能一边跑步一边感受上海天际线。"
        },
        {
          rank: 2,
          name: "陆家嘴滨江步道（5公里江景路线）",
          distanceFromHotel: "1.8 公里",
          lng: 121.551991,
          lat: 31.210704,
          overallScore: 91,
          scores: { warmupDistance: 82, runningExperience: 95, safety: 92, greenEnvironment: 98, cityExperience: 85 },
          pros: ["专用跑步道，里程标识清晰", "大面积绿植，噪音小、体感凉爽", "路线成熟，适合日常训练"],
          cons: ["从多数酒店需 10 分钟左右热身慢跑", "公园入口偶有等待"],
          whyRecommended: "上海跑友最爱的城市绿洲，绿化与城市氛围平衡极佳，适合想跑一场「有记忆点」的路线。"
        },
        {
          rank: 3,
          name: "前滩休闲公园（8公里绿道）",
          distanceFromHotel: "1.2 公里",
          lng: 121.465234,
          lat: 31.188876,
          overallScore: 88,
          scores: { warmupDistance: 88, runningExperience: 89, safety: 90, greenEnvironment: 86, cityExperience: 90 },
          pros: ["江景与公共艺术结合，跑步不枯燥", "专用步道，车辆干扰少", "适合轻松跑与拍照"],
          cons: ["部分路段风较大", "3 公里后补给较少"],
          whyRecommended: "想在跑步中感受上海文艺与城市更新氛围的首选，江风与绿道体验独特。"
        }
      ]
    },
    "北京": {
      center: [116.407526, 39.90403],
      routes: [
        {
          rank: 1,
          name: "奥林匹克森林公园南园环线",
          distanceFromHotel: "0.6 公里",
          lng: 116.393589,
          lat: 40.008759,
          overallScore: 95,
          scores: { warmupDistance: 94, runningExperience: 96, safety: 93, greenEnvironment: 98, cityExperience: 86 },
          pros: ["北京顶级跑步圣地，氛围专业", "5 公里与 10 公里环线标识清晰", "大面积森林氧吧，体感极佳"],
          cons: ["周末上午跑者密集", "冬季部分路段较冷"],
          whyRecommended: "北京跑者公认的标杆路线，绿化与跑感均为顶级，适合认真训练也适合轻松慢跑。"
        },
        {
          rank: 2,
          name: "亮马河滨水步道",
          distanceFromHotel: "1.0 公里",
          lng: 116.461424,
          lat: 39.949607,
          overallScore: 90,
          scores: { warmupDistance: 90, runningExperience: 91, safety: 89, greenEnvironment: 85, cityExperience: 94 },
          pros: ["近年改造后环境大幅提升", "水岸景观与城市生活感兼具", "路面平整，适合节奏跑"],
          cons: ["部分桥洞段略窄", "节假日局部拥挤"],
          whyRecommended: "城市更新代表路线，在跑步中感受北京国际化与烟火气并存的独特气质。"
        },
        {
          rank: 3,
          name: "什刹海环线",
          distanceFromHotel: "0.8 公里",
          lng: 116.386389,
          lat: 39.941462,
          overallScore: 86,
          scores: { warmupDistance: 92, runningExperience: 84, safety: 85, greenEnvironment: 78, cityExperience: 96 },
          pros: ["老北京文化气息浓厚", "热身过程本身就很享受", "适合轻松跑与城市探索"],
          cons: ["部分路段游客较多", "石板路需注意脚下"],
          whyRecommended: "想在跑步中深度感受北京历史与人文的首选，一条路线读懂老北京市井。"
        }
      ]
    },
    "广州": {
      center: [113.264385, 23.129112],
      routes: [
        {
          rank: 1,
          name: "珠江新城滨江绿道",
          distanceFromHotel: "0.4 公里",
          lng: 113.321547,
          lat: 23.117894,
          overallScore: 93,
          scores: { warmupDistance: 95, runningExperience: 92, safety: 90, greenEnvironment: 85, cityExperience: 95 },
          pros: ["广州天际线与江景一览无遗", "路面平整，适合配速训练", "早晚均有跑者，氛围好"],
          cons: ["夏季午后较热", "周末部分路段拥挤"],
          whyRecommended: "广州最具城市名片感的跑步路线，酒店出发即可开跑，江风与城市天际线相伴。"
        },
        {
          rank: 2,
          name: "二沙岛环岛步道",
          distanceFromHotel: "1.5 公里",
          lng: 113.308776,
          lat: 23.111234,
          overallScore: 90,
          scores: { warmupDistance: 80, runningExperience: 93, safety: 92, greenEnvironment: 94, cityExperience: 88 },
          pros: ["岛内安静，绿植丰富", "环岛路线清晰不易迷路", "适合长距离慢跑"],
          cons: ["需稍长热身到达", "部分路段遮荫一般"],
          whyRecommended: "闹中取静的绿洲路线，适合想要安静跑感、远离车流的选择。"
        },
        {
          rank: 3,
          name: "白云山南门绿道",
          distanceFromHotel: "2.0 公里",
          lng: 113.297892,
          lat: 23.184563,
          overallScore: 87,
          scores: { warmupDistance: 75, runningExperience: 90, safety: 88, greenEnvironment: 97, cityExperience: 82 },
          pros: ["空气好，爬升适中锻炼全面", "绿意极浓，远离城市热岛", "广州本地跑者常选"],
          cons: ["有一定坡度，非纯平路", "到达需较长热身"],
          whyRecommended: "想在山林绿意中跑步时的广州首选，跑感与自然体验俱佳。"
        }
      ]
    },
    "深圳": {
      center: [114.057868, 22.543099],
      routes: [
        {
          rank: 1,
          name: "深圳湾公园滨海栈道",
          distanceFromHotel: "0.7 公里",
          lng: 113.987654,
          lat: 22.512345,
          overallScore: 94,
          scores: { warmupDistance: 92, runningExperience: 94, safety: 91, greenEnvironment: 90, cityExperience: 93 },
          pros: ["海景与大桥视野极佳", "专用跑步道，路面品质高", "傍晚海风吹拂，体感舒适"],
          cons: ["周末人流大", "部分路段无遮荫"],
          whyRecommended: "深圳最具代表性的滨海跑步路线，城市与大海在一步之间。"
        },
        {
          rank: 2,
          name: "莲花山公园环线",
          distanceFromHotel: "1.1 公里",
          lng: 114.055234,
          lat: 22.553876,
          overallScore: 89,
          scores: { warmupDistance: 88, runningExperience: 90, safety: 90, greenEnvironment: 95, cityExperience: 87 },
          pros: ["市中心稀缺大绿地", "坡度适中，适合综合训练", "登顶可俯瞰福田 CBD"],
          cons: ["周末家庭游客多", "部分台阶需注意"],
          whyRecommended: "深圳市中心绿色跑步首选，城市便利与公园跑感完美结合。"
        },
        {
          rank: 3,
          name: "大沙河生态长廊",
          distanceFromHotel: "1.6 公里",
          lng: 113.968765,
          lat: 22.534567,
          overallScore: 86,
          scores: { warmupDistance: 82, runningExperience: 88, safety: 89, greenEnvironment: 92, cityExperience: 80 },
          pros: ["沿河生态景观连续", "专用绿道，干扰少", "适合长距离慢跑"],
          cons: ["部分路段较新，设施仍在完善", "到达需一定热身距离"],
          whyRecommended: "深圳新兴生态跑步路线，适合喜欢安静绿道、远离闹市的跑者。"
        }
      ]
    },
    "杭州": {
      center: [120.15507, 30.274084],
      routes: [
        {
          rank: 1,
          name: "西湖苏堤白堤环线",
          distanceFromHotel: "0.9 公里",
          lng: 120.148876,
          lat: 30.242345,
          overallScore: 96,
          scores: { warmupDistance: 90, runningExperience: 95, safety: 88, greenEnvironment: 97, cityExperience: 98 },
          pros: ["中国最具诗意的跑步风景之一", "路线经典，适合城市探索跑", "清晨人少，体验最佳"],
          cons: ["白天游客极多", "部分路段狭窄"],
          whyRecommended: "杭州跑步名片，在跑步中感受「人间天堂」的湖光与历史。"
        },
        {
          rank: 2,
          name: "钱塘江滨江绿道",
          distanceFromHotel: "1.3 公里",
          lng: 120.212345,
          lat: 30.198765,
          overallScore: 90,
          scores: { warmupDistance: 85, runningExperience: 92, safety: 91, greenEnvironment: 84, cityExperience: 92 },
          pros: ["江景开阔，适合节奏跑", "路面平整，里程感好", "城市现代感强"],
          cons: ["夏季较热", "部分路段风大"],
          whyRecommended: "想感受杭州现代都市一面时的首选，江景与跑感兼具。"
        },
        {
          rank: 3,
          name: "西溪湿地外围绿道",
          distanceFromHotel: "2.2 公里",
          lng: 120.065432,
          lat: 30.26789,
          overallScore: 87,
          scores: { warmupDistance: 78, runningExperience: 89, safety: 90, greenEnvironment: 96, cityExperience: 84 },
          pros: ["湿地生态，空气极佳", "绿意环绕，夏季相对凉爽", "适合恢复跑"],
          cons: ["到达距离稍远", "部分路段蚊虫较多"],
          whyRecommended: "杭州自然系跑步路线，适合想在湿地绿意中放松奔跑的选择。"
        }
      ]
    },
    "成都": {
      center: [104.066541, 30.572269],
      routes: [
        {
          rank: 1,
          name: "锦江河畔绿道",
          distanceFromHotel: "0.5 公里",
          lng: 104.087654,
          lat: 30.645678,
          overallScore: 91,
          scores: { warmupDistance: 93, runningExperience: 90, safety: 89, greenEnvironment: 88, cityExperience: 92 },
          pros: ["市中心即可开跑", "锦江景观与城市生活感兼具", "路面平整，适合日常训练"],
          cons: ["部分路段人流较多", "夏季午后偏热"],
          whyRecommended: "成都市中心最便捷的滨河跑步路线，出差旅行也能轻松开跑。"
        },
        {
          rank: 2,
          name: "桂溪生态公园环线",
          distanceFromHotel: "1.4 公里",
          lng: 104.062345,
          lat: 30.578901,
          overallScore: 89,
          scores: { warmupDistance: 84, runningExperience: 91, safety: 90, greenEnvironment: 94, cityExperience: 86 },
          pros: ["公园面积大，路线选择多", "绿化好，适合慢跑恢复", "跑者社区活跃"],
          cons: ["周末亲子家庭多", "部分区域信号较弱"],
          whyRecommended: "成都高新区跑者聚集地，城市公园跑感代表路线。"
        },
        {
          rank: 3,
          name: "浣花溪公园环线",
          distanceFromHotel: "1.0 公里",
          lng: 104.023456,
          lat: 30.656789,
          overallScore: 87,
          scores: { warmupDistance: 88, runningExperience: 86, safety: 88, greenEnvironment: 95, cityExperience: 90 },
          pros: ["诗意园林与跑步结合", "遮荫较好，体感舒适", "文化氛围浓厚"],
          cons: ["路线弯道多，配速跑略受影响", "部分石板路需注意"],
          whyRecommended: "想在跑步中感受成都慢生活与文化底蕴的首选。"
        }
      ]
    }
  };

  var cityAliases = {
    "shanghai": "上海",
    "beijing": "北京",
    "guangzhou": "广州",
    "shenzhen": "深圳",
    "hangzhou": "杭州",
    "chengdu": "成都",
    "pudong": "上海",
    "北京市": "北京",
    "上海市": "上海"
  };

  function normalizeCityName(city) {
    return (city || "").trim();
  }

  function resolveCityKey(city) {
    var name = normalizeCityName(city);
    if (!name) {
      return "上海";
    }
    if (cityCatalog[name]) {
      return name;
    }
    var lower = name.toLowerCase();
    if (cityAliases[lower]) {
      return cityAliases[lower];
    }
    for (var key in cityCatalog) {
      if (name.indexOf(key) !== -1 || key.indexOf(name) !== -1) {
        return key;
      }
    }
    return null;
  }

  function cloneRoute(route) {
    var copy = {};
    for (var prop in route) {
      if (route.hasOwnProperty(prop)) {
        copy[prop] = route[prop];
      }
    }
    if (route.scores) {
      copy.scores = {};
      for (var scoreKey in route.scores) {
        if (route.scores.hasOwnProperty(scoreKey)) {
          copy.scores[scoreKey] = route.scores[scoreKey];
        }
      }
    }
    if (route.pros) {
      copy.pros = route.pros.slice();
    }
    if (route.cons) {
      copy.cons = route.cons.slice();
    }
    return copy;
  }

  function buildFallbackRoutes(city, centerLng, centerLat) {
    var offsets = [
      { dlng: 0.012, dlat: 0.008, name: "滨江晨光环线", dist: "0.5 公里", score: 90 },
      { dlng: -0.010, dlat: 0.006, name: "城市绿洲环线", dist: "1.2 公里", score: 87 },
      { dlng: 0.006, dlat: -0.009, name: "老街文化河畔", dist: "0.9 公里", score: 85 }
    ];
    var routes = [];
    for (var i = 0; i < offsets.length; i++) {
      var item = offsets[i];
      routes.push({
        rank: i + 1,
        name: city + item.name,
        distanceFromHotel: item.dist,
        lng: centerLng + item.dlng,
        lat: centerLat + item.dlat,
        overallScore: item.score,
        scores: {
          warmupDistance: routeTemplate.scores.warmupDistance - i * 2,
          runningExperience: routeTemplate.scores.runningExperience - i,
          safety: routeTemplate.scores.safety,
          greenEnvironment: routeTemplate.scores.greenEnvironment - i,
          cityExperience: routeTemplate.scores.cityExperience + i
        },
        pros: routeTemplate.pros.slice(),
        cons: routeTemplate.cons.slice(),
        whyRecommended:
          "根据你在「" + city + "」的搜索，Xin 为你生成的示例路线（原型数据）。" +
          "正式版将结合实时路况与酒店位置推荐真实跑步路线。"
      });
    }
    return routes;
  }

  function getCityCenter(city) {
    var key = resolveCityKey(city);
    if (key && cityCatalog[key]) {
      return cityCatalog[key].center.slice();
    }
    return null;
  }

  function getRecommendations(city, centerLng, centerLat) {
    var key = resolveCityKey(city);
    if (key && cityCatalog[key]) {
      return cityCatalog[key].routes.slice(0, MAX_RECOMMENDATIONS).map(cloneRoute);
    }
    var lng = centerLng || 121.473701;
    var lat = centerLat || 31.230416;
    return buildFallbackRoutes(normalizeCityName(city) || "当前城市", lng, lat);
  }

  global.XinRunningData = {
    MAX_RECOMMENDATIONS: MAX_RECOMMENDATIONS,
    getRecommendations: getRecommendations,
    getCityCenter: getCityCenter,
    resolveCityKey: resolveCityKey
  };
})(window);
