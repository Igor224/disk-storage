export default class FileDto {
  extention;
  name;
  md5;
  type;
  size;

  constructor(fileRq) {
    const file = fileRq.name.split('.');

    this.extention = file.pop();
    this.name = file.join('.');
    this.md5 = fileRq.md5;
    this.type = fileRq.mimetype;
    this.size = fileRq.size;
  }
}
