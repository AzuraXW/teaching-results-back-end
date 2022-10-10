import { LinValidator, Rule } from 'lin-mizar';

class ContentAddValidator extends LinValidator {
  constructor() {
    super();
    this.title = new Rule('isNotEmpty', '必须传入标题');
    this.text = new Rule('isNotEmpty', '必须传入内容');
    this.type = [new Rule('isOptional'), new Rule('isInt', 'type必须是整数')];
    this.sort = [
      new Rule('isOptional'),
      new Rule('isInt', '排序权重必须是整数')
    ];
    this.file_id = [
      new Rule('isOptional'),
      new Rule('isInt', '文件id必须是整数')
    ];
    this.category_id = new Rule('isInt', '分类id必须是整数');
    this.is_show = [
      new Rule('isOptional'),
      new Rule('isInt', 'file_id必须是整数')
    ];
  }
}

class ContentSearchValidator extends LinValidator {
  constructor() {
    super();
    this.search = [
      new Rule('isOptional'),
      new Rule('isNotEmpty', '搜索关键字不能为空')
    ];
  }
}

class ContentUpdateValidator extends LinValidator {
  constructor() {
    super();
    this.title = [
      new Rule('isOptional'),
      new Rule('isNotEmpty', '必须传入标题')
    ];
    this.text = [
      new Rule('isOptional'),

      new Rule('isNotEmpty', '必须传入内容')
    ];
    this.type = [new Rule('isOptional'), new Rule('isInt', 'type必须是整数')];
    this.sort = [
      new Rule('isOptional'),
      new Rule('isInt', '排序权重必须是整数')
    ];
    this.file_id = [
      new Rule('isOptional'),
      new Rule('isInt', '文件id必须是整数')
    ];
    this.category_id = [
      new Rule('isOptional'),
      new Rule('isInt', '分类id必须是整数')
    ];
    this.is_show = [
      new Rule('isOptional'),
      new Rule('isInt', 'file_id必须是整数')
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

export {
  ContentAddValidator,
  ContentUpdateValidator,
  ContentSearchValidator,
  ExistValidator
};
