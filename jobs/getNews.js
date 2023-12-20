import axios from 'axios';
import Article from '../models/article';
import jobQueues from '../queue';

export default {
  name: 'get-news',
  async handle() {
    console.log('[info] started getting news');
    const api_url = process.env.NEWS_API_URL;
    let page = null;
    while (true) {
      const requestURL = page ? `${api_url}&page=${page}` : api_url;
      console.log('[request]', requestURL)
      const result = (await axios.get(requestURL)).data;
      if (result.status === 'error') return;
      const articles = result.results;
        for (const article of articles) {
        if (await Article.findOne({ title: article.title })) {
          console.log('[info] done requesting for now')
          return;
        }
        const newArticle = await Article.create(article);
        newArticle.save();
        jobQueues.add('image-link', newArticle);
      }
      page = result.nextPage;
    }
  },
};
