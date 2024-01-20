import React, { createContext, useContext, useReducer } from "react";

import JSZip from "jszip";
import moment from 'moment';
import { saveAs } from 'file-saver';

// import projects from "./data/project-list.js";
import DAO_Demo from "./data/DAO_Demo.js";
import Token_Locking from "./data/Token_Locking.js";


const FilesContext = createContext(null);
const FilesDispatchContext = createContext(null);

export function StateProvider({ children }) {

    const [files, dispatch] = useReducer(stateReducer, initialState);

    return (
        <FilesContext.Provider value={files}>
            <FilesDispatchContext.Provider value={dispatch}>
                {children}
            </FilesDispatchContext.Provider>
        </FilesContext.Provider>
    )
}

export function useAppState() {
    return useContext(FilesContext);
}

export function useStateDispatch() {
    return useContext(FilesDispatchContext);
}

function stateReducer(state, action) {

    let { name, files, openFiles, currentFileIndex, theme } = state;
    // console.log({ files: files })
    // console.log({ action: action })

    let ids = files.map((file) => file.id);
    let largest = Math.max.apply(0, ids);

    function saveState(state) {
        console.log("saveState")

        let projectData = {
            name: state.name,
            type: state.type,
            theme: state.theme,
            currentFileIndex: state.currentFileIndex,
            openFiles: state.openFiles,
            files: state.files
        }

        localStorage.setItem("data_" + state.currentProjectIndex, JSON.stringify(projectData))

        let appData = {
            currentProjectIndex: state.currentProjectIndex,
        }
        
        localStorage.setItem("app-data", JSON.stringify(appData))
        console.log(state)
    }

    function LoadState(state) {
        console.log("loadState")
        let appData = JSON.parse(localStorage.getItem("app-data"))

        let loadState = JSON.parse(localStorage.getItem("data_" + appData.currentProjectIndex))
        // console.log("data_" + currentProjectIndex)
        
        let newState = {
            ...loadState,
            ...appData
        };

        console.log({newState})
        return newState
    }



    switch (action.type) {

        case 'menu-change': {
            console.log('menu-change')
            console.log(action.id)

            return { ...state };
        }

        case 'theme': {
            console.log('theme')
            theme === "dark" ? theme = "light" : theme = "dark"

            document.querySelector("body").setAttribute('data-theme', theme)

            let newState = { ...state, theme };
            saveState(newState)
            return newState
        }

        case 'selected': {
            console.log("selected")
            // console.log({selState:state})
            console.log({ action: action })
            // console.log(action.file.id)

            let newFileIndex = 0

            openFiles.indexOf(action.file.id) === -1 ? openFiles.push(action.file.id) : console.log("Item already open");
            newFileIndex = action.file.id;
            // console.log({newFileIndex})

            let newState = { ...state, openFiles, currentFileIndex: newFileIndex };
            saveState(newState)
            return newState
 
        }

        case 'closed': {
            let newOpenFiles = openFiles
            if (openFiles.length > 1) {

                newOpenFiles = openFiles.filter((fileId) => fileId !== action.id)

                if (action.id === currentFileIndex) {
                    currentFileIndex = newOpenFiles.slice(-1)[0]
                    console.log(currentFileIndex)
                }
            }

            let newState = { ...state, openFiles: newOpenFiles, currentFileIndex };
            saveState(newState)
            return newState
        }

        case 'renamed': {
            console.log("Renamed file")
            console.log({ action: action })
            // console.log({files:files})
            // console.log({sourceData:sourceData})

            let newFiles = files.map(f => {
                if (f.id === action.file.id) {
                    return action.file;
                } else {
                    return f;
                }
            });

            let newState = { ...state, files: newFiles };
            saveState(newState)
            return newState
        }

        case 'changed-data': {
            console.log("Changed data")

            let newFiles = files.map(f => {
                if (f.id === action.file.id) {
                    return action.file;
                } else {
                    return f;
                }
            });

            let newState = { ...state, files: newFiles }
            saveState(newState)
            return { ...newState }
        }

        case 'duplicate': {
            console.log("duplicate")
            // console.log({dupState:state})

            state.files.forEach((element) => console.log(element.id + " " + element.data))

            // New file name
            let newFileNameSplit = action.file.name.split(".", 2)
            let newFileName = newFileNameSplit[0] + "-1." + newFileNameSplit[1]

            let dupFile = action.file
            let newFile = { ...dupFile, id: largest + 1, name: newFileName }
            let newFiles = [...files, newFile]

            let newState = { ...state, files: newFiles };
            saveState(newState)
            return newState
        }

        case 'add-code': {
            console.log("add-code")
            console.log({action:action})

            moment.locale('en');
    
            let newName = "code-" + moment().format('y-M-D_h-m-s-SSS') + ".code";
            let newCodeFile =
            {
              id: largest + 1,
              name: newName,
              parentId: action.data.file.id,
              type: "code",
              data: JSON.stringify(action.data.code, null, 2)
            }
    
            console.log({newCodeFile:newCodeFile})

            let newFiles = state.files.filter((file) => {
                // console.log(file.name + " " + file.parentId + " " +  action.data.file.id)

                if (file.type !== "code")// && ) 
                {
                    // console.log("true")
                    return true 
                } else {
                    if (file.parentId === action.data.file.id){
                        // console.log("false")
                        return false
                    } else {
                        // console.log("true")
                        return true
                    }
                }
            })
            newFiles = [...newFiles, newCodeFile]
            console.log({newFiles})

            // let allIds = newFiles.map((file) => file.id)
            // // console.log(allIds)

            // let newOpenFiles = state.openFiles.filter((id) => allIds.includes(id) )
            // // console.log(newOpenFiles)

            // let newState = { ...state, files: newFiles, openFiles:newOpenFiles };
            // saveState(newState)
            // return newState
            return state
        }

        case 'deleted': {
            console.log("delete")
            let newOpenFiles = openFiles
            newOpenFiles = openFiles.filter((fileIndex) => fileIndex !== action.id)

            if (action.id === currentFileIndex) {
                currentFileIndex = newOpenFiles[0]
            }

            let newFiles = files.filter(t => t.id !== action.id)
            
            let newState = { ...state, 
                                files: newFiles, 
                                openFiles: newOpenFiles, 
                                currentFileIndex 
                           }

            saveState(newState)
            return newState
        }

        case 'receive-data': {
            console.log("act.recieve-data")
            console.log({ action: action })

            let ids = state.files.map((file) => file.id);
            let largest = Math.max.apply(0, ids);

            moment.locale('en');
            let fileName = "data-" + moment().format('y-M-D_h-m') + ".json"

            let [currentFile] = state.files.filter((file) => file.id === state.currentFileIndex)

            // console.log("save item")
            let newItem = {
                id: largest + 1,
                parentId: currentFile.parentId,
                name: fileName,
                type: "json",
                data: JSON.stringify(action.returnData, null, 4)
            }

            let newFiles = state.files
            newFiles = [...newFiles, newItem]

            let newState = { ...state, files: newFiles }
            saveState(newState)
            return { ...newState }
        }

        case 'load-from-storage': {
            console.log('load-from-storage')
            let storageState = LoadState(state)
            return storageState;
        }

        case 'rename-project': {
            console.log("rename-project")
            console.log({ action: action })

            // let newProjects = state.projects
            // newProjects[state.currentProjectIndex] = action.name

            let newState = {
                ...state,
                name: action.name
            }

            saveState(newState)
            return newState
        }

        case 'duplicate-project': {
            console.log("duplicate-project")
            console.log({ state: state })
            console.log({ action })

            let {currentProjectIndex, ...newProjectData} = state
            newProjectData = {...newProjectData,
                name: state.name + "-1",
            }

            console.log({currentProjectIndex})

            let largest = Math.max.apply(0, action.projects);
            let newProjectIndex = largest + 1

            localStorage.setItem("data_" + newProjectIndex , JSON.stringify(newProjectData))                                

            let newState = {
                ...newProjectData,
                currentProjectIndex: newProjectIndex
                            }

            saveState(newState)
            return newState
        }

        case 'delete-project':{
            console.log("delete-project")
            console.log({action})

            localStorage.removeItem(action.project.id)
            saveState(state)
            return state
        }

        case 'set-project': {
            console.log("set-project")
            console.log({ action: action })

            let projectData = action.project.data

            let newProjectIndex = action.project.id
            newProjectIndex = parseInt(newProjectIndex.split("_")[1])

            let newState = {
                currentProjectIndex: newProjectIndex,
                ...projectData
            }
            saveState(newState)
            return newState
        }

        case 'ad-visibility': {
            console.log("ad-visibility")
            console.log({ action: action })

            return { ...state, advertisement: !state.advertisement }
        }

        case 'download-project': {
            console.log("download-project")
            console.log({ action: action })

            const zip = new JSZip();

            for (let file = 0; file < files.length; file++) {
                // Zip file with the file name.
                zip.file(files[file].name, files[file].data);
            }
            zip.generateAsync({ type: "blob" }).then(content => {
                saveAs(content, name + ".zip");
            });

            console.log({ state: state })

            return state
        }
        case 'set-alert': {
            console.log("set-alert")
            console.log({action})

            let newAlerts = state.alerts
            newAlerts.push(action.message)

            let newState = {...state, alerts:newAlerts}
            saveState(newState)
            return newState
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

let appData = JSON.parse(localStorage.getItem('app-data'))

if (appData == null) {
    // console.log({ projects: projects })
    appData = { currentProjectIndex: 0 }

    localStorage.setItem('app-data', JSON.stringify(appData))
    localStorage.setItem('data_0', JSON.stringify(Token_Locking))
    localStorage.setItem('data_1', JSON.stringify(DAO_Demo))
}

console.log({ projectList: appData })

let stateFile = "data_" + appData.currentProjectIndex
let storageState = JSON.parse(localStorage.getItem(stateFile))
console.log({ LoadFromStorage: storageState })

let initialState = {}

if (storageState == null) {
    console.log("New from default data")
    initialState = {
        ...Token_Locking,
        ...appData,
        advertisement: true,
        alerts:[]
    }
} else {
    console.log("Load from storage")

    let ids = storageState.files.map((file) => file.id);
    let smallest = Math.min.apply(0, ids);

    initialState = {
        ...storageState,
        ...appData,
        currentFileIndex:smallest,
        openFiles: [smallest],
        alerts:[]
    };
}

console.log({ INIT: initialState })