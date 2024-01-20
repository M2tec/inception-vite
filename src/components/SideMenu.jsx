import React from "react";
import Button from 'react-bootstrap/Button';
import { useAppState, useStateDispatch } from '../AppContext';
import { GcConnect } from "./GameChangerAPI";

import {
  Files,
  PlayFill,
  CloudUploadFill,
  Download
} from 'react-bootstrap-icons';

export default function SideView(props) {
  let { files, currentFileIndex } = useAppState();
  const dispatch = useStateDispatch();

  // console.log({files:files})
  let fileList = files.filter((file) => file.id === currentFileIndex)
  let file = fileList[0]

  let isActiveAGCScript = false;
  if (file !== undefined) {
    isActiveAGCScript = file.name.endsWith('.code');
  }

  // Detect when data is returned to master app 
  // by listening for localstorage event. 
  window.addEventListener("storage", () => {
    const data = (window.localStorage.getItem("DataIsHere"))
    console.log("Eventlistener: " + data);
    if (data !== '') {
      dispatch({
        type: 'load-from-storage',
      });
      window.localStorage.setItem("DataIsHere", "")
    }
  })

  async function handleClickRun(e) {

    console.log("Deploy");
 
    // console.log(currentFileIndex)
    // console.log({files})

    let [currentFile] = files.filter((file) => file.id === currentFileIndex)
    // console.log({currentFile})
    GcConnect(currentFile.data);
    
    return false;
  }

  return (<div>

    <Button
      variant="primary">
      <Files size={"20px"} />
    </Button>

    <Button
      onClick={handleClickRun}
      disabled={!isActiveAGCScript}
      variant="primary">
      <PlayFill size={"20px"} />
    </Button>

    <Button
      variant="primary">
      <CloudUploadFill size={"20px"} />
    </Button>

    <Button
    onClick={() => {
      dispatch({
        type: 'download-project',
      });
    }}
      variant="primary">
      <Download size={"20px"} />
    </Button>
  </div>

  );
}
