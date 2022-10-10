import { LinRouter, disableLoading } from 'lin-mizar';
import {
  PaginateValidator,
  PositiveIdValidator,
  AllPassValidator
} from '../../validator/common';
import { config } from 'lin-mizar/lin/config';
import { CategoryModel } from '../../model/category';
import { BannerModel } from '../../model/banner';
import { FileModel } from '../../model/file';
import { ContentModel } from '../../model/content';
import { UserModel } from '../../model/user';
import { resolve } from 'path';

// 默认分页参数
const pageDefault = config.getItem('pageDefault');
const countDefault = config.getItem('countDefault');

const frontApi = new LinRouter({
  prefix: '/v1/front'
});

// 前台首页导航列表
frontApi.get('/nav', async ctx => {
  const data = await CategoryModel.findAll({
    where: {
      is_show: 1
    },
    order: [['sort', 'DESC']],
    attributes: ['name', 'id']
  });
  ctx.json({
    code: 200,
    data
  });
});

// 首页轮播图
frontApi.get('/banners', async ctx => {
  const data = await BannerModel.findAll({
    where: {
      is_show: 1,
      type: 0
    },
    attributes: ['id', 'description'],
    include: {
      model: FileModel,
      attributes: ['id', 'path', 'url']
    }
  });

  ctx.json({
    code: 200,
    data
  });
});

// 获奖荣誉
frontApi.get('/honors', async ctx => {
  const data = await BannerModel.findAll({
    where: {
      is_show: 1,
      type: 1
    },
    attributes: ['id', 'description'],
    include: {
      model: FileModel,
      attributes: ['id', 'path', 'url']
    }
  });

  ctx.json({
    code: 200,
    data
  });
});

// 获取文章列表
frontApi.get('/article/:id', async ctx => {
  const v = await new AllPassValidator().validate(ctx);
  const data = await ContentModel.findOne({
    where: {
      is_show: 1,
      id: v.get('path.id')
    },
    attributes: ['id', 'title', 'text', 'type'],
    include: [
      {
        model: FileModel,
        attributes: ['id', 'path', 'url']
      },
      {
        model: UserModel,
        attributes: ['nickname']
      }
    ]
  });

  ctx.json({
    code: 200,
    data
  });
});

// 获取标题列表
frontApi.get('/atitles', async ctx => {
  const v = await new AllPassValidator().validate(ctx);
  const data = await ContentModel.findAll({
    where: {
      is_show: 1,
      category_id: v.get('query.cid')
    },
    limit: v.get('query.count', true, 100),
    attributes: ['id', 'title']
  });

  ctx.json({
    code: 200,
    data
  });
});

// 获取配置
frontApi.get('/', async ctx => {
  const config = require(resolve(__dirname, '../../config/site.json'));
  ctx.json({
    code: 200,
    data: config
  });
});

module.exports = { frontApi, [disableLoading]: false };
