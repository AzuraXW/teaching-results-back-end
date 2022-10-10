import { LinRouter, disableLoading } from 'lin-mizar';
import { AllPassValidator } from '../../validator/common';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const configApi = new LinRouter({
  prefix: '/v1/config',
  module: '网站配置'
});

// 获取配置
configApi.get('/', loginRequired, async ctx => {
  const config = require(resolve(__dirname, '../../config/site.json'));
  ctx.json({
    code: 200,
    data: config
  });
});

// 更新配置
configApi.linPut(
  'updateConfig',
  '/',
  configApi.permission('更新配置'),
  loginRequired,
  groupRequired,
  async ctx => {
    const path = resolve(__dirname, '../../config/site.json');
    const oldConfig = require(path);
    const v = await new AllPassValidator().validate(ctx);
    Object.keys(oldConfig).forEach(key => {
      oldConfig[key] = v.get(`body.${key}`, true, oldConfig[key]);
    });
    writeFileSync(path, JSON.stringify(oldConfig, null, 2));
    ctx.success({
      code: 24
    });
  }
);

module.exports = { configApi, [disableLoading]: false };
