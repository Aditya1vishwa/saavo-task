import fs from "fs";

const Common = {}


Common.deleteLocalFiles = async (files) => {
    if (!files || !files.length) return;
    const fileArray = Array.isArray(files) ? files : [files];
    for (const file of fileArray) {
        try {
            await fs.promises.unlink(file);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`Error deleting file: ${file}`, err);
            }
        }
    }
};

export default Common;
