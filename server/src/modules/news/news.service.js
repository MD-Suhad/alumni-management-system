import { News } from './news.model.js';
import { ApiError } from '../../utils/apiError.js';

export const getNews = async (query = {}) => {
  const { category, isFeatured, search, page = 1, limit = 9 } = query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const filter = { status: 'published' };
  if (category) filter.category = category;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const [articles, total] = await Promise.all([
    News.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('author', 'firstName lastName avatar'),
    News.countDocuments(filter)
  ]);

  return {
    data: articles,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    }
  };
};

export const getNewsBySlug = async (slug) => {
  const article = await News.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).populate('author', 'firstName lastName avatar');

  if (!article) {
    throw new ApiError(404, 'News article not found.');
  }

  return article;
};

export const createNews = async (data, userId) => {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const article = await News.create({
    ...data,
    slug,
    author: userId
  });

  return article;
};
