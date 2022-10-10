import { LinRouter, disableLoading } from 'lin-mizar';
import { CategoryDao } from '../../dao/category';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import { CategoryAddValidator, ExistValidator } from '../../validator/category';
import { PaginateValidator, PositiveIdValidator } from '../../validator/common';
import { logger } from '../../middleware/logger';

const categoryApi = new LinRouter({
  prefix: '/v1/category',
  module: '分类'
});
const categoryDao = new CategoryDao();

// 添加一个分类
categoryApi.linPost(
  'addCategory',
  '/',
  categoryApi.permission('添加分类'),
  loginRequired,
  groupRequired,
  logger('{user.username}添加了一个分类'),
  async ctx => {
    const v = await new CategoryAddValidator().validate(ctx);
    await categoryDao.createCategory(v);
    ctx.success({
      code: 15
    });
  }
);

// 查询全部分类
categoryApi.get('/', async ctx => {
  const v = await new PaginateValidator().validate(ctx);
  const page = v.get('query.page', true, 1);
  const pageCount = v.get('query.count', true, 5);
  const { rows, count } = await categoryDao.getCategories(page, pageCount);
  ctx.json({
    data: rows,
    count,
    page,
    limit: pageCount
  });
});

// 更新分类信息
categoryApi.linPut(
  'updateCategory',
  '/:id',
  categoryApi.permission('更新分类'),
  loginRequired,
  groupRequired,
  logger('{user.username}更新了一个分类'),
  async ctx => {
    const v1 = await new PositiveIdValidator().validate(ctx);
    const v2 = await new CategoryAddValidator().validate(ctx);
    await categoryDao.updateCategory(v1.get('path.id'), {
      name: v2.get('body.name'),
      sort: v2.get('body.sort'),
      is_show: v2.get('body.is_show')
    });
    ctx.success({
      code: 16
    });
  }
);

// 删除分类
categoryApi.linDelete(
  'deleteCategory',
  '/:id',
  categoryApi.permission('删除分类'),
  loginRequired,
  groupRequired,
  logger('{user.username}删除了一个分类'),
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    await categoryDao.deleteCategory(v.get('path.id'));
    ctx.success({
      code: 17
    });
  }
);

// 单个详情接口
categoryApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const category = await categoryDao.getCategory(v.get('path.id'));
  ctx.json(category);
});

module.exports = { categoryApi, [disableLoading]: false };
