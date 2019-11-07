import React from 'react';
import useNetwork from '../../hook';


export default function Main() {
    var { nodes } = useNetwork();

    return (
        <div>
            Make component here
            {nodes.map((node)=>{
                return (
                    <div>
                        {node}
                    </div>
                )
            })}
        </div>
    )

}