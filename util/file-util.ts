import { readdir, lstat} from "fs/promises";
import { basename } from "path";
import type { FileMetaData } from "../types/util-types";

async function isFolder(path: string): Promise<boolean> {
    return (await lstat(path)).isDirectory();
}

// reads whole directory
export async function readDirectory(root: string, callBack: (metaData:FileMetaData)=> void): Promise<void> 
{
    if (!(await isFolder(root))) { 
		callBack({ fileName: basename (root), filePath: root.replaceAll ("\\", "/")});
		return; 
	}
    
    const files: string[] = await readdir(root);
    for (var file of files)	readDirectory(root + "\\" + file, callBack);
}
