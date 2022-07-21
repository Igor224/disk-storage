import config from '../../../config/default';
import User from '../services/user.CRUDservice';
import File from '../services/file.CRUDservice';
import DTO from '../dtos/file-dto';
import ApiError from '../../packages/exeptions';

const {storageServices: storage} = config;

export async function uploadFile(req, res, next) {
  try {
    const fileRq = req.files.file; // сделать реализацию для массива файлов form-data
    const fileDTO = new DTO(fileRq);
    const path = `${storage.DIR}\\${fileDTO.name}.data`; // сменить расширение файла на data

    const file = await File.findOrCreate(fileDTO) // file[Object, boolean]
      .then((data) => {
        data[1] ? (fileRq.mv(path), data[0]) : data[0];
      }); // если файла нет в базе, то пишем в базу и папку, иначе просто возвращаем найденое

    const user = await User.findOrCreate({id: req.user.id});

    const association = await User.addFileToUser(file, user); // [Object, boolean]

    if (user.diskSpace + fileDTO.size > user.diskSpace) {
      return next(ApiError.ClientUpDownloadErr('There is no space on the disk'));
    }

    user.diskSpace = user.diskSpace + fileRq.size;


    if (association[1]) {
      return next(ApiError.ClientUpDownloadErr('File already exist'));
    }

    await user.save();

    res.json(file.toJSON());
  } catch (e) {
    // добавить логгер здесь!

    return next(e);
  }
}
