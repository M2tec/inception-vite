import React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { XCircle } from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useStateDispatch } from '../AppContext';

const gc = window.gc;

export function GcConnect(gc_script) {
    gc_script = JSON.parse(gc_script)
    gc_script.returnURLPattern = window.location.origin + window.location.pathname + "receive/{result}";

    async function buildActionUrl(gc_script) {
        gc_script = JSON.stringify(gc_script)
        console.log(gc_script)
        console.log(typeof (gc_script))
        const actionUrl = await gc.encode.url({
            input: gc_script,
            apiVersion: "2",
            network: "preprod",
            //encoding:"gzip",
        });

        // localStorage.setItem("SessionID", 1)
        let newwindow = window.open(actionUrl, "Gamechanger connect", 'height=875,width=755');
        if (window.focus) { newwindow.focus() }
    }

    if (gc_script !== undefined) {
        // console.log({ Script: gc_script })
        buildActionUrl(gc_script);
    }

}

export function ReceivePopup() {
    const dispatch = useStateDispatch();

    let { returnData } = useParams();
    const [resultObj, setResultObj] = React.useState({});
    console.log("receive")
    React.useEffect(() => {
        console.log("returnData")

        async function decodeActionUrl(returnData) {
            const data = await gc.encodings.msg.decoder(returnData);
            setResultObj(data);
        }

        if (returnData !== undefined) {
            decodeActionUrl(returnData);
        }
    }, [returnData])

    function handelClose() {
        console.log("close--")
        window.localStorage.setItem("DataIsHere", "DataReceived")
        dispatch({
            type: "receive-data",
            returnData: resultObj
        })

        window.close();
    }

    return (
        <>
            {window.resizeTo(875, 755)}
            {/* {window.resizeTo(1200, 755)} */}
            {document.querySelector("body").setAttribute('data-theme', 'dark')}
            <div className='fontwhite p-4'>
                <div className='p-4 square border-1 border-danger rounded'>
                    <pre>{JSON.stringify(resultObj, null, 2)}</pre>
                </div>
                <Button className="m-4" onClick={handelClose} variant="warning"><Row><Col className='buttonPadding'><XCircle size={"20px"} /></Col><Col className='buttonPadding'>Close</Col></Row></Button>
            </div>
        </>
    )
}
