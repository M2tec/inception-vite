import React from 'react';
import { useAppState, useStateDispatch } from '../AppContext';
import {
  FiletypeJson,
  BlockquoteLeft,
  FileEarmarkCode,
  Trash,
  Pencil,
  Save,
  Stickies,
  FilePlay
} from 'react-bootstrap-icons';

// import toast from 'cogo-toast';
import { transpile } from "../services/gcscript.js";

export default function FilesList() {
  let { files, currentFileIndex } = useAppState();

  let filesToplevel = files.filter((file) => file.parentId === -1)

  let currentFileList = files.filter((file) => file.id === currentFileIndex)
  let currentFile = currentFileList[0]

  // console.log({currentFile:currentFile})
  let expandIndex = 0;
  if (currentFile.parentId === -1) {
    // console.log("parent")
    expandIndex = currentFileIndex;
  } else {
    expandIndex = currentFile.parentId;
  }
  // console.log({expandIndex:expandIndex})

  let returnDataFiles = files.filter((file) => file.parentId === expandIndex && !file.name.includes("code"))

  let [codeFile] = files.filter((file) => file.parentId === expandIndex && file.name.includes("code"))


  let returnDataFileAmount = 0;
  if (returnDataFiles.length > 0) {
    returnDataFileAmount = returnDataFiles.length
    if (returnDataFileAmount > 5) {
      returnDataFileAmount = 5;
    }
  }

  return (
    <ul className='file-list'>
      {filesToplevel.map(item => (
        <span key={item.id}>

          <File key={item.id} file={item} />

          {item.id === expandIndex ?
            <>
              {/* {console.log({codeFile:codeFile})} */}
              {codeFile !== undefined ?
                <div key={codeFile} className='file-return-data-item'>
                  <File key={codeFile.id} file={codeFile} />
                </div>
                : null}

              {returnDataFiles.length > 0 ?
                <>
                  {returnDataFiles.map(returnItem =>
                    <div key={returnItem.id} className='file-return-data-item'>
                      <File key={returnItem.id} file={returnItem} />
                    </div>
                  )}
                </>
                : null}

            </>

            : null}

        </span>

      ))}
    </ul>
  );
}

function File({ file, dots }) {
  const [isEditing, setIsEditing] = React.useState(false);
  let { files, currentFileIndex } = useAppState();
  const dispatch = useStateDispatch();

  const [code, setCode] = React.useState("")

  React.useEffect(() => {

    if (code !== '') {
      dispatch({
        type: 'add-code',
        data: { file, code }
      });
    }

  }, [code, file, dispatch])

  React.useEffect(() => {
    let [extension] = file.name.split(".").slice(-1)
    let lastToastCloseFn;   
    // console.log(file.name + " " + extension  + " " + file.id + " " + currentFileIndex )

    if (file.name && extension === "gcscript" && file.id === currentFileIndex) {

      (async () => {

        try{
          // if(lastToastCloseFn){
          //   lastToastCloseFn();
          //   lastToastCloseFn=undefined;
          // }
          //console.log("Filename: " + file.name)
          let topLevelFiles = files.filter((file) => file.parentId === -1)
          //console.log({files})
          //console.log({topLevelFiles})

          const transpiled = await transpile({
            fileUri:`ide://${file.name||""}`,
            files:topLevelFiles,
          });
          // console.log("Transpile: " + file.id)
          setCode(transpiled);
        } catch(err) {
          const {
            type,
            fileUri,
            importTrace,
            path,
            message,
          }=err||{};
          console.error(`${type||"UnknownError"}:${message||"Unknown error"}`,{            
            type,
            fileUri,
            importTrace,
            path,
            message
          });

          dispatch({
            type: 'set-alert',
            message: message
          });
          
          // const toastId = toast.error(`${message||"Unknown error"} [${[fileUri,path].join("->")}]`,{  
          //   onClick: () => {
          //     hide();
          //   },
          //   hideAfter:10,
          //   heading:type||"UnknownError"
          // });
          // lastToastCloseFn=hide;
        }

      })()
    }
    return ()=>{<></>
      // if(lastToastCloseFn){
      //   lastToastCloseFn();
      //   lastToastCloseFn=undefined;
      // }
    }
  }, [file, currentFileIndex, files])

  // console.log(file)
  let fileContent;

  if (isEditing) {

    fileContent = (

      <div className='file-item-child'>
        <input
          value={file.name}
          onChange={e => {
            console.log({ e: e.target.value })
            dispatch({
              type: 'renamed',
              file: {
                ...file,
                name: e.target.value
              }
            });
          }} />
        <Save size={12} onClick={() => setIsEditing(false)} />

      </div>
    );
  } else {

    fileContent = (<>
      <div className='file-item-child'>
        <span className='file-item-text'>{file.name}</span>
        <Pencil size={12} className='file-item-child file-operation-icon' onClick={() => setIsEditing(true)} />
      </div>
    </>);
  }

  return (
    <li className="file-list-element" key={file.id}>

      <label
        className={
          currentFileIndex === file.id ? 'file-item file-item-selected' : 'file-item'
        }>

        <FileTypeIcon name={file.name} />


        <span
          onClick={(e) => {
            dispatch({
              type: 'selected',
              file: file
            });
          }}>
          {fileContent}</span>

        <Stickies
          className='file-operation-icon'
          onClick={(e) => {
            dispatch({
              type: 'duplicate',
              file: file
            });
          }}
          size={12} />

        <Trash
          className={
            currentFileIndex === file.id ?
              'file-operation-icon trash-selected' : 'file-operation-icon'
          }
          onClick={() => {
            dispatch({
              type: 'deleted',
              id: file.id
            });
          }}
          size={12} />
      </label>
    </li>
  );
}

function FileTypeIcon({ name }) {
  let fileIcon;

  let [extension] = name.split(".").slice(-1)

  switch (extension) {
    case 'json':
      fileIcon = (<FiletypeJson size={"15px"} className="file-icon" />);
      break;
    case 'hl':
      fileIcon = (<FileEarmarkCode size={"15px"} className="file-icon" />);
      break;
    case 'gcscript':
      fileIcon = (<BlockquoteLeft size={"15px"} className="file-icon" />);
      break;
    case 'code':
      fileIcon = (<FilePlay size={"15px"} className="file-icon" />);
      break;
    default:
      fileIcon = (<BlockquoteLeft size={"15px"} className="file-icon" />);
  }

  return (<>{fileIcon}</>)

}


