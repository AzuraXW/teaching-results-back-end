import { Model, Sequelize, DataTypes } from 'sequelize';
import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import sequelize from '../lib/db';

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序权重'
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
      modelName: 'category'
    },
    InfoCrudMixin.options
  )
);

export { Category as CategoryModel };
