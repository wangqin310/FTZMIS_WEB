import oss from '@/assets/js/oss'

// import

// 地图相关功能
(function() {
  //百度地图加载后的回调函数
  window.initializeBaiduMap = null;
  //防止JS、CSS重复加载
  if(!window.mapLibLoadCfg) {
    window.mapLibLoadCfg = {
      baiduMapLoaded: false
    };
  }
})()

const map = {
  mapLib: {tag: 'script', type: 'text/javascript', src: 'http://api.map.baidu.com/api?v=2.0&ak=SSFiX2y8U2fT3EWffIhHMcr6SlkQ1kDP&callback=initializeBaiduMap'},
  deplibs: [
    {tag: 'link', type: 'text/css', rel: 'stylesheet', href: 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css'},
    {tag: 'link', type: 'text/css', rel: 'stylesheet', href: 'http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css'},
    {tag: 'script', type: 'text/javascript', src: 'http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js'},
    {tag: 'script', type: 'text/javascript', src: 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'},
    {tag: 'script', type: 'text/javascript', src: 'http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js'},
    {tag: 'script', type: 'text/javascript', src: 'http://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js'},
    {tag: 'script', type: 'text/javascript', src: 'http://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js'}
  ],
  defaultPolygonOptions: {
    strokeColor: 'blue',   //String  边线颜色
    fillColor: '#FFFFFF',  //String  填充颜色。当参数为空时，折线覆盖物将没有填充效果
    strokeWeight: 1,       //Number  边线的宽度，以像素为单位
    strokeOpacity: 0.8,    //Number  边线透明度，取值范围0 - 1
    fillOpacity: 0.6,      //Number  填充的透明度，取值范围0 - 1
    strokeStyle: 'solid',  //String  边线的样式，solid或dashed
    enableMassClear: true, //Boolean 是否在调用map.clearOverlays清除此覆盖物，默认为true
    enableEditing: false,  //Boolean 是否启用线编辑，默认为false
    enableClicking: true   //Boolean 是否响应点击事件，默认为true
  },
  //显示地图网格
  showMapGrid(map, callback) {
    oss.get({
      url: '/crm/mapRegion/findAll',
      // data: params,
      ok: (data) => {
        let gridList = data;
        gridList.map(grid => {
          let points = [];
          let pointArr = JSON.parse(grid.regionPosition);
          pointArr.map(p => {
            points.push(new BMap.Point(p.lng, p.lat));
          });
          let polygon = new BMap.Polygon(points, this.defaultPolygonOptions);  //创建多边形
          polygon.data = grid;
          let label=this.addLabel(map, points, grid);
          polygon.label=label;
          map.addOverlay(polygon);   //增加多边形
          if(oss.isFunction(callback)) {
            callback(polygon);
          }
        });
      }
    });
  },
  //添加地图标签
  addLabel(map, regionPath, regionName) {
    let point = this.getCenterPoint(regionPath);
    let label = new BMap.Label(`【${regionName.managerId}】${regionName.managerName}`, {offset:new BMap.Size(-20,-5), position:point});
    label.setStyle({color : '#000', fontSize : '14px', backgroundColor :'0.05',border :'0', fontWeight :'bold' });//对label 样式隐藏
    map.addOverlay(label);
    return label;
  },
  /**
   * 启用保存当前地图视角（中心点+缩放级别）
   */
  enableSaveCurrentPointButton(map) {
    function ZoomControl() {
      // 设置默认停靠位置和偏移量
      this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
      this.defaultOffset = new BMap.Size(10, 10);
    }

    ZoomControl.prototype = new BMap.Control();

    // 自定义控件必须实现initialize方法，并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
    ZoomControl.prototype.initialize = () => {
      // 创建一个DOM元素
      var btn = document.createElement('input');
      btn.type = 'button';
      btn.value = '保存当前位置';
      // 设置样式
      btn.style.width = '90px';
      btn.style.height = '35px';
      // btn.style.border = '1px solid gray';
      // btn.style.backgroundColor = 'red';
      // 绑定事件，点击一次放大两级
      btn.onclick = () => {
        var zoom = map.getZoom();
        var center = map.getCenter();
        var value = JSON.stringify({lng: center.lng, lat: center.lat, zoom: zoom});
        oss.saveUserConfig('MapDefaultLocation',  value, '地图默认展示的中心点和级别', () => {
          oss.getGlobalData('currentUser').configMap.MapDefaultLocation = value;
        });
        oss.showMessage({type:'success', content: '保存成功'});
      }
      // 添加DOM元素到地图中
      map.getContainer().appendChild(btn);
      // 将DOM元素返回
      return btn;
    }

    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);
  },
  /**
   * 加载百度地图依赖包
   */
  loadMapLibary(callback, needTools=false) {
    if(window.mapLibLoadCfg.baiduMapLoaded) {
      callback();
    }else {
      let scriptLoadCount = 0;
      window.initializeBaiduMap = () => {
        this.deplibs.forEach(item => {
          oss.loadResource(item, () => {
            scriptLoadCount++;
            if(scriptLoadCount === this.deplibs.length) {
              window.mapLibLoadCfg.baiduMapLoaded = true;
              callback();
              console.log('Baidu Map Libary Loaded.');
            }
          });
        });
      };
      oss.loadResource(map.mapLib);
    }
  },
  getCenterPoint(path) {
    var x = 0.0;
    var y = 0.0;
    // for(var i=0;i<path.length;i++){
    path.forEach(p => {
      x = x + parseFloat(p.lng);
      y = y + parseFloat(p.lat);
    });
    x = x / path.length;
    y = y / path.length;

    return new BMap.Point(x, y);
  },
};

export default map;
