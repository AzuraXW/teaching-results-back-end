import { LinValidator, Rule } from 'lin-mizar';

class AddMusicValidator extends LinValidator {
  constructor() {
    super();
    this.title = new Rule('isNotEmpty', 'title不能为空');
    this.fav_nums = new Rule('isNotEmpty', 'fav_nums不能为空');
    this.image = new Rule('isNotEmpty', 'image不能为空');
    this.url = new Rule('isNotEmpty', 'url不能为空');
  }
}

module.exports = {
  AddMusicValidator
};
