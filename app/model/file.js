import { Model, Sequelize, DataTypes } from 'sequelize';
import { InfoCrudMixin, config } from 'lin-mizar';
import { merge } from 'lodash';
import sequelize from '../lib/db';

class File extends Model {
  static async createRecord(args, commit) {
    const record = File.build(args);
    commit && (await record.save());
    return record;
  }
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    path: {
      type: Sequelize.STRING({ length: 500 }),
      allowNull: false
    },
    type: {
      type: Sequelize.STRING({ length: 10 }),
      allowNull: false,
      defaultValue: 'LOCAL',
      comment: 'LOCAL 本地，REMOTE 远程'
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    extension: {
      type: Sequelize.STRING(50)
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    // 建立索引，方便搜索
    // 域名配置
    md5: {
      type: Sequelize.STRING(40),
      allowNull: true,
      comment: '图片md5值，防止上传重复图片'
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        const siteDomain = config.getItem('siteDomain', 'http://localhost');
        return `${siteDomain}/assets/${this.path}`;
      }
    }
  },
  merge(
    {
      sequelize,
      tableName: 'lin_file',
      modelName: 'file',
      indexes: [
        {
          name: 'md5_del',
          unique: true,
          fields: ['md5', 'delete_time']
        }
      ]
    },
    InfoCrudMixin.options
  )
);
export { File as FileModel };
