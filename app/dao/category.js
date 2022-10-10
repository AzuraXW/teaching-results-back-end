import { NotFound, Forbidden } from 'lin-mizar';
import { Book } from '../model/book';
import { CategoryModel } from '../model/category';

class CategoryDao {
  async getCategory(id) {
    const category = await CategoryModel.findOne({
      where: {
        id
      }
    });
    return category;
  }

  async getCategories(page, pageCount) {
    const { rows, count } = await CategoryModel.findAndCountAll({
      attributes: { exclude: ['delete_time'] },
      order: [['sort', 'DESC']],
      limit: pageCount,
      offset: (page - 1) * pageCount
    });
    return { rows, count };
  }

  async createCategory(v) {
    const cateogry = await Book.findOne({
      where: {
        title: v.get('body.name')
      }
    });
    if (cateogry) {
      throw new Forbidden({
        code: 10240
      });
    }
    await CategoryModel.create({
      name: v.get('body.name'),
      sort: v.get('body.sort', true, 0),
      is_show: v.get('body.is_show', true, 1)
    });
  }

  async updateCategory(id, info) {
    await this.checkExisting(id);
    await CategoryModel.update(info, {
      where: {
        id
      }
    });
  }

  async deleteCategory(id) {
    await this.checkExisting(id);
    await CategoryModel.destroy({
      where: {
        id
      }
    });
  }

  async checkExisting(id) {
    const category = await CategoryModel.findOne({
      where: {
        id
      }
    });
    if (!category) {
      throw new NotFound({
        code: 10022
      });
    }
  }
}

export { CategoryDao };
