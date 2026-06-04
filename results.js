(function () {
  "use strict";

  var STORAGE_KEY = "xinRunningSearch";
  var MAX_RECOMMENDATIONS = XinRunningData.MAX_RECOMMENDATIONS;
  var RANK_COLORS = ["#6db87a", "#4d9a62", "#8fbc6a"];

  var distanceLabels = {
    short: "轻松跑 — 3 公里以内",
    medium: "日常跑 — 3 至 7 公里",
    long: "长距离 — 7 至 12 公里",
    marathon: "备马训练 — 12 公里以上"
  };

  var scoreLabels = {
    warmupDistance: "热身距离",
    runningExperience: "跑步体验",
    safety: "安全性",
    greenEnvironment: "绿化环境",
    cityExperience: "城市体验"
  };

  function readSearchParams() {
    var params = new URLSearchParams(window.location.search);
    var city = params.get("city");
    var hotel = params.get("hotel");
    var distance = params.get("distance");

    if (city && hotel && distance) {
      return {
        city: city,
        hotel: hotel,
        distance: distance
      };
    }

    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      /* ignore */
    }

    return {
      city: "上海",
      hotel: "你的酒店",
      distance: "medium"
    };
  }

  function getAmapKey() {
    return window.XinRunningConfig && window.XinRunningConfig.amapKey;
  }

  function loadAmap(callback) {
    if (window.AMap) {
      callback(null);
      return;
    }

    var key = getAmapKey();
    if (!key || key === "YOUR_AMAP_KEY_HERE") {
      callback(new Error("请在 config.js 中配置高德地图 amapKey"));
      return;
    }

    var config = window.XinRunningConfig || {};
    if (config.amapSecurityCode) {
      window._AMapSecurityConfig = {
        securityJsCode: config.amapSecurityCode
      };
    }

    var existing = document.getElementById("amap-sdk");
    if (existing) {
      existing.addEventListener("load", function () {
        callback(null);
      });
      existing.addEventListener("error", function () {
        callback(new Error("高德地图 SDK 加载失败"));
      });
      return;
    }

    var script = document.createElement("script");
    script.id = "amap-sdk";
    script.src =
      "https://webapi.amap.com/maps?v=2.0&key=" + encodeURIComponent(key);
    script.onload = function () {
      callback(null);
    };
    script.onerror = function () {
      callback(new Error("高德地图 SDK 加载失败"));
    };
    document.head.appendChild(script);
  }

  function buildAiMessage(search, location) {
    var priority =
      location.rank === 1 ? "便捷出发与快速开跑" :
      location.rank === 2 ? "优质跑感与绿意环境" :
      "本地文化与城市探索";

    return (
      "根据你在 " + search.city + " 的 " + search.hotel + " 入住信息，" +
      "以及「" + (distanceLabels[search.distance] || search.distance) + "」的跑步偏好，" +
      location.name + " 位列第 " + location.rank + " 推荐，综合评分 " + location.overallScore + " 分。" +
      "这条路线重点满足「" + priority + "」，同时兼顾安全与路面品质，适合今天开跑。"
    );
  }

  function renderScoreBar(label, value) {
    return (
      '<div class="score-row">' +
        '<div class="score-row-header">' +
          '<span class="score-label">' + label + '</span>' +
          '<span class="score-value">' + value + '</span>' +
        '</div>' +
        '<div class="score-bar" role="presentation">' +
          '<div class="score-bar-fill" style="width:' + value + '%"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderList(items, cssClass) {
    var html = '<ul class="' + cssClass + '">';
    for (var i = 0; i < items.length; i++) {
      html += "<li>" + items[i] + "</li>";
    }
    html += "</ul>";
    return html;
  }

  function renderCard(location, search) {
    var scoresHtml = "";
    var scoreKeys = Object.keys(scoreLabels);
    for (var i = 0; i < scoreKeys.length; i++) {
      var key = scoreKeys[i];
      scoresHtml += renderScoreBar(scoreLabels[key], location.scores[key]);
    }

    var aiMessage = buildAiMessage(search, location);

    return (
      '<article class="rec-card" id="route-' + location.rank + '" data-rank="' + location.rank + '">' +
        '<header class="rec-card-header">' +
          '<span class="rec-rank">#' + location.rank + "</span>" +
          '<div class="rec-heading">' +
            '<h2 class="rec-name">' + location.name + "</h2>" +
            '<p class="rec-distance">距离当前位置 ' + location.distanceFromHotel + '</p>' +
          "</div>" +
          '<div class="rec-overall">' +
            '<span class="rec-overall-value">' + location.overallScore + "</span>" +
            '<span class="rec-overall-label">综合评分</span>' +
          "</div>" +
        "</header>" +
        '<section class="rec-scores" aria-label="路线评分">' +
          scoresHtml +
        "</section>" +
        '<section class="rec-detail rec-pros">' +
          "<h3>优点</h3>" +
          renderList(location.pros, "detail-list detail-list-pros") +
        "</section>" +
        '<section class="rec-detail rec-cons">' +
          "<h3>缺点</h3>" +
          renderList(location.cons, "detail-list detail-list-cons") +
        "</section>" +
        '<section class="rec-detail rec-why">' +
          "<h3>推荐原因</h3>" +
          "<p>" + location.whyRecommended + "</p>" +
        "</section>" +
        '<section class="rec-ai" aria-label="AI推荐语">' +
          "<h3>AI推荐语</h3>" +
          "<p>" + aiMessage + "</p>" +
        "</section>" +
      "</article>"
    );
  }

  function renderQuickPicks(locations) {
    var list = document.getElementById("quick-picks");
    var html = "";
    for (var i = 0; i < locations.length; i++) {
      var loc = locations[i];
      html +=
        '<li><a href="#route-' + loc.rank + '">' +
          '<span class="quick-rank">' + loc.rank + "</span> " +
          loc.name +
        "</a></li>";
    }
    list.innerHTML = html;
  }

  function renderSummary(search, locations) {
    document.getElementById("results-title").textContent =
      "在「" + search.hotel + "」附近开跑";

    document.getElementById("results-meta").textContent =
      search.city + " · " + (distanceLabels[search.distance] || search.distance);

    document.title = search.hotel + " 附近的三条跑步路线 — Xin Running";

    renderQuickPicks(locations);
  }

  function renderCards(search, locations) {
    var container = document.getElementById("recommendations");
    var html = "";
    for (var i = 0; i < locations.length; i++) {
      html += renderCard(locations[i], search);
    }
    container.innerHTML = html;
  }

  function showMapMessage(message) {
    var mapEl = document.getElementById("map");
    if (!mapEl) {
      return;
    }
    mapEl.innerHTML =
      '<div class="map-placeholder">' +
        "<p>" + message + "</p>" +
      "</div>";
  }

  function createRankMarkerContent(rank, color) {
    return (
      '<span class="map-marker-inner" style="background:' + color + '">' +
      rank +
      "</span>"
    );
  }

  function addRouteMarkers(map, locations, infoWindow) {
    var markers = [];

    for (var i = 0; i < locations.length; i++) {
      (function (loc, index) {
        var marker = new AMap.Marker({
          position: [loc.lng, loc.lat],
          content: createRankMarkerContent(loc.rank, RANK_COLORS[index]),
          offset: new AMap.Pixel(-16, -16),
          title: loc.name
        });

        marker.on("click", function () {
          infoWindow.setContent(
            "<strong>#" + loc.rank + " " + loc.name + "</strong>"
          );
          infoWindow.open(map, marker.getPosition());
        });

        map.add(marker);
        markers.push(marker);
      })(locations[i], i);
    }

    return markers;
  }

  function resolveLocations(search, centerLng, centerLat) {
    return XinRunningData.getRecommendations(search.city, centerLng, centerLat);
  }

  function geocodeCity(city, callback) {
    console.log("进入geocodeCity");
    AMap.plugin(["AMap.Geocoder"], function () {
      console.log("Geocoder插件加载成功");
      var geocoder = new AMap.Geocoder({
        city: "全国"
      });
      geocoder.getLocation(city, function (status, result) {
        console.log("getLocation返回", status, result);
        if (status === "complete" && result.geocodes && result.geocodes.length) {
          var geo = result.geocodes[0].location;
          callback(null, geo.lng, geo.lat);
          return;
        }
        callback(new Error("无法定位城市：" + city));
      });
    });
  }

  function initMap(search, locations) {
    var mapEl = document.getElementById("map");
    if (!mapEl || !window.AMap) {
      return;
    }

    var initialCenter = locations[0]
    ? [locations[0].lng, locations[0].lat]
    : (XinRunningData.getCityCenter(search.city) || [121.473701, 31.230416]);

    var map = new AMap.Map("map", {
      zoom: 13,
      center: initialCenter,
      scrollWheel: false,
      viewMode: "2D"
    });

    var infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -20)
    });

    var markers = addRouteMarkers(map, locations, infoWindow);
    var startMarker = new AMap.Marker({
      position: initialCenter,
      title: search.hotel || "当前位置",
      content: '<div style="background:white;color:#2f6f4e;border:2px solid #4f9d69;padding:6px 12px;border-radius:999px;font-size:14px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.18);">📍 起点</div>',
      offset: new AMap.Pixel(-24, -24)
    });
    
    map.add(startMarker);
    markers.push(startMarker);

    map.setCity(search.city, function () {
      if (markers.length > 0) {
        map.setFitView(markers, false, [40, 40, 40, 40]);
      }
    });
  }

  function bootstrap() {
    console.log("bootstrap启动");
    var search = readSearchParams();

    loadAmap(function (err) {
      console.log("loadAmap回调", err);
      if (err) {
        var fallbackLocations = XinRunningData.getRecommendations(search.city);
        if (fallbackLocations.length > MAX_RECOMMENDATIONS) {
          fallbackLocations = fallbackLocations.slice(0, MAX_RECOMMENDATIONS);
        }
        renderSummary(search, fallbackLocations);
        renderCards(search, fallbackLocations);
        showMapMessage(err.message);
        return;
      }

      function finish(lng, lat) {
        var locations = resolveLocations(search, lng, lat);
        if (locations.length > MAX_RECOMMENDATIONS) {
          locations = locations.slice(0, MAX_RECOMMENDATIONS);
        }
        renderSummary(search, locations);
        renderCards(search, locations);
        initMap(search, locations);
      }

     
      console.log("开始地理编码");
      geocodeCity(search.hotel || search.city, function (geoErr, lng, lat) {
        console.log("地理编码返回", geoErr, lng, lat);
        if (geoErr) {
          finish(121.473701, 31.230416);
          return;
        }
      
        finish(lng, lat);
      });
    });
  }

  function init() {
    bootstrap();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
