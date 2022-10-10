import { LinValidator, Rule } from 'lin-mizar';
import { BannerModel } from '../model/banner';

class BannerAddValidator extends LinValidator {
  constructor() {
    super();
    this.file_id = [
      new Rule('isNotEmpty', '必须传入图片id'),
      new Rule('isInt', '图片id必须是整数')
    ];
    this.is_show = [
      new Rule('isOptional'),
      new Rule('isInt', 'is_show必须是整数')
    ];
  }
}

export { BannerAddValidator };
