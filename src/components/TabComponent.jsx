import React from 'react';
import SourceViewer from './SourceViewer';
import { useAppState, useStateDispatch } from '../AppContext';
import { X } from 'react-bootstrap-icons';
import Alert from 'react-bootstrap/Alert';

export default function TabComponent(props) {
    const dispatch = useStateDispatch();
    const { alerts, files, openFiles, currentFileIndex } = useAppState();

    const GcTab = ({
        id
    }) => {
        let currentFile = files.filter((file) => file.id === id);
        let name = currentFile[0].name
        return (
            <div className={id === currentFileIndex ? "TabItem TabItemActive" : "TabItem"}>
                <span
                    onClick={(e) => {
                        dispatch({
                            type: 'selected',
                            file: currentFile[0]
                        });
                    }}
                    className='me-2'>
                    {name}
                </span>

                <X name={name}
                    onClick={(e) => {
                        dispatch({
                            type: 'closed',
                            id: id
                        });
                    }}
                    size={"20px"} />
            </div>
        )
    };

    return (
        <div className="TabContainer">
            <div className='TabBar'>
                {openFiles.map((id, index) => {
                    return (
                        <GcTab
                            index={index}
                            key={index}
                            id={id}
                        />
                    );
                })}
            </div>

            <div className={currentFileIndex ? "TabPane  TabPaneActive" : "TabPane"}>
                {/* {console.log(currentFileIndex)} */}
                <SourceViewer id={currentFileIndex} readOnly={false} />
            </div>

            {alerts.length > 0 ? (
                <Alert key={'warning'} variant={'warning'}>
                    {alerts.map((alert, index) => <div key={index}>{alert}</div>)}
                </Alert>)
                :
                null}

        </div>
    );
};
