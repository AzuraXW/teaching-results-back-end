import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';
import { FileModel } from './file';

class Banner extends Model {}

Banner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
      comment: '是否展示'
    }
  },
  merge(
    {
      sequelize,
      tableName: 'banner',
      modelName: 'banner'
    },
    InfoCrudMixin.options
  )
);

FileModel.hasMany(Banner, {
  foreignKey: 'file_id',
  targetKey: 'id',
  constraints: false
});
Banner.belongsTo(
  FileModel,
  {
    foreignKey: 'file_id',
    targetKey: 'id',
    constraints: false
  },
  {
    as: 'file'
  }
);
export { Banner as BannerModel };
