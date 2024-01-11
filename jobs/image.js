const ImageResolver = require('image-resolver');
const { default: axios } = require('axios');
const fs = require('fs');
import imageThumbnail from 'image-thumbnail';
import Article from '../models/article';

function getImageLinkFromArticle(resolve, reject, article_link) {
  var resolver = new ImageResolver();
  resolver.register(new ImageResolver.FileExtension());
  resolver.register(new ImageResolver.MimeType());
  resolver.register(new ImageResolver.Opengraph());
  resolver.register(new ImageResolver.Webpage());

  resolver.resolve(article_link, function (result) {
    if (result) {
      resolve(result.image);
    } else {
      console.log('[error] No image found for', article_link);
      reject(new Error('No image found'));
    }
  });
}

async function getImageFile(article_link) {
  let imageUrl = new Promise((resolve, reject) => {
    getImageLinkFromArticle(resolve, reject, article_link);
  });
  imageUrl = await imageUrl;
  return imageUrl;
  console.log(imageUrl, 'from ', article_link);
  if (imageUrl === null) {
    return null;
  }
  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'blob',
    responseEncoding: 'base64',
  });
  return response.data;
}

export default {
  name: 'image-link',
  async handle({ data }) {
    // get article link
    const article_link = data.link;
    // get image from article
    const image = await getImageFile(article_link);
    // save image
    await Article.findOneAndUpdate({ link: data.link }, { image });
  },
};
