import * as newsService from './news.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getNews = async (req, res, next) => {
  try {
    const result = await newsService.getNews(req.query);
    return ApiResponse.success(res, result, 'News articles fetched');
  } catch (error) {
    next(error);
  }
};

export const getNewsBySlug = async (req, res, next) => {
  try {
    const article = await newsService.getNewsBySlug(req.params.slug);
    return ApiResponse.success(res, article, 'Article details retrieved');
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    const article = await newsService.createNews(req.body, req.user._id);
    return ApiResponse.created(res, article, 'News article published successfully');
  } catch (error) {
    next(error);
  }
};
