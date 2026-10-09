import { Department } from '../departments/department.model.js';
import { Batch } from '../batches/batch.model.js';
import { Program } from '../programs/program.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getMetadata = async (req, res, next) => {
  try {
    const [departments, batches, programs] = await Promise.all([
      Department.find().sort({ name: 1 }),
      Batch.find().sort({ admissionYear: -1 }),
      Program.find().sort({ name: 1 })
    ]);

    return ApiResponse.success(res, { departments, batches, programs }, 'Metadata retrieved');
  } catch (error) {
    next(error);
  }
};
