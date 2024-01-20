import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function TestPopup(props) {
    document.querySelector("body").setAttribute('data-theme', 'dark')

    function sendData(sessionID) {
        localStorage.setItem('sessionID', sessionID);

        let gc_script = `{"type":"script","title":"Lock script","description":"This contract will lock some tokens","exportAs":"Lock_Demo","return":{"mode":"last"},"run":{"dependencies":{"type":"script","run":{"datum":{"type":"plutusData","data":{"fromJSON":{"schema":1,"obj":{"int":42}}}},"lock":{"type":"data","value":[{"policyId":"ada","assetName":"ada","quantity":"5000000"}]},"stakeCredential":{"type":"data","value":"ad03a4ae45b21f50fde67956365cff94db41bc08a2c2862403d8a234"},"contract":{"type":"plutusScript","script":{"heliosCode":"{hexToStr('0a7370656e64696e67204d616769634e756d6265720a0a73747275637420446174756d207b0a202020206d616769634e756d6265723a20496e740a7d0a0a7374727563742052656465656d6572207b0a202020206d616769634e756d6265723a20496e74200a7d0a0a66756e63206d61696e28646174756d3a20446174756d2c2072656465656d65723a2052656465656d65722c205f29202d3e20426f6f6c207b2020200a2020202072656465656d65722e6d616769634e756d6265723d3d646174756d2e6d616769634e756d6265720a7d')}","version":"0.15.2"}},"address":{"type":"buildAddress","name":"ContractAddress","addr":{"spendScriptHashHex":"{get('cache.dependencies.contract.scriptHashHex')}","stakePubKeyHashHex":"{get('cache.dependencies.stakeCredential')}"}}}},"buildLock":{"type":"buildTx","name":"built-lock","tx":{"outputs":[{"address":"{get('cache.dependencies.address')}","datum":{"datumHashHex":"{get('cache.dependencies.datum.dataHashHex')}"},"assets":"{get('cache.dependencies.lock')}","idPattern":"locked"}],"options":{"changeOptimizer":"NO"}}},"signLock":{"type":"signTxs","namePattern":"signed-lock","detailedPermissions":false,"txs":["{get('cache.buildLock.txHex')}"]},"submitLock":{"type":"submitTxs","namePattern":"submitted-lock","txs":"{get('cache.signLock')}"},"finally":{"type":"script","run":{"lock":{"type":"macro","run":"{get('cache.dependencies.lock')}"},"smartContract":{"type":"macro","run":"{get('cache.dependencies.contract.scriptHex')}"},"smartContractHash":{"type":"macro","run":"{get('cache.dependencies.contract.scriptHashHex')}"},"smartContractAddress":{"type":"macro","run":"{get('cache.dependencies.address')}"},"lockTx":{"type":"macro","run":"{get('cache.buildLock.txHash')}"},"lockUTXO":{"type":"macro","run":"{get('cache.buildLock.indexMap.output.locked')}"}}}},"returnURLPattern":"http://localhost:3000/return-data/{result}"}`
        localStorage.setItem('gc_script', gc_script);

        let url = window.location.origin + "/connect"

        let newwindow = window.open(url, "Gamechanger connect id: " + sessionID,'height=875,width=755');
        
        if (window.focus) {newwindow.focus()}
           return false;     
    }
    

    function receiveData(sessionID) {
        localStorage.setItem('sessionID', sessionID);

        let returnData = "1-H4sIAAAAAAAAA11QTU8rMQz8Lzn3kDhfm94Q7_CQEFxAQkJPyGtnW2iz201SaLfqf3_bInHAt5mxx_acRDzshlyLWJ7E_UCbtz8xDRewncHz08ujWMrFFYjl60nshu07He9YLAUyioXAUmJ9wBR_mHGPfX2vx5mw8lri_G8hSsJcb4e-ZqR60Zy1Ul1kALBaa-u1cS4qYnaNVKpFllIrExrbKPHL4C-W9WxCMHdYhQ4btLbF2EHUrCW4IOcxNEDWxpZbz8rIiByVR6vlb7sb5hxLuf7A-a3GUtWUd-MhrBxDCPVrLQP5fuxsKZtwDBr8epNwKg0kqg4-A49fH7DX_JFxJVPsI1AKcbu3icdEU5gI8rQaPdmVG-2BepPFd7BPh3lvG6h10rCi-UqF3RwCBSM1YTRKgTatCrEjT-QbUiSdxM4Fb1zHAJpAnM_n_6NIvcTNAQAA"

        let url = window.location.origin + "/connect/" + returnData
        console.log(url)

        let newwindow2=window.open(url, "Gamechanger connect id: " + sessionID,'height=875,width=755');
        newwindow2.resizeTo(875,755)

        if (window.focus) {newwindow2.focus()}
           return false;     
    }

    return (
        <>
            <div className='testing'>
                <Button onClick={() => { sendData(1) }} variant="success">Send Data</Button><br /><br />
                <Button onClick={() => { receiveData(1) }} variant="success">Receive Data</Button>
            </div>
        </>
    );
}




