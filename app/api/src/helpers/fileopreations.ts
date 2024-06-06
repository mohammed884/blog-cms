import path from "node:path";
import { mimeTypes } from "../constants/constants";
import { unlink } from "node:fs";
import { nanoid } from "nanoid"

export const uploadSingle = (file) => {
  try {
    if (!mimeTypes.find((type) => type === file.mimetype))
      return { success: false, err: "صيغة الصورة غير مصرح بها" };
    const imagePath = `${nanoid()}-${file.name.replace(/ /g, "-")}`;
    const filePath = `${path.join(__dirname, "../uploads")}/${imagePath}`;
    file.mv(filePath, (err: Error) => {
      if (err) {
        console.log(err);
        return { success: false };
      }
    });
    return { success: true, path: imagePath };
  } catch (err) {
    console.log(err);
  }
};
/*
arguments/
files , and the desiered loop number, 
mapping the files,
looping through them
chekcing the mimetype
upload the image
add the field and the paths to the files
*/
export const uploadMultiple = <T>(files: T, loopCount: number) => {
  try {
    const paths = [];
    const mappedFiles: Array<
      [
        string,
        {
          name: string;
          mimetype: string;
          mv: (path: string, err: (err: Error) => {}) => {};
        }
      ]
    > = Object.entries(files);
    for (let i = 0; i < loopCount; i++) {
      const [field, file] = mappedFiles[i];
      if (!mimeTypes.find((type) => type === file.mimetype))
        return { success: false, message: "صيغة الصورة غير مصرح بها" };
      const imagePath = `${nanoid()}-${file.name}`;
      const filePath = `${path.join(__dirname, "../uploads")}/${imagePath}`;
      file.mv(filePath, (err: Error) => {
        if (err) {
          console.log(err);
          return { success: false };
        }
      });
      paths.push([field, imagePath]);
    }
    return { success: true, paths: Object.fromEntries(paths) };
  } catch (err) {
    console.log(err);
  }
};
export const deleteSingle = (filePath: string): { success: boolean } => {
  try {
    unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return { success: true }
  } catch (err) {
    console.log(err);
  }
}