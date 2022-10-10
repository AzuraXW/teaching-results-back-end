import { Model, Sequelize, DataTypes } from 'sequelize';
import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import sequelize from '../lib/db';
import { UserModel } from './user';
import { CategoryModel } from './category';
import { FileModel } from './file';

class Content extends Model {}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '文本'
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '作者id'
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: ''
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '分类id'
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
      comment: '排序权重'
    }
  },
  merge(
    {
      sequelize,
      tableName: 'content',
      modelName: 'content'
    },
    InfoCrudMixin.options
  )
);

// 建立关系
UserModel.hasMany(Content, {
  foreignKey: 'author_id',
  targetKey: 'id',
  constraints: false
});
Content.belongsTo(UserModel, {
  foreignKey: 'author_id',
  targetKey: 'id',
  constraints: false
});

CategoryModel.hasMany(Content, {
  foreignKey: 'category_id',
  targetKey: 'id',
  constraints: false
});
Content.belongsTo(CategoryModel, {
  foreignKey: 'category_id',
  targetKey: 'id',
  constraints: false
});

FileModel.hasMany(Content, {
  foreignKey: 'file_id',
  targetKey: 'id',
  constraints: false
});
Content.belongsTo(FileModel, {
  foreignKey: 'file_id',
  targetKey: 'id',
  constraints: false
});
export { Content as ContentModel };
