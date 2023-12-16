import Articles from '../models/article';

export default class ArticlesController {
  async home(req, res) {
    const page = Number(req.query.page) || 0;
    const perPage = 10;
    const todayArticles = await Articles.find()
      .sort({ pubDate: 'desc' })
      .skip(perPage * page)
      .limit(perPage);
    return res.render('home', {
      todayArticles,
      page,
      done: todayArticles.length < perPage ? true : false,
    });
  }
  async getOne(req, res) {
    const title = req.params.title;

    const article = await Articles.findOne({ title });
    if (!article) return res.status(404).render('404');
    return res.status(200).render('article', {
      article,
    });
  }

  async getManyCategory(req, res) {
    const category = req.params.category;
    const page = Number(req.query.page) || 0;
    const perPage = 10;

    const articlesWithCategory = await Articles.find({
      category: { $in: [category] },
    })
      .skip((perPage / 2) * page)
      .limit(perPage / 2);
    const articlesWithKeyword = await Articles.find({
      keywords: { $in: [category] },
    })
      .skip((perPage / 2) * page)
      .limit(perPage / 2);
    const articles = [...articlesWithCategory, ...articlesWithKeyword];
    return res.status(200).render('search', {
      articles,
      category,
      page,
      done: articles.length < perPage / 2 ? true : false,
    });
  }
}
