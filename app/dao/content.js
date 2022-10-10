import { NotFound, Forbidden } from 'lin-mizar';
import { Op } from 'sequelize';
import { Book } from '../model/book';
import { ContentModel } from '../model/content';
import { CategoryModel } from '../model/category';
import { FileModel } from '../model/file';
import { UserModel } from '../model/user';

class ContentDao {
  async getContent(id) {
    const content = await ContentModel.findOne({
      where: {
        id
      },
      include: [CategoryModel, FileModel, UserModel]
    });
    return content;
  }

  async getContentList(page, pageCount, v) {
    let where = {};
    const search = v.get('body.search');
    if (search) {
      where = {
        [Op.or]: {
          title: {
            [Op.substring]: search
          },
          text: {
            [Op.substring]: search
          }
        }
      };
    }
    const { rows, count } = await ContentModel.findAndCountAll({
      where,
      attributes: { exclude: ['delete_time'] },
      order: [['sort', 'DESC']],
      limit: pageCount,
      offset: (page - 1) * pageCount,
      include: [CategoryModel, FileModel, UserModel]
    });
    return { rows, count };
  }

  async createContent(author_id, v) {
    await ContentModel.create({
      title: v.get('body.title'),
      text: v.get('body.text'),
      type: v.get('body.type', true, 0),
      file_id: v.get('body.file_id'),
      sort: v.get('body.sort', true, 0),
      category_id: v.get('body.category_id'),
      is_show: v.get('body.is_show', true, 1),
      author_id
    });
  }

  async updateContent(id, v) {
    await this.checkExisting(id);
    await ContentModel.update(
      {
        title: v.get('body.title'),
        text: v.get('body.text'),
        type: v.get('body.type'),
        file_id: v.get('body.file_id'),
        sort: v.get('body.sort'),
        category_id: v.get('body.category_id'),
        is_show: v.get('body.is_show')
      },
      {
        where: {
          id
        }
      }
    );
  }

  async deleteContent(id) {
    await this.checkExisting(id);
    await ContentModel.destroy({
      where: {
        id
      }
    });
  }

  async checkExisting(id) {
    const result = await ContentModel.findOne({
      where: {
        id
      }
    });
    if (!result) {
      throw new NotFound({
        code: 10271
      });
    }
  }
}

export { ContentDao };
