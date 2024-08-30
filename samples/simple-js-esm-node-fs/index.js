import fs  from "node:fs";
import fsPromises from "node:fs/promises";

const DIR_PATH = ".";
const FILE_PATH = `${DIR_PATH}/test.txt`;
const COPY_FILE_DEST = `${DIR_PATH}/copy.txt`;
const SECOND_COPY_FILE_DEST = `${DIR_PATH}/copy2.txt`;
const NEW_DIR_PATH = `abc`;

function runSyncFsOperations() {
  const {
    openSync,
    closeSync,
    statSync,
    lstatSync,
    readFileSync,
    readdirSync,
  } = fs;

  try {
    const fileDescriptor = openSync(FILE_PATH);
    closeSync(fileDescriptor);

    const stat = statSync(FILE_PATH);
    const lstat = lstatSync(FILE_PATH);
    console.log(`\n[sync] stat result: ${JSON.stringify(stat)}`);
    console.log(`\n[sync] lstat result: ${JSON.stringify(lstat)}`);

    const fileContent = readFileSync(FILE_PATH).toString();
    console.log(`\n[sync] file content: ${fileContent}`);

    const dirFiles = readdirSync(DIR_PATH);
    console.log(`\n[sync] dir files: ${dirFiles}`);
  } catch (err) {
    throw new Error(`[sync] ${err.message}`)
  }
}

async function runAsyncFsOperationsWithCallback() {
  const {
    open,
    close,
    stat,
    lstat,
    readFile,
    readdir,
    mkdir,
    rmdir,
    copyFile,
    cp,
    writeFile,
    rename,
    realpath,
  } = fs;

  open(FILE_PATH, (err, fd) => {
    if (err) {
      console.log(`[async - callback] error in open: ${err}`);
    } else {
      close(fd, (err) => {
        if (err) {
          console.log(`[async - callback] error in close: ${err}`);
        }
      });
    }
  });

  stat(FILE_PATH, (err, stats) => {
    if (err) {
      console.log(`[async - callback] error in stat: ${err}`);
    } else {
      console.log(`\n[async - callback] stat result: ${JSON.stringify(stats)}`);
    }
  });
  lstat(FILE_PATH, (err, stats) => {
    if (err) {
      console.log(`[async - callback] error in lstat: ${err}`);
    } else {
      console.log(`\n[async - callback] lstat result: ${JSON.stringify(stats)}`);
    }
  });

  readFile(FILE_PATH, (err, data) => {
    if (err) {
      console.log(`[async - callback] error in readFile: ${err}`);
    } else {
      console.log(`\n[async - callback] file data: ${data}`);
    }
  });

  copyFile(FILE_PATH, COPY_FILE_DEST, (err) => {
    if (err) {
      console.log(`[async - callback] error in copyFile: ${err}`);
    }
  });

  mkdir(NEW_DIR_PATH, (err) => {
    if (err) {
      console.log(`[async - callback] error in mkdir: ${err}`);
    } else {
      rmdir(NEW_DIR_PATH, (err2) => {
        if (err2) {
          console.log(`[async - callback] error in rmdir: ${err2}`);
        }
      });
    }
  });

  readdir(DIR_PATH, (err, files) => {
    if (err) {
      console.log(`[async - callback] error in readdir: ${err}`);
    } else {
      console.log(`\n[async - callback] dir files: ${files}`);
    }
  });

  cp(FILE_PATH, SECOND_COPY_FILE_DEST, (err) => {
    if (err) {
      console.log(`[async - callback] error in cp: ${err}`);
    }
  });

  writeFile('anothe_file_create_by_promises_fs_cb.txt', "another content in a file", (err) => {
    if (err) {
      console.log(`[async - callback] error in writeFile: ${err}`);
    } else {
      readFile('anothe_file_create_by_promises_fs_cb.tx', 'utf8', (err, data) => {
        if (err) {
          console.log(`[async - callback] error in readFile after write: ${err}`);
        } else {
          console.log(`\n[async - callback] file content after write: ${data}`);
        }
      });
    }
  });

  writeFile('born_to_be_renamed.txt', "the file will be renamed!", (err) => {
    if (err) {
      console.log(`[async - callback] error in writeFile: ${err}`);
    } else {
      rename('born_to_be_renamed.txt', 'fulfilled_his_destiny.txt', (err) => {
        if (err) {
          console.log(`[async - callback] error in rename: ${err}`);
        } else {
          readFile('fulfilled_his_destiny.txt', 'utf8', (err, data) => {
            if (err) {
              console.log(`[async - callback] error in readFile after rename: ${err}`);
            } else {
              console.log(`\n[async - callback] file content after rename: ${data}`);
            }
          });
        }
      });
    }
  });

  realpath('anothe_file_create_by_promises_fs_cb.txt', (err, resolvedPath) => {
    if (err) {
      console.log(`[async - callback] error in realpath: ${err}`);
    } else {
      console.log(`\n[async - callback] realpath: ${resolvedPath}`);
    }
  });
}

async function runAsyncFsOperationsWithPromises() {
  const {
    open,
    stat,
    lstat,
    readFile,
    readdir,
    mkdir,
    rmdir,
    copyFile,
    cp,
    writeFile,
    rename,
    realpath,
  } = fsPromises;

  try {
    const fd = await open(FILE_PATH);
    console.log(`\n[async - promise] open file result ${JSON.stringify(fd)}`);
    fd.close();

    const stats = await stat(FILE_PATH);
    console.log(`\n[async - promise] stat result: ${JSON.stringify(stats)}`);

    const lstats = await lstat(FILE_PATH);
    console.log(`\n[async - promise] lstat result: ${JSON.stringify(lstats)}`);

    const data = await readFile(FILE_PATH);
    console.log(`\n[async - promise] file data: ${data}`);

    await copyFile(FILE_PATH, COPY_FILE_DEST);

    console.log(`\n[async - promise] write file data`);
    await writeFile('born_to_renamed_promises.txt', "the file will be renamed!");

    const lstatsAfterWrite = await lstat('born_to_renamed_promises.txt');
    console.log(`\n[async - promise] lstat result after write: ${JSON.stringify(lstatsAfterWrite)}`);

    const fileContent_1 = await readFile('born_to_renamed_promises.txt', 'utf8');
    console.log(`\n[async - promise] file content after write: ${fileContent_1}`);

    await rename('born_to_renamed_promises.txt', 'was_renamed.txt');

    const fileContent_2 = await readFile('was_renamed.txt', 'utf8');
    console.log(`\n[async - promise] file content after rename: ${fileContent_2}`);

    const realPath = await realpath('was_renamed.txt');
    console.log(`\n[async - promise] realpath: ${realPath}`);

    await mkdir(NEW_DIR_PATH);
    await rmdir(NEW_DIR_PATH);

    const files = await readdir(DIR_PATH);
    console.log(`\n[async - promise] dir files: ${files}`);

    await cp(FILE_PATH, SECOND_COPY_FILE_DEST);

  } catch (err) {
    throw new Error(`[async - promise] ${err.message}`)
  }
}

export default async function handler() {
  try {
    runSyncFsOperations();

    await runAsyncFsOperationsWithCallback();

    await runAsyncFsOperationsWithPromises();

    return new Response('OK!', {
      headers: new Headers([['Content-Type', 'text/plain']]),
      status: 200,
    });
  } catch (error) {
    console.log("Error:", error.message);

    return new Response(error.message, {
      headers: new Headers([['Content-Type', 'text/plain']]),
      status: 500,
    });
  }
}
