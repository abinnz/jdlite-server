const https = require('https');
const path = require('path');
const vm = require('vm');
const { R_OK } = require('fs').constants;
const fs = require('fs').promises;
const JS_REGEX = /smash-h5\/index\.js":(([\d\D])+?(!function([\d\D])+?)},"\.\/node_modules)/gmi
const UA = 'okhttp/3.12.1;jdmall;android;version/9.5.4;build/88136;screen/1440x3007;os/11;network/wifi;';
const SCRIPT_URL = 'https://storage11.360buyimg.com/tower/babelnode/js/vendors.683f5a61.js';
let smashUtils;

class MoveMentFaker {
  constructor() {
  }

  async run() {
    if (!smashUtils) {
      await this.init();
    }

    var t = Math.floor(1e7 + 9e7 * Math.random()).toString();
    var e = smashUtils.get_risk_result({
      id: t,
      data: {
        random: t
      }
    }).log;
    var o = JSON.stringify({
      log: e || -1,
      random: t
    })
    console.log(o);
    return o;
  }

  async init() {
    try {
      process.chdir(__dirname);
      const jsContent = await this.getJSContent(path.basename(SCRIPT_URL), SCRIPT_URL);
      const fnMock = new Function;
      const ctx = {
        window: { addEventListener: fnMock },
        document: {
          addEventListener: fnMock,
          removeEventListener: fnMock,
          cookie: this.cookie
        },
        navigator: { userAgent: UA }
      };

      vm.createContext(ctx);
      vm.runInContext(jsContent, ctx);
      smashUtils = ctx.window.smashUtils;
      smashUtils.init();

    } catch (e) {
      console.log(e)
    }
  }

  async getJSContent(cacheKey, url) {
    try {
      await fs.access(cacheKey, R_OK);
      const rawFile = await fs.readFile(cacheKey, { encoding: 'utf8' });
      return rawFile;
    } catch (e) {
      let jsContent = await MoveMentFaker.httpGet(url);
      let matchResult = JS_REGEX.exec(jsContent);
      if (matchResult && matchResult.length != 0) {
        jsContent = matchResult[3];
      }
      fs.writeFile(cacheKey, jsContent);
      return jsContent;
    }
  }

  static httpGet(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.indexOf('http') !== 0 ? 'https:' : '';
      const req = https.get(protocol + url, (res) => {
        res.setEncoding('utf-8');

        let rawData = '';

        res.on('error', reject);
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => resolve(rawData));
      });

      req.on('error', reject);
      req.end();
    });
  }
}

async function getBody($) {
  const zf = new MoveMentFaker(null);
  // const zf = new MoveMentFaker($.secretp, $.cookie);
  const ss = await zf.run();
  
  return ss;
}

MoveMentFaker.getBody = getBody;
module.exports = MoveMentFaker;