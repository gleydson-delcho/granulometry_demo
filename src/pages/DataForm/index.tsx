import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import HeaderInfo from "../../components/HeaderInfo";
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
    openingSieve: number;
    tare: number;
    tareMaterial: number;
    // retained: null;
    // percRetained: null;
}


const DataForm = () => {

    // Esta variável é responsável por passar as propriedades de cabeçalho da página.
    const headerProps = {
        path: '/',
        attention: 'Estes dados devem ser cadastrados para cada peneira com a qual foi realizado o ensaio...',
        titleForm: 'Formulário para cadastrar os dados da granulometria',
        warning: 'Caso ainda não tenha um teste cadastrado, acesse clicando no botão abaixo para cadastrar o teste.'
    }

    const history = useHistory();

    const [isActive, setIsActive] = useState<boolean>(false);
    const [isNotCreate, setIsNotCreate] = useState<boolean>(false);

    const [useId, setUseId] = useState(0);

    const [sieveName, setSieveName] = useState('');
    const [openingSieve, setOpeningSieve] = useState(0);
    const [tare, setTare] = useState(0);
    const [tareMaterial, setTareMaterial] = useState(0);

    // Variáveis responsáveis por recuperar os dados do localstorage.
    const testData = JSON.parse(String(localStorage.getItem('test'))) || [];
    const formData = JSON.parse(String(localStorage.getItem('formData'))) || [];
    
    //Variável que realiza o incremento para o id (identificador) de cada dado cadastrado.
    const idIncrement = formData.length === undefined ? 0 : formData.length + 1;

    //Esta função é responsável por enviar os dados do formulário para o localstorage.
    const register = async (event: FormEvent) => {
        event.preventDefault();

        // Variável responsável por criar o objeto a ser enviado ao localstorage.
        const values: FormData = {
            id: idIncrement,
            testId: { id: useId },
            sieveName: sieveName,
            openingSieve: openingSieve,
            tare: tare,
            tareMaterial: tareMaterial,
        }

        //Condição de sucesso ou falha ao gravar os dados
        if (!values) {
            errorMessage();
        } else {
            formData.push(values);
            localStorage.setItem('formData', JSON.stringify(formData));
            successMessage();
        }
    };

    //Funções para ativar a mensagem de sucesso e erro.
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
                <HeaderInfo 
                    path={headerProps.path}
                    titleForm={headerProps.titleForm}
                    attention={headerProps.attention}
                    warning={headerProps.warning}
                    />
                    
                <a href='/cadastrar-teste' className="button" >
                    Novo Teste +
                </a>

                <form className="formData" onSubmit={register}>
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
                            onChange={e => setSieveName(((e.target.value)))}
                        />
                    </div>
                    <div className="fields">
                        <label htmlFor="aberturaPeneira">
                            Informe a abertura da peneira em milimetros (mm):
                        </label>
                        <input placeholder="4.75"
                            type="number"
                            step='0.01'
                            name="aberturaPeneira"
                            required
                            onChange={e => setOpeningSieve(Number((e.target.value).split(',').join('.')))}
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