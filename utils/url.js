exports.decodeURLTitle = function (urlComponent) {
  return (title = decodeURIComponent(urlComponent.replace('+', '%20')));
};

exports.encodeURLTitle = function (title) {
  return encodeURIComponent(title).replace('%20', '+');
};
