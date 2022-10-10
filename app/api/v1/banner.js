import { LinRouter, disableLoading } from 'lin-mizar';
import { BannerDao } from '../../dao/banner';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import { BannerAddValidator } from '../../validator/banner';
import { PaginateValidator, PositiveIdValidator } from '../../validator/common';
import { config } from 'lin-mizar/lin/config';
import { logger } from '../../middleware/logger';

// 默认分页参数
const pageDefault = config.getItem('pageDefault');
const countDefault = config.getItem('countDefault');

const bannerApi = new LinRouter({
  prefix: '/v1/banner',
  module: '展示图'
});
const bannerDao = new BannerDao();

// 添加一个展示图
bannerApi.linPost(
  'addBanner',
  '/',
  bannerApi.permission('添加展示图'),
  loginRequired,
  groupRequired,
  logger('{user.username}添加了一个展示图'),
  async ctx => {
    const v = await new BannerAddValidator().validate(ctx);
    await bannerDao.createBanner(v);
    ctx.success({
      code: 23
    });
  }
);

// 查询全部展示图
bannerApi.get('/', async ctx => {
  const v = await new PaginateValidator().validate(ctx);
  const page = v.get('query.page', true, pageDefault);
  const pageCount = v.get('query.count', true, countDefault);
  const { rows, count } = await bannerDao.getList(page, pageCount, v);
  ctx.json({
    data: rows,
    count,
    page,
    pageCount
  });
});

// 更新展示图
bannerApi.linPut(
  'updateBanner',
  '/:id',
  bannerApi.permission('更新展示图'),
  loginRequired,
  groupRequired,
  logger('{user.username}更新了一个展示图'),
  async ctx => {
    const v1 = await new PositiveIdValidator().validate(ctx);
    await bannerDao.updateBanner(v1.get('path.id'), v1);
    ctx.success({
      code: 21
    });
  }
);

// 删除展示图
bannerApi.linDelete(
  'deleteBanner',
  '/:id',
  bannerApi.permission('删除展示图'),
  loginRequired,
  groupRequired,
  logger('{user.username}删除了一个展示图'),
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    await bannerDao.deleteBanner(v.get('path.id'));
    ctx.success({
      code: 19
    });
  }
);

module.exports = { bannerApi, [disableLoading]: false };
