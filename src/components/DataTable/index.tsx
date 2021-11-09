import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';

import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import './table.scss';

export interface TestData {
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
};

const DataTable = () => {
    // Variaveis de recuperação de dados do localstorage.
    const dataForm = JSON.parse(String(localStorage.getItem('formData')));
    const dataTest = JSON.parse(String(localStorage.getItem('test')))

    const [useId, setUseId] = useState(1);
    const [testData] = useState<[TestData]>(dataTest);
    const [formData, setFormData] = useState<[FormData]>(dataForm);

    useEffect(() => {
    }, [formData, testData])


    //Esta variável seleciona os dados por id (identificador).
    const selectDataForId = formData?.filter(item => {
        if (item.testId.id === useId) {
            return item;
        } else {
            return false;
        }
    });

    // Variável responsável por ordenar os dados, a ordem é da peneira de maior abertura para a de menor.
    const orderBySieve = selectDataForId?.sort((a, b) => ((a.openingSieve) > (b.openingSieve)) ? -1 : 1);

    // Função responsável por excluir o item indicado do localstorage.
    const removeItem = (index: number) => {

        if (index) {
            formData?.splice(index - 1, 1);
            localStorage.setItem('formData', JSON.stringify(formData));
            setFormData(JSON.parse(String(localStorage.getItem('formData'))));

        } else {
            alert("O item não foi removido!")
        }
    };

    // Variável que resgata o valor da quantidade de material utilizado.
    const qtdPerTestId = testData?.[useId - 1].qtdMaterial || 0;

    // Variável responsável por realizar a quantidade de material retida em porcetagem.
    const percRetained = selectDataForId?.map(item => {
        const solids = (Number(item.tareMaterial) - Number(item.tare)).toFixed(2);
        const retainedMaterial = (Number(solids) / qtdPerTestId) * 100;
        return retainedMaterial
    });

    //Esta variável é responsável por retornar os valores a serem exibidos no gráfico
    const returnResultDataChart = orderBySieve?.map((item, index) => {
        let newReturnAcc: number[][] = [];
        percRetained?.reduce(function (a: number, b: number, i: number): number { return Number((newReturnAcc[i]) = [a + b]) }, 0);
        return [Number(item.openingSieve), ...newReturnAcc[index]];

    });

    //Esta variável controla o gráfico, estilo, formatos e demais características de designer.
    const mockData = {

        options: {
            title: 'Abertura vs. % Retido Acumulada',
            hAxis: { title: 'Abertura (mm)', logScale: true },
            vAxis: { title: '% Retido Acumulada', direction: '-1' },
            legend: 'none',
            backgroundColor: '#F0F8FF',

        },
        xaxis: {
            title: 'Abertura',
        },
        yaxis: {
            title: '%RetidoAcumulado',
        },
    }

    //Esta parte da lógica controla a função de exportar dados.
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; chasrset=UTF-8';
    const fileExtension = '.xlsx';
    const exporting = () => {

        const csvData = selectDataForId;
        const fileName = 'Granulometria'

        const ws = XLSX.utils.json_to_sheet(csvData || []);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    //Estas variáveis estilizam o tamanho do gráfico a ser exibido de acord com o tamanho da tela do dispositivo.
    const heigthScreen = window.screen.height > 650 ? '25rem' : '18rem';
    const widthScreen = window.screen.width > 710 ? '43rem' : '18rem';

    console.log(returnResultDataChart)

    return (
        <div className="container">
            <div className="title">
                <h1>Dashboard Granulometria</h1>
                <h3>Gráfico da distribuição granulométrica</h3>
            </div>

            {
                useId === undefined ? '' :

            <section className="select">

                <label htmlFor="select">Escolha o material: </label>
                <select
                    className="selection" value={useId}
                    onChange={e => setUseId((Number(e.target.value)))}
                >
                    {
                        testData?.map(el => {
                            return (
                                <option key={el.id} value={el.id}>{el.test}</option>
                            )
                        })
                    }
                </select>
            </section>
            }

            <section className="data">
                <div className="chart">
                    {
                        returnResultDataChart === undefined ?

                            <h1>Adicione dados para que o gráfico seja exibido!</h1> :

                        <Chart
                            height={heigthScreen}
                            width={widthScreen}
                            chartType="ScatterChart"
                            loader={<div>Loading Chart</div>}
                            options={mockData.options}
                            data={[
                                [mockData.xaxis.title, mockData.yaxis.title],
                                ...returnResultDataChart || []
                            ]}
                            rootProps={{ 'data-testid': 1 }}
                        />
                        }
                </div >



                <div className="table" key="table">
                    <h2 >Dados - peneiramento</h2>
                    <button type="button" onClick={(e) => exporting()}>Exportar Excel</button>
                    <table id="dataTable" key="dataTable">
                        <thead key="header">
                            <tr key="title">
                                {/* <th>Test Id</th> */}
                                <th>Peneira</th>
                                <th>Abertura (mm)</th>
                                <th>Tara (g)</th>
                                <th>Tara + Material (g)</th>
                                <th>Retido (g)</th>
                                <th>% Retida (g)</th>
                                <th>% Retida Acumulada (g)</th>
                                <th>Remover</th>
                            </tr>
                        </thead>
                        <tbody key="body" >
                            {
                                orderBySieve?.map((item, index) => {

                                    const retained = (Number(item.tareMaterial) - Number(item.tare)).toFixed(2);

                                    const percRetained = (((Number(item.tareMaterial) - Number(item.tare)) / qtdPerTestId) * 100).toFixed(2);
                                    const AccumulatedSum = returnResultDataChart?.map(item => item[1])[0 + index];
                                    const dimensionSieve = ((item.openingSieve) * 100 / 100).toFixed(2);
                                    const cStyle = {
                                        cursor: "pointer"
                                    }
                                    return (
                                        <tr key={item.id}>
                                            {/* <td>{item.id}</td> */}
                                            <td>Peneira {dimensionSieve} mm</td>
                                            <td>{dimensionSieve}</td>
                                            <td>{(item.tare)}</td>
                                            <td>{(item.tareMaterial)}</td>
                                            <td>{retained}</td>
                                            <td>{percRetained}</td>
                                            <td>{AccumulatedSum?.toFixed(2)}</td>
                                            <td style={cStyle} onClick={() => removeItem(item.id)}><img src="/images/minus.svg" alt="remover" /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </section>

            <a className="button" href="/cadastrar-dados" >Novo +</a>
        </div>
    );
}

export default DataTable;