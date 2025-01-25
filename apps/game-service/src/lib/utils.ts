import fs, { Dirent } from "fs";
import path from "path";
export const getFiles = (dir: string, nested?: boolean, filter?: (f: Dirent) => boolean): string[] => {
  const filesInfo: string[] = [];
  const folders = fs.readdirSync(dir, { withFileTypes: true }).filter(f => filter?.(f));

  folders.forEach((folder) => {
    const folderPath = path.join(dir, folder.name);
    if (folder.isDirectory() && nested) {
      filesInfo.push(...getFiles(folderPath, nested));
    } else if (folder.isFile()) {
      filesInfo.push(folderPath);
    }
  });

  return filesInfo;
};
