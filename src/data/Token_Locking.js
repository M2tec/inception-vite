const project = {
    name: "Token_Locking",
    type: "folder",
    theme: 'dark',
    currentFileIndex: 0,
    openFiles: [0],
    files: [
        {
            id: 0,
            name: "contract.hl",
            parentId: -1,
            type: "helios",
            data: `
spending MagicNumber

struct Datum {
    magicNumber: Int
}

struct Redeemer {
    magicNumber: Int 
}

func main(datum: Datum, redeemer: Redeemer, _) -> Bool {   
    redeemer.magicNumber==datum.magicNumber
}`
        },
        {
            id: 8,
            name: "datum.json",
            parentId: -1,
            type: "json",
            data: `{
    "type": "plutusData",
    "data": {
    "fromJSON": {
        "schema": 1,
        "obj": {
            "int": 42
            }
    }
    }
}
`
        },
        {
            id: 9,
            name: "redeemer.json",
            parentId: -1,
            type: "json",
            data: `{
    "type": "plutusData",
    "data": {
    "fromJSON": {
        "schema": 1,
        "obj": {
            "int": 42
            }
        }
    }
}            
`
        },
        {
            id: 3,
            name: "gc_script_template.gcscript",
            parentId: -1,
            type: "json",
            data: `{
    "type": "script",
    "title": "Lock script",
    "description": "This contract will lock some tokens",
    "exportAs": "Lock_Demo",
    "return": {
        "mode": "last"
    },
    "run": {
        "dependencies": {
            "type": "script",
            "run": {
                "datumJson":{
                    "type":"$importAsData",
                    "as":"json",
                    "from":{
                        "datum":"ide://datum.json"
                    }
                }, 
                "datum":{
                    "type": "plutusData",
                    "data": {
                        "fromJSON": {
                            "schema": 1,
                            "obj": "get('cache.dependencies.datumJson.datum')"
                        }
                    }
                },
                "helios":{
                    "type":"$importAsData",
                    "as":"hex",
                    "from":{
                        "contract":"ide://contract.hl"
                    }
                },
                "imports":{
                    "type":"$importAsScript",
                    "argsByKey":{
                        "listKeys":5,
                        "erroneous":"foobar"
                    },
                    "from":{
                        "listKeys":"ide://list_keys.gcscript",
                        "erroneous":"ide://data.json"
                    }
                }, 
                "moreImports":{
                    "type":"$importAsScript",
                    "title":"Wrapper script",
                    "description":"this wrapper embedds external gcscripts",
                    "args":{
                        "foo":true,
                        "bar":"baz"
                    },
                    "from":{
                        "one":"ide://list_keys.gcscript",
                        "two":"ide://data.json"
                    }
                }, 
                "lock": {
                    "type": "data",
                    "value": [
                        {
                            "policyId": "ada",
                            "assetName": "ada",
                            "quantity": "5000000"
                        }
                    ]
                },
                "stakeCredential": {
                    "type": "data",
                    "value": "ad03a4ae45b21f50fde67956365cff94db41bc08a2c2862403d8a234"
                },
                "contract": {
                    "type": "plutusScript",
                    "script": {
                      "heliosCode": "{hexToStr(get('cache.dependencies.helios.contract'))}",
                      "version": "0.15.2"
                    }
                  },                
                "address": {
                    "type": "buildAddress",
                    "name": "ContractAddress",
                    "addr": {
                        "spendScriptHashHex": "{get('cache.dependencies.contract.scriptHashHex')}",
                        "stakePubKeyHashHex": "{get('cache.dependencies.stakeCredential')}"
                    }
                }
            }
        },
        "buildLock": {
            "type": "buildTx",
            "name": "built-lock",
            "tx": {
                "outputs": [
                    {
                        "address": "{get('cache.dependencies.address')}",
                        "datum": {
                            "datumHashHex": "{get('cache.dependencies.datum.dataHashHex')}"                            
                        },
                        "assets": "{get('cache.dependencies.lock')}",
                        "idPattern":"locked"
                    }
                ],
                "options": {
                    "changeOptimizer": "NO"
                }
            }
        },
        "signLock": {
            "type": "signTxs",
            "namePattern": "signed-lock",
            "detailedPermissions": false,
            "txs": [
                "{get('cache.buildLock.txHex')}"
            ]
        },
        "submitLock": {
            "type": "submitTxs",
            "namePattern": "submitted-lock",
            "txs": "{get('cache.signLock')}"
        },
        "finally": {
            "type": "script",
            "run": {
                "lock": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.lock')}"
                },
                "smartContract": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.contract.scriptHex')}"
                },
                "smartContractHash": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.contract.scriptHashHex')}"
                },
                "smartContractAddress": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.address')}"
                },
                "lockTx": {
                    "type": "macro",
                    "run": "{get('cache.buildLock.txHash')}"
                },
                "lockUTXO": {
                    "type": "macro",
                    "run": "{get('cache.buildLock.indexMap.output.locked')}"
                }
            }
        }
    }
}

`
        },
        {
            id: 5,
            name: "list_keys.gcscript",
            parentId: -1,
            type: "json",
            data: `{
    "type": "script",
    "title": "List keys in workspace",
    "description": "List and sort all keys in current workspace",
    "exportAs": "data",
    "run": {
        "keys": {
            "type": "getPublicKeys",
            "keyPattern": "{artifactName}:{pubKeyHashHex}",
            "sort": "ascending"
        }
    }
}
`},
{
            id: 6,
            name: "data.json",
            parentId: 5,
            type: "json",
            data: `{
    "exports": {
        "Lock_Demo": {
        "lockUTXO": 0,
        "lock": [
        {
            "policyId": "ada",
            "assetName": "ada",
            "quantity": "5000000"
        }
        ],
            "smartContract": "56550100002225333573466e1cdd68011bad0031498581",
            "smartContractHash": "c203151a6a8a55baef2e3d302690858a42c55ebdb7d140eade17a530",
            "smartContractAddress": "addr_test1zrpqx9g6d299twh09c7nqf5ssk9y9327hkmazs82mct62v9dqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q5xcn4r",
            "lockTx": "b9cb604d1cead1afdd6c9403cae411234b19efc7cc78c1c060af69746fd223c2"
        }
    }
}
`
            },
{
            id: 7,
            name: "data2.json",
            parentId: 5,
            type: "json",
            data: `{
    "exports": {
        "Lock_Demo": {
        "lockUTXO": 0,
        "lock": [
        {
            "policyId": "ada",
            "assetName": "ada",
            "quantity": "5000000"
        }
        ],
            "smartContract": "56550100002225333573466e1cdd68011bad0031498581",
            "smartContractHash": "c203151a6a8a55baef2e3d302690858a42c55ebdb7d140eade17a530",
            "smartContractAddress": "addr_test1zrpqx9g6d299twh09c7nqf5ssk9y9327hkmazs82mct62v9dqwj2u3djrag0mene2cm9elu5mdqmcz9zc2rzgq7c5g6q5xcn4r",
            "lockTx": "b9cb604d1cead1afdd6c9403cae411234b19efc7cc78c1c060af69746fd223c2"
        }
    }
}
`
            } 
]
        }
;

export default project;

