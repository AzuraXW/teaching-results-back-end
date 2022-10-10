import { LinRouter, ParametersException } from 'lin-mizar';

import { loginRequired } from '../../middleware/jwt';
import { LocalUploader } from '../../extension/file/local-uploader';
import { PaginateValidator, PositiveIdValidator } from '../../validator/common';
import { FileDao } from '../../dao/file';

const file = new LinRouter({
  prefix: '/cms/file'
});
const fileDao = new FileDao();
file.linPost('upload', '/', loginRequired, async ctx => {
  const files = await ctx.multipart();
  if (files.length < 1) {
    throw new ParametersException({ code: 10033 });
  }
  const uploader = new LocalUploader('assets');
  const arr = await uploader.upload(files);
  ctx.json(arr);
});

file.linGet('getFiles', '/', loginRequired, async ctx => {
  const v = await new PaginateValidator().validate(ctx);
  const page = v.get('query.page', true, 1);
  const pageCount = v.get('query.count', true, 5);
  const { rows, count } = await fileDao.getFiles(page, pageCount);
  ctx.json({
    data: rows,
    count,
    page,
    limit: pageCount
  });
});

file.linGet('getFile', '/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const result = await fileDao.getFile(v.get('path.id'));
  ctx.json(result);
});

// 删除文件
file.linDelete('destoryFile', '/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  await fileDao.deleteFile(v.get('path.id'));
  ctx.success({
    code: 10270
  });
});
export { file };
