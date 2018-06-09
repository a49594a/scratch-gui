/*import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize(process.env.GA_ID, {
    debug: (process.env.NODE_ENV !== 'production'),
    titleCase: true,
    sampleRate: (process.env.NODE_ENV === 'production') ? 100 : 0,
    forceSSL: true
});*/
//by yj 避免因为无法访问google网站下载插件产生的错误
var GoogleAnalytics = {
    event: function () { },
    pageview: function () { },
}

export default GoogleAnalytics;
