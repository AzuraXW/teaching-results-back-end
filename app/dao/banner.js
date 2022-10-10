import { NotFound, Forbidden } from 'lin-mizar';
import { BannerModel } from '../model/banner';

class BannerDao {
  async getCategory(id) {
    const category = await CategoryModel.findOne({
      where: {
        id
      }
    });
    return category;
  }

  async getList(page, pageCount, v) {
    const { rows, count } = await BannerModel.findAndCountAll({
      attributes: { exclude: ['delete_time'] },
      limit: pageCount,
      offset: (page - 1) * pageCount,
      where: {
        type: v.get('body.type', true, 0)
      },
      include: ['file']
    });
    return { rows, count };
  }

  async createBanner(v) {
    await BannerModel.create({
      description: v.get('body.description'),
      type: v.get('body.type', true, 0),
      is_show: v.get('body.is_show', true, 1),
      file_id: v.get('body.file_id')
    });
  }

  async updateBanner(id, v) {
    await this.checkExisting(id);
    await BannerModel.update(
      {
        description: v.get('body.description'),
        type: v.get('body.type'),
        is_show: v.get('body.is_show'),
        file_id: v.get('body.file_id')
      },
      {
        where: {
          id
        }
      }
    );
  }

  async deleteBanner(id) {
    await this.checkExisting(id);
    await BannerModel.destroy({
      where: {
        id
      }
    });
  }

  async checkExisting(id) {
    const rseult = await BannerModel.findOne({
      where: {
        id
      }
    });
    if (!rseult) {
      throw new NotFound({
        code: 10272
      });
    }
  }
}

export { BannerDao };
