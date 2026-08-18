const User = require('../models/User');
const AppError = require('../utils/appError');

exports.getAllUsers = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { firstName: { $regex: query.search, $options: 'i' } },
      { lastName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).skip(skip).limit(limit).select('-password');
  const total = await User.countDocuments(filter);

  return {
    users,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

exports.updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');
  
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};