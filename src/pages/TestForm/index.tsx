import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import './formTest.scss';

export interface Value {
    id: number;
    test: string;
    qtdMaterial: number;
};

const TestForm = () => {

    const history = useHistory();

    const [newTest, setNewTest] = useState<string>('');
    const [newQtd, setNewQtd] = useState<number>(0);

    const [isActive, setIsActive] = useState<boolean>(false);
    const [isNotCreate, setIsNotCreate] = useState<boolean>(false);

    const testData = JSON.parse(String(localStorage.getItem('test'))) || [];
    const idIncrement = testData.length === undefined ? 0 : testData.length + 1;

    const register = async (event: FormEvent) => {
        event.preventDefault();

        const value: Value = {
            id: idIncrement,
            test: newTest,
            qtdMaterial: newQtd
        };

        if (!value.test || !value.qtdMaterial) {
            setIsNotCreate(true);
            setTimeout(() => {
                setIsNotCreate(false)
            }, 2000);
        } else {

            testData.push(value);
            localStorage.setItem('test', JSON.stringify(testData));
            setIsActive(true);
            setTimeout(() => {
                setIsActive(false)
                history.push('/cadastrar-dados')
            }, 2000);
        }
    };

    return (
        <>
            <div className="container" >
                <a href='/cadastrar-dados' className="back" >
                    <img src="./images/back.svg" alt="back" />
                </a>

                <div className="head">
                    <p>Ajuda!</p>
                    <h2>Formulário para cadastrar um novo teste de granulometria</h2>
                    <h2>Atenção !!!</h2>
                    <p>Aqui será informado apenas o nome que deseja dar ao teste</p>
                </div>
                <form className="form" onSubmit={register} id="form">
                    {
                        isActive &&
                        <div id="success" className="success">
                            <p>Salvo com sucesso!</p>
                        </div>
                    }
                    {
                        isNotCreate &&
                        <div id="error" className="error">
                            <p>Os dados não foram salvos!</p>
                        </div>
                    }
                    <div className="fields">
                        <label htmlFor="test">
                            Informe o nome do teste que deseja relacionar o seu trabalho:
                        </label>
                        <input placeholder="Ex.: Areia - fina"
                            type="text"
                            name="test"
                            required
                            onChange={e => setNewTest(e.target.value)}
                        />
                    </div>
                    <div className="fields">
                        <label htmlFor="qtdMaterial">
                            Informe a quantidade de material total utilizado:
                        </label>
                        <input placeholder="Ex.: 1000g"
                            type="number"
                            name="qtdMaterial"
                            required onChange={e => setNewQtd(Number(e.target.value))}
                        />
                    </div>
                    <button type="submit" className="button" onClick={() => register}>Salvar</button>

                </form>
            </div>
        </>
    );
}

export default TestForm;