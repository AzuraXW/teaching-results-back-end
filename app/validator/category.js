import { LinValidator, Rule } from 'lin-mizar';
import { CategoryModel } from '../model/category';

class CategoryAddValidator extends LinValidator {
  constructor() {
    super();
    this.name = new Rule('isNotEmpty', '必须传入分类名称');
    this.sort = [
      new Rule('isOptional'),
      new Rule('isInt', '排序权重必须是整数')
    ];
    this.is_show = [
      new Rule('isOptional'),
      new Rule('isInt', 'is_show必须是整数')
    ];
  }
}

class ExistValidator extends LinValidator {
  async validateCategoryExist(data) {
    const id = data.param.id;
    const result = await CategoryModel.findByPk(id);
    if (!result) {
      return [false, '该分类不存在', 'id'];
    }
    return true;
  }
}

export { CategoryAddValidator, ExistValidator };
