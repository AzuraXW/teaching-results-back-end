import { NotFound } from 'lin-mizar';
import { FileModel } from '../model/file';

class FileDao {
  async getFile(id) {
    const file = await FileModel.findOne({
      where: {
        id
      }
    });
    return file;
  }

  async getFiles(page, pageCount) {
    const { rows, count } = await FileModel.findAndCountAll({
      attributes: { exclude: ['delete_time'] },
      limit: pageCount,
      offset: (page - 1) * pageCount
    });
    return { rows, count };
  }

  async deleteFile(id) {
    await this.checkExisting(id);
    await FileModel.destroy({
      where: {
        id
      }
    });
  }

  async checkExisting(id) {
    const file = await FileModel.findOne({
      where: {
        id
      }
    });
    if (!file) {
      throw new NotFound({
        code: 10026
      });
    }
  }
}

export { FileDao };
