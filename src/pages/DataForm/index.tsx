import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import './form.scss';

export interface Value {
    id: number;
    test: string;
    qtdMaterial: number;
};

interface FormData {
    id: number;
    testId: { id: number; };
    sieveName: string;
    openingSieve: string;
    tare: number;
    tareMaterial: number;
    // retained: null;
    // percRetained: null;
}

const DataForm = () => {

    const history = useHistory();

    const [isActive, setIsActive] = useState<boolean>(false);
    const [helpActive, setHelpActive] = useState<boolean>(false);
    const [isNotCreate, setIsNotCreate] = useState<boolean>(false);

    const [useId, setUseId] = useState(0);

    const [sieveName, setSieveName] = useState('');
    const [openingSieve, setOpeningSieve] = useState('');
    const [tare, setTare] = useState(0);
    const [tareMaterial, setTareMaterial] = useState(0);

    const testData = JSON.parse(String(localStorage.getItem('test'))) || [];
    const formData = JSON.parse(String(localStorage.getItem('formData'))) || [];
    const idIncrement = formData.length === undefined ? 0 : formData.length + 1;

    const register = async (event: FormEvent) => {
        event.preventDefault();

        const values: FormData = {
            id: idIncrement,
            testId: { id: useId },
            sieveName: sieveName,
            openingSieve: openingSieve,
            tare: tare,
            tareMaterial: tareMaterial,
            // retained: null,
            // percRetained: null,
        }
        console.log(values);
        if (!values) {
            errorMessage();
        } else {
            formData.push(values);
            localStorage.setItem('formData', JSON.stringify(formData));
            successMessage();
        }
    };

    const successMessage = () => {
        setIsActive(true)
        setTimeout(() => {
            setIsActive(false);
            history.push('/');
        }, 2000)
    };
    const errorMessage = () => {
        setIsNotCreate(true);
        setTimeout(() => {
            setIsNotCreate(false);
        }, 2000)
    };

    return (
        <>
            <div className="container">

                <a href='/' className="back" >
                    <img src="./images/back.svg" alt="back" />
                </a>

                <div className="head">
                    <h2>Formulário para cadastrar os dados da granulometria</h2>

                    <p className="help"> <img src="" alt="help" onClick={() => { helpActive == false ? setHelpActive(true) : setHelpActive(false) }} /> Ajuda!</p>
                    {
                        helpActive &&
                        <div className="helpInfo">
                            <h2>Atenção !!!</h2>
                            <p>Estes dados devem ser cadastrados para cada peneira com a qual foi realizado o ensaio...</p>
                            <h2>Importante !!!</h2>
                            <p>Caso ainda não tenha um teste cadastrado, acesse clicando no botão abaixo para cadastrar o teste.</p>
                        </div>
                    }
                    <a href='/cadastrar-teste' className="button" >
                        Novo Teste +
                    </a>
                </div>
                <form className="form" onSubmit={register}>
                    <div className="fields">
                        <label htmlFor="testId">Informe o código do teste que deseja ser relacionado: </label>
                        <select
                            className="selection" value={useId}
                            onChange={e => setUseId(Number(e.target.value))}
                        >
                            <option value="" >Selecione o código desejado</option>
                            {
                                testData?.map((el: Value) => {
                                    return (
                                        <option key={el.id} value={el.id}>{el.test}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="fields">
                        <label htmlFor="nomePeneira">
                            Informe o nome da peneira:
                        </label>
                        <input placeholder="peneira de 4,75mm"
                            type="text"
                            name="nomePeneira"
                            required
                            onChange={e => setSieveName(e.target.value)}
                        />
                    </div>
                    <div className="fields">
                        <label htmlFor="aberturaPeneira">
                            Informe a abertura da peneira em milimetros (mm):
                        </label>
                        <input placeholder="4.75"
                            type="text"
                            name="aberturaPeneira"
                            required
                            onChange={e => setOpeningSieve(e.target.value)}
                        />
                    </div>
                    <div className="fields">
                        <label htmlFor="tara">
                            Informe o valor da tara da peneira em gramas:
                        </label>
                        <input placeholder="450"
                            type="number"
                            step='0.01'
                            name="tara"
                            required
                            onChange={e => setTare(Number((e.target.value).split(',').join('.')))}
                        />
                    </div>
                    <div className="fields">
                        <label htmlFor="taraEMaterial">
                            Informe o valor total da tara e do material em gramas:
                        </label>
                        <input placeholder="497"
                            type="number"
                            step="0.01"
                            name="taraEMaterial"
                            required
                            onChange={e => setTareMaterial(Number((e.target.value).split(',').join('.')))}
                        />
                    </div>
                    <button type="submit" className="button" >Cadastrar</button>
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
                </form>

            </div>
        </>
    );
}

export default DataForm;