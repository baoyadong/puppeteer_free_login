const getHost = (url) => {
  const reg = new RegExp(/\w+:\/\/([^/:]+)(:\d*)?/);
  const matchObj = url.match(reg);
  if (matchObj) {
    return matchObj[1];
  } else {
    return '';
  }
};

module.exports = {
  getHost
}
