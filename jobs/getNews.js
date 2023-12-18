import axios from 'axios';
import Article from '../models/article';
import jobQueues from '../queue';

export default {
  name: 'get-news',
  async handle() {
    const api_url = process.env.NEWS_API_URL;
    let page = null;
    while (true) {
      const result = (
        await axios.get(page ? `${api_url}&page=${page}` : api_url)
      ).data;
      if (result.status === 'error') return;
      const articles = result.results;
      for (const article of articles) {
        if (await Article.findById(article.article_id)) {
          return;
        }
        const id = article.article_id;
        delete article.article_id;
        const newArticle = await Article.create({ ...article, _id: id });
        newArticle.save();
        jobQueues.add('image-link', newArticle);
      }
      page = result.nextPage;
    }
  },
};
