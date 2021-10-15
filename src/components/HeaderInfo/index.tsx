
import { useState } from 'react';
import { IoMdHelpCircle } from 'react-icons/io';

import './header.scss';

interface HeaderProps {
    path: string;
    titleForm: string;
    attention: string;
    warning?: string;
}

const HeaderInfo = (props: HeaderProps) => {


    const [helpActive, setHelpActive] = useState<boolean>(false);

    return (

        <>
            <div className="headerOptions">
                <a href={props.path} className="back" >
                    <img src="./images/back.svg" alt="back" />
                </a>
                <p className="help"><IoMdHelpCircle size="2rem" color="#6264ee" onClick={() => { helpActive === false ? setHelpActive(true) : setHelpActive(false) }} cursor="pointer" /><span>Ajuda!</span></p>
            </div>
            <div className="head">
                <h2> {props.titleForm} </h2>

                {
                    helpActive &&
                    <div className="helpInfo">
                        <h2>Atenção !!!</h2>
                        <p> {props.attention} </p>
                        <h2>Importante !!!</h2>
                        <p> {props.warning} </p>
                    </div>
                }
            </div>
        </>
    )
}

export default HeaderInfo;
