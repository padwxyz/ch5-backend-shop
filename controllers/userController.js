const { Users } = require("../models");
const { Op } = require("sequelize");

const findUsers = async (req, res, next) => {
  try {
    const { name, age, address, limit, page } = req.query;

    const condition = {};
    if (name) condition.name = { [Op.iLike]: `%${name}%` };
    if (age) condition.age = { [Op.gte]: age };
    if (address) condition.address = { [Op.iLike]: address };

    let limitPage = 3;
    if (limit) limitPage = limit;

    let pageNumber = 0
    if (page) pageNumber = (page * limitPage) - limitPage

    const users = await Users.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: condition,
      limit: limitPage,
      offset: pageNumber
    });

    res.status(200).json({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (err) { }
};

const findUserById = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) { }
};

const updateUser = async (req, res, next) => {
  const { name, age, role, address, shopId } = req.body;
  try {
    await Users.update(
      {
        name,
        age,
        role,
        address,
        shopId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update user",
    });
  } catch (err) { }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete user",
    });
  } catch (err) { }
};

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
};
