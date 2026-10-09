import { Contact } from './contact.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    return ApiResponse.created(res, contact, 'Thank you! Your message has been received.');
  } catch (error) {
    next(error);
  }
};
