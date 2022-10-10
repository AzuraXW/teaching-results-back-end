import { LinRouter, disableLoading } from 'lin-mizar';
import { ContentDao } from '../../dao/content';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import {
  ContentAddValidator,
  ContentSearchValidator,
  ContentUpdateValidator,
  ExistValidator
} from '../../validator/content';
import { PaginateValidator, PositiveIdValidator } from '../../validator/common';
import { config } from 'lin-mizar/lin/config';
import { logger } from '../../middleware/logger';

// 默认分页参数
const pageDefault = config.getItem('pageDefault');
const countDefault = config.getItem('countDefault');

const contentApi = new LinRouter({
  prefix: '/v1/content',
  module: '内容'
});
const contentDao = new ContentDao();

// 添加内容
contentApi.linPost(
  'createContent',
  '/',
  contentApi.permission('添加内容条目'),
  loginRequired,
  groupRequired,
  logger('{user.username}添加了一条信息条目'),
  async ctx => {
    const v = await new ContentAddValidator().validate(ctx);
    const author_id = ctx.currentUser.id;
    await contentDao.createContent(author_id, v);
    ctx.success({
      code: 20
    });
  }
);

// 查询全部分类条目
contentApi.get('/', loginRequired, async ctx => {
  const v = await new PaginateValidator().validate(ctx);
  const v2 = await new ContentSearchValidator().validate(ctx);
  const page = v.get('query.page', true, pageDefault);
  const pageCount = v.get('query.count', true, countDefault);
  const { rows, count } = await contentDao.getContentList(page, pageCount, v2);
  ctx.json({
    data: rows,
    count,
    page,
    limit: pageCount
  });
});

// 更新信息条目
contentApi.linPut(
  'updateContent',
  '/:id',
  contentApi.permission('更新信息条目'),
  loginRequired,
  groupRequired,
  logger('{user.username}更新了一条信息条目'),
  async ctx => {
    const v1 = await new PositiveIdValidator().validate(ctx);
    const v2 = await new ContentUpdateValidator().validate(ctx);
    await contentDao.updateContent(v1.get('path.id'), v2);
    ctx.success({
      code: 18
    });
  }
);

// 删除信息条目
contentApi.linDelete(
  'deleteContent',
  '/:id',
  contentApi.permission('删除信息条目'),
  loginRequired,
  groupRequired,
  logger('{user.username}删除了一条信息条目'),
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    await contentDao.deleteContent(v.get('path.id'));
    ctx.success({
      code: 19
    });
  }
);

// 单个详情接口
contentApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const content = await contentDao.getContent(v.get('path.id'));
  ctx.json(content);
});

module.exports = { contentApi, [disableLoading]: false };
